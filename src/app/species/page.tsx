import SpeciesGrid from './../components/SpeciesGrid';

async function fetchSpecies() {
  const res = await fetch(
    'https://api.inaturalist.org/v1/observations/species_counts?place_id=41&per_page=50'
  );
  const data = await res.json();
  return data.results;
}

export default async function Species() {
  const species = await fetchSpecies();

  return (
    <div className='p-8 bg-black min-h-screen text-white'>
      <h1 className='text-3xl font-bold mb-6 border-b border-white pb-2'>
        Species Native to Connecticut
      </h1>
      <SpeciesGrid initialSpecies={species} />
    </div>
  );
}
