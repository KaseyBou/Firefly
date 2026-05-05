'use client';

import Card from './Card';
import type { TSpecies } from '../libs/types';

type SpeciesCardProps = {
  species: TSpecies;
  onClick: () => void;
};

export default function SpeciesCard({ species, onClick }: SpeciesCardProps) {
  const { taxon } = species;

  const common = taxon.preferred_common_name;
  const sci = taxon.name;
  const image = taxon.default_photo?.medium_url || '/placeholder.jpg';

  // Logic for the conservation status badge
  const statusName = taxon.conservation_status?.status_name ?? 'Unknown';
  const isThreatened =
    statusName !== 'Unknown' && statusName !== 'Least Concern';

  return (
    <Card
      imageSrc={image}
      title={common || sci}
      subtitle={common ? sci : undefined}
      onClick={onClick}
    >
      <div className='mt-3 flex items-center gap-2'>
        {/* Modern Badge Style */}
        <span
          className={`text-[10px] uppercase font-black px-2 py-1 rounded-md tracking-wider ${
            isThreatened
              ? 'bg-red-500/10 text-red-500 border border-red-500/20'
              : 'bg-zinc-800 text-zinc-400 border border-zinc-700/50'
          }`}
        >
          {statusName}
        </span>
      </div>
    </Card>
  );
}
