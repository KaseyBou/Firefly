'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import SpeciesCard from './SpeciesCard';
import SpeciesModal from './SpeciesModal';
import { fetchWikipediaSummary } from '../libs/fetchWikipediaSummary';

type SpeciesGridProps = { initialSpecies: any[] };

export default function SpeciesGrid({ initialSpecies }: SpeciesGridProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<any | null>(null);

  const { data: speciesData = [], isLoading } = useQuery({
    queryKey: ['speciesWithSummaries', initialSpecies],
    queryFn: async () => {
      return Promise.all(
        initialSpecies.map(async (s) => {
          if (!s.taxon.wikipedia_url) return s;
          const summary = await fetchWikipediaSummary(s.taxon.wikipedia_url);
          return { ...s, taxon: { ...s.taxon, wikipedia_summary: summary } };
        })
      );
    },
  });

  const filteredSpecies = speciesData.filter((s) => {
    const name = s.taxon.preferred_common_name || s.taxon.name;
    const category = s.taxon.name; // optional category mapping
    return (
      name.toLowerCase().includes(search.toLowerCase()) &&
      (filter ? category.toLowerCase() === filter.toLowerCase() : true)
    );
  });

  if (isLoading) return <p>Loading species...</p>;

  return (
    <div>
      <div className='flex gap-4 mb-6'>
        <input
          type='text'
          placeholder='Search species...'
          className='p-2 rounded text-black flex-1'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className='p-2 rounded text-black'
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value=''>All Categories</option>
          <option value='Mammals'>Mammals</option>
          <option value='Birds'>Birds</option>
          <option value='Amphibians'>Amphibians</option>
          <option value='Reptiles'>Reptiles</option>
          <option value='Insects'>Insects</option>
          <option value='Fish'>Fish</option>
        </select>
      </div>

      <ul className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {filteredSpecies.map((s) => (
          <SpeciesCard
            key={s.taxon.id}
            species={s}
            onClick={() => setSelectedSpecies(s)}
          />
        ))}
      </ul>

      {selectedSpecies && (
        <SpeciesModal
          species={selectedSpecies}
          onClose={() => setSelectedSpecies(null)}
        />
      )}
    </div>
  );
}
