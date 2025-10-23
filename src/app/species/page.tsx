// species/page.tsx
import SpeciesGrid from './../components/SpeciesGrid';

export default function Species() {
  return (
    <div className='p-8 bg-black min-h-screen text-white'>
      <h1 className='text-3xl font-bold mb-4 pb-2'>
        Species Observed in Connecticut
      </h1>
      <SpeciesGrid />
    </div>
  );
}
