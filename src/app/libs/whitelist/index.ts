import { CONNECTICUT_AMPHIBIANS } from './amphibians';
import { CONNECTICUT_BIRDS } from './birds';
import { CONNECTICUT_FISH } from './fish';
import { CONNECTICUT_MAMMALS } from './mammals';
import { CONNECTICUT_REPTILES } from './reptiles';

//export

export { CONNECTICUT_AMPHIBIANS } from './amphibians';
export { CONNECTICUT_BIRDS } from './birds';
export { CONNECTICUT_FISH } from './fish';
export { CONNECTICUT_MAMMALS } from './mammals';
export { CONNECTICUT_REPTILES } from './reptiles';

// Combined whitelist (useful for a quick lookup by scientific name)
export const CONNECTICUT_NATIVE_SPECIES: string[] = [
  ...CONNECTICUT_MAMMALS,
  ...CONNECTICUT_BIRDS,
  ...CONNECTICUT_REPTILES,
  ...CONNECTICUT_AMPHIBIANS,
  ...CONNECTICUT_FISH,
];

// For fast lookup (optional)
export const CONNECTICUT_NATIVE_SPECIES_SET = new Set(
  CONNECTICUT_NATIVE_SPECIES.map((s) => s.toLowerCase())
);
