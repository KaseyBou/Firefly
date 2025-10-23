// libs/types.ts
export type ConservationStatus = {
  status_name?: string | null; // e.g. "Endangered"
  iucn?: string | null; // e.g. "EN", "VU"
};

export type Photo = {
  medium_url?: string;
};

export type Taxon = {
  id: number;
  name: string; // scientific name
  preferred_common_name?: string;
  iconic_taxon_name?: string; // e.g. "Mammalia", "Aves"
  wikipedia_url?: string;
  wikipedia_summary?: string;
  default_photo?: Photo;
  conservation_status?: ConservationStatus | null;
  native_status?: string | null;
  // optional GBIF fields if you enrich later
  gbif?: {
    speciesKey?: number;
    matchScore?: number;
  };
};

export type TSpecies = {
  taxon: Taxon;
};
