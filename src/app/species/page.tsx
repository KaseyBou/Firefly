// species/page.tsx
import SpeciesGrid from './../components/SpeciesGrid';

export default function Species() {
  return (
    <main className='min-h-screen bg-[#050505] text-white selection:bg-[#C8FF00] selection:text-black'>
      <div className='max-w-7xl mx-auto px-6 py-12 md:py-16'>
        <header className='mb-10'>
          <h1 className='text-3xl md:text-5xl font-black tracking-tighter mb-2'>
            Connecticut <span className='text-[#C8FF00]'>Wildlife</span>
          </h1>
          <p className='text-zinc-500 font-medium text-sm md:text-base'>
            Discover and track species native to the Constitution State.
          </p>
        </header>

        <SpeciesGrid />
      </div>
    </main>
  );
}
