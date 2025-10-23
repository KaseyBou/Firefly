import SpeciesGridClient from './SpeciesGridClient';
import { fetchSpeciesHybrid } from '../libs/helperFunctions';
import { IconicTaxa } from '../libs/taxa';
import type { TSpecies } from '../libs/types';
import { CONNECTICUT_NATIVE_SPECIES_SET } from '../libs/whitelist';

const PER_PAGE = 50;

type SpeciesGridProps = {
  initialFilter?: string;
};

export default async function SpeciesGrid({ initialFilter }: SpeciesGridProps) {
  const selectedTaxa = [
    IconicTaxa.Mammalia,
    IconicTaxa.Aves,
    IconicTaxa.Reptilia,
    IconicTaxa.Amphibia,
    IconicTaxa.Actinopterygii,
    IconicTaxa.Insecta,
  ];

  const initialSpecies: TSpecies[] = await fetchSpeciesHybrid({
    placeId: 37,
    taxa: selectedTaxa,
    page: 1,
    per_page: PER_PAGE,
  });

  const filteredInitialSpecies = initialSpecies.filter((s) =>
    CONNECTICUT_NATIVE_SPECIES_SET.has(
      (s.taxon.name || s.taxon.preferred_common_name || '').toLowerCase()
    )
  );

  return (
    <SpeciesGridClient
      initialSpecies={filteredInitialSpecies}
      initialFilter={initialFilter}
    />
  );
}
