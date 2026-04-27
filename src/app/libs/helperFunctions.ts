import { TSpecies } from './types';

/**
 * Fetch a Wikipedia summary using either a wikipedia_url or a scientific name.
 */
export async function fetchWikipediaSummary(
  wikiUrlOrName: string,
): Promise<string | undefined> {
  try {
    const maybeTitle =
      wikiUrlOrName.includes('wikipedia.org') && wikiUrlOrName.split('/').length
        ? wikiUrlOrName.split('/').pop()
        : wikiUrlOrName;
    if (!maybeTitle) return undefined;
    const title = encodeURIComponent(maybeTitle);
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`,
    );
    if (!res.ok) return undefined;
    const data = await res.json();
    return data.extract ?? undefined;
  } catch (err) {
    console.warn('fetchWikipediaSummary error', err);
    return undefined;
  }
}

/**
 * Fetch IUCN status by scientific name.
 */
export async function fetchIUCNStatus(
  scientificName: string,
): Promise<string | undefined> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_IUCN_API_KEY;
    if (!apiKey) return undefined;
    const encoded = encodeURIComponent(scientificName);
    const res = await fetch(
      `https://apiv3.iucnredlist.org/api/v3/species/${encoded}?token=${apiKey}`,
    );
    if (!res.ok) return undefined;
    const data = await res.json();
    const cat = data.result?.[0]?.category ?? data.result?.[0]?.status_name;
    return cat ?? undefined;
  } catch (err) {
    console.warn('fetchIUCNStatus error', err);
    return undefined;
  }
}

/**
 * Fetch species list from iNaturalist species_counts for a place.
 */
export async function fetchSpeciesHybrid({
  placeId = 37,
  taxa = [],
  page = 1,
  per_page = 50,
}: {
  placeId?: number;
  taxa?: string[];
  page?: number;
  per_page?: number;
}) {
  const taxaParam = (taxa || []).join(',');
  const url = `https://api.inaturalist.org/v1/observations/species_counts?place_id=${placeId}&iconic_taxa=${taxaParam}&page=${page}&per_page=${per_page}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`iNaturalist fetch failed: ${res.status}`);
  const data = await res.json();

  const allSpecies: TSpecies[] =
    (data.results || []).map((item: any) => ({
      taxon: {
        id: item.taxon?.id,
        name: item.taxon?.name,
        preferred_common_name: item.taxon?.preferred_common_name,
        iconic_taxon_name: item.taxon?.iconic_taxon_name,
        wikipedia_url: item.taxon?.wikipedia_url,
        default_photo: item.taxon?.default_photo
          ? { medium_url: item.taxon.default_photo.medium_url }
          : undefined,
        conservation_status: item.taxon?.conservation_status || null,
      },
    })) || [];

  return allSpecies;
}

/**
 * Fetch establishment status using iNaturalist taxa endpoint.
 */
export async function fetchEstablishmentStatus(
  taxonId: number,
): Promise<string> {
  try {
    const res = await fetch(`https://api.inaturalist.org/v1/taxa/${taxonId}`);
    if (!res.ok) return 'Unknown';
    const data = await res.json();
    const status = data?.results?.[0]?.establishment_means;
    if (!status) return 'Unknown';
    switch (status.toLowerCase()) {
      case 'native':
        return 'Native';
      case 'introduced':
        return 'Introduced';
      case 'managed':
        return 'Managed / Captive';
      case 'uncertain':
        return 'Uncertain';
      default:
        return 'Unknown';
    }
  } catch (err) {
    console.warn('fetchEstablishmentStatus error', err);
    return 'Unknown';
  }
}

/**
 * Normalizes species names for comparison
 * (e.g., "White-Tailed Deer" -> "whitetaileddeer")
 */
export const normalizeName = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
};

/**
 * Calculates the start date based on the user's selected time filter
 */
export const getStartDate = (filter: string) => {
  const now = new Date();
  switch (filter) {
    case '24h':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case 'week':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case 'month':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    default:
      return null; // For 'all'
  }
};

/**
 * The actual rough shape of CT for visual and logic accuracy.
 * This is a simplified polygon of the state's borders.
 */
export const CT_POLYGON: [number, number][] = [
  [42.05, -73.48],
  [42.05, -71.79],
  [41.95, -71.79],
  [41.25, -71.85],
  [41.2, -73.0],
  [41.0, -73.65],
  [41.15, -73.72],
  [42.05, -73.48],
];

/**
 * High-precision check to see if a point is inside the CT Polygon.
 * Uses the ray-casting algorithm.
 */
export const isInsideCT = (lat: number, lng: number) => {
  let isInside = false;
  // Iterate through each edge of the polygon
  for (let i = 0, j = CT_POLYGON.length - 1; i < CT_POLYGON.length; j = i++) {
    const [latI, lngI] = CT_POLYGON[i];
    const [latJ, lngJ] = CT_POLYGON[j];

    // Check if the ray from the point intersects with the edge
    const intersect =
      lngI > lng !== lngJ > lng &&
      lat < ((latJ - latI) * (lng - lngI)) / (lngJ - lngI) + latI;

    if (intersect) isInside = !isInside;
  }
  return isInside;
};
