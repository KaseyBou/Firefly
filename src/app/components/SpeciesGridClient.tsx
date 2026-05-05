'use client';

import { useState, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useSession } from 'next-auth/react';
import SpeciesCard from './SpeciesCard';
import SpeciesModal from './SpeciesModal';
import { fetchSpeciesHybrid } from '../libs/helperFunctions';
import { IconicTaxa, TAXA_LABELS } from '../libs/taxa';
import type { TSpecies } from '../libs/types';
import { CONNECTICUT_NATIVE_SPECIES_SET } from '../libs/whitelist';

const PER_PAGE = 50;

interface SpeciesGridClientProps {
  initialSpecies?: TSpecies[];
  initialFilter?: string;
}

export default function SpeciesGridClient({
  initialSpecies = [],
  initialFilter = '',
}: SpeciesGridClientProps) {
  // FIX: Destructure both session data and status
  const { data: session, status } = useSession();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(initialFilter);
  const [selectedSpecies, setSelectedSpecies] = useState<TSpecies | null>(null);

  const taxaForAllAnimals = useMemo(
    () => [
      IconicTaxa.Mammalia,
      IconicTaxa.Aves,
      IconicTaxa.Reptilia,
      IconicTaxa.Amphibia,
      IconicTaxa.Actinopterygii,
      IconicTaxa.Insecta,
    ],
    [],
  );

  const selectedTaxa = useMemo(() => {
    if (!filter) return taxaForAllAnimals;
    const entry = Object.entries(TAXA_LABELS).find(
      ([, label]) => label === filter,
    );
    if (!entry) return taxaForAllAnimals;
    const key = entry[0] as keyof typeof IconicTaxa;
    return [IconicTaxa[key]];
  }, [filter, taxaForAllAnimals]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<TSpecies[], Error>({
      queryKey: ['inaturalist-species', selectedTaxa.join(','), filter],
      queryFn: async ({ pageParam = 1 }) => {
        const page = Number(pageParam);
        return fetchSpeciesHybrid({
          placeId: 37,
          taxa: selectedTaxa,
          page,
          per_page: PER_PAGE,
        });
      },
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length === PER_PAGE ? allPages.length + 1 : undefined,
      initialPageParam: 1,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    });

  const speciesData: TSpecies[] =
    data?.pages.flatMap((p) => p) ?? initialSpecies;

  const filteredSpecies = speciesData.filter((s) => {
    const name = (
      s.taxon.preferred_common_name ||
      s.taxon.name ||
      ''
    ).toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase());
    if (filter === TAXA_LABELS.Insecta) return matchesSearch;

    const isNative = CONNECTICUT_NATIVE_SPECIES_SET.has(
      s.taxon.name?.toLowerCase() || '',
    );
    return matchesSearch && isNative;
  });

  const { ref, inView } = useInView({ threshold: 0.5 });

  if (inView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  // Inside SpeciesGridClient.tsx return statement:
  return (
    <div className='space-y-8'>
      {/* SEARCH & FILTER BAR */}
      <div className='flex flex-col md:flex-row gap-4'>
        <div className='relative flex-1'>
          <input
            type='text'
            placeholder='Search species...'
            className='w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C8FF00] focus:ring-1 focus:ring-[#C8FF00] transition-all'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className='p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#C8FF00] appearance-none cursor-pointer md:w-64'
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value=''>All Categories</option>
          {Object.values(TAXA_LABELS).map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {isLoading && !speciesData.length ? (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse'>
          {[...Array(8)].map((_, i) => (
            <div key={i} className='h-64 bg-zinc-900 rounded-2xl' />
          ))}
        </div>
      ) : !filteredSpecies.length ? (
        <div className='py-20 text-center border border-dashed border-zinc-800 rounded-3xl'>
          <p className='text-zinc-500'>No creatures found in this category.</p>
        </div>
      ) : (
        /* THE GRID */
        <ul className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8'>
          {filteredSpecies.map((s) => (
            <SpeciesCard
              key={s.taxon.id}
              species={s}
              onClick={() => setSelectedSpecies(s)}
            />
          ))}
        </ul>
      )}

      <div ref={ref} className='py-12 flex justify-center'>
        {isFetchingNextPage && (
          <div className='flex gap-2 items-center text-[#C8FF00] font-bold uppercase tracking-widest text-xs'>
            <span className='w-2 h-2 bg-[#C8FF00] rounded-full animate-bounce' />
            Scanning more species...
          </div>
        )}
      </div>

      {selectedSpecies && (
        <SpeciesModal
          key={`modal-${selectedSpecies.taxon.id}`}
          species={selectedSpecies}
          onClose={() => setSelectedSpecies(null)}
        />
      )}
    </div>
  );
}
