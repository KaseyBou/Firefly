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
  const statusName = taxon.conservation_status?.status_name ?? 'Unknown';
  const statusColor =
    statusName && statusName !== 'Unknown' ? 'text-red-400' : 'text-gray-400';

  return (
    <Card
      imageSrc={image}
      title={common || sci}
      subtitle={common ? sci : undefined}
      onClick={onClick}
    >
      <p className={`text-sm mt-1 ${statusColor}`}>
        Conservation Status: {statusName}
      </p>
    </Card>
  );
}
