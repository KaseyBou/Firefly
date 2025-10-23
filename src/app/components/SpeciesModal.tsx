'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchWikipediaSummary } from '../libs/helperFunctions';
import type { TSpecies } from '../libs/types';

interface SpeciesModalProps {
  species: TSpecies;
  onClose: () => void;
}

export default function SpeciesModal({ species, onClose }: SpeciesModalProps) {
  const taxon = species.taxon;

  const { data: wikipediaSummary, isLoading } = useQuery({
    queryKey: ['wikipedia-summary', taxon.id],
    queryFn: () =>
      fetchWikipediaSummary(taxon.wikipedia_url || taxon.name || ''),
    staleTime: Infinity,
    enabled: !!taxon.id,
  });

  return (
    <div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4'>
      <div className='bg-black rounded-lg p-6 max-w-xl w-full relative'>
        <button
          onClick={onClose}
          className='absolute top-2 right-2 px-2 py-1 bg-gray-200 rounded'
        >
          Close
        </button>
        <img
          src={species.taxon.default_photo?.medium_url || '/placeholder.jpg'}
          alt={species.taxon.preferred_common_name || species.taxon.name}
          className='w-full h-40 object-cover rounded'
        />

        <h2 className='text-xl font-bold mb-2'>
          {taxon.preferred_common_name || taxon.name}
        </h2>
        <p className='text-sm italic mb-4'>{taxon.name}</p>

        <p className='text-sm mt-1'>
          Conservation Status:{' '}
          {taxon.conservation_status?.status_name ?? 'Unknown'}
        </p>

        {isLoading && <p>Loading ...</p>}
        {!isLoading && wikipediaSummary && <p>{wikipediaSummary}</p>}
        {!isLoading && !wikipediaSummary && (
          <p>No Wikipedia summary available.</p>
        )}
      </div>
    </div>
  );
}
