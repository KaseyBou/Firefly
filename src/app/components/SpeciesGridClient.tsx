'use client';

import { useState, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
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
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(initialFilter);
  const [selectedSpecies, setSelectedSpecies] = useState<TSpecies | null>(null);

  // All taxa
  const taxaForAllAnimals = useMemo(
    () => [
      IconicTaxa.Mammalia,
      IconicTaxa.Aves,
      IconicTaxa.Reptilia,
      IconicTaxa.Amphibia,
      IconicTaxa.Actinopterygii,
      IconicTaxa.Insecta,
    ],
    []
  );

  // Selected taxa based on filter
  const selectedTaxa = useMemo(() => {
    if (!filter) return taxaForAllAnimals;
    const entry = Object.entries(TAXA_LABELS).find(
      ([, label]) => label === filter
    );
    if (!entry) return taxaForAllAnimals;
    const key = entry[0] as keyof typeof IconicTaxa;
    return [IconicTaxa[key]];
  }, [filter, taxaForAllAnimals]);

  // Infinite query for species
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

  // Flatten pages
  const speciesData: TSpecies[] =
    data?.pages.flatMap((p) => p) ?? initialSpecies;

  // Filter client-side: search + whitelist (skip whitelist for Insects)
  const filteredSpecies = speciesData.filter((s) => {
    const name = (
      s.taxon.preferred_common_name ||
      s.taxon.name ||
      ''
    ).toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase());

    // If filter is Insects, skip whitelist check
    if (filter === TAXA_LABELS.Insecta) return matchesSearch;

    const isNative = CONNECTICUT_NATIVE_SPECIES_SET.has(
      s.taxon.name?.toLowerCase() || ''
    );
    return matchesSearch && isNative;
  });

  // Infinite scroll observer
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  if (inView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  return (
    <div>
      {/* Search + Filter: always render immediately */}
      <div className='flex gap-4 mb-6'>
        <input
          type='text'
          placeholder='Search species...'
          className='p-2 rounded text-black bg-white flex-1'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className='p-2 rounded text-black bg-white'
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

      {/* Species grid */}
      {isLoading && !speciesData.length ? (
        <p>Loading ...</p>
      ) : !filteredSpecies.length ? (
        <p>No species found.</p>
      ) : (
        <ul className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {filteredSpecies.map((s) => (
            <SpeciesCard
              key={s.taxon.id}
              species={s}
              onClick={() => setSelectedSpecies(s)}
            />
          ))}
        </ul>
      )}

      {/* Infinite scroll loading */}
      <div ref={ref} className='text-center mt-6'>
        {isFetchingNextPage && <p>Loading ...</p>}
      </div>

      {/* Modal */}
      {selectedSpecies && (
        <SpeciesModal
          species={selectedSpecies}
          onClose={() => setSelectedSpecies(null)}
        />
      )}
    </div>
  );
}
