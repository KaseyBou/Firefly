'use client';
import Card from './Card';

type SpeciesCardProps = {
  species: any;
  onClick: () => void;
};

export default function SpeciesCard({ species, onClick }: SpeciesCardProps) {
  const { taxon } = species;

  return (
    <Card
      imageSrc={taxon.default_photo?.medium_url || '/placeholder.jpg'}
      title={taxon.preferred_common_name || 'Unknown species'}
      subtitle={taxon.name}
      onClick={onClick}
    />
  );
}
