import Image from 'next/image';
import Link from 'next/link';

export default function About() {
  return (
    <main className='bg-[#121212] min-h-screen font-sans selection:bg-[#C8FF00] selection:text-black overflow-x-hidden relative'>
      {/* --- SECTION 1: THE MISSION --- */}
      <section className='relative h-[650px] md:h-[750px] w-full overflow-hidden flex flex-col justify-end pb-24 px-8 md:px-24'>
        <Image
          src='/Ct-Backdrop.jpg' // Your Connecticut vista image
          alt='Connecticut Vista Landscape'
          fill
          className='object-cover object-center opacity-80'
          priority
        />

        <div className='absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent z-10' />

        <div className='relative z-20 max-w-5xl mx-auto w-full'>
          <h1 className='text-4xl md:text-6xl lg:text-7xl font-light text-white leading-tight tracking-tight drop-shadow-2xl'>
            We are a <span className='font-black'>Connecticut</span> based{' '}
            <br />
            <span className='font-black'>Wildlife</span> conservation app
          </h1>
          <Link
            href='/signup'
            className='mt-10 inline-block bg-transparent text-white border-2 border-white/40 font-bold py-3.5 px-10 rounded-full hover:bg-white hover:text-black hover:border-white hover:scale-105 transition-all text-lg tracking-wide shadow-lg'
          >
            Join Us
          </Link>
        </div>
      </section>
      {/* --- SECTION 2: THE DESIRE --- */}
      <section className='relative min-h-[500px] md:min-h-[600px] w-full bg-[#171719] flex flex-col items-center justify-center text-center px-8 py-12'>
        {/* ANIMAL COMPOSITE AREA */}
        <div className='relative w-full max-w-xl h-[250px] md:h-[300px] mb-8 opacity-90 mx-auto'>
          {/* Bear */}
          <div className='absolute left-[12%] top-[25%] w-[38%] h-[50%] z-20'>
            <Image
              src='/bear-side-view-silhouette.png'
              alt='Bear Silhouette'
              fill
              className='object-contain invert brightness-100'
            />
          </div>

          {/* Owl */}
          <div className='absolute right-[22%] top-[5%] w-[16%] h-[30%] z-30'>
            <Image
              src='/eastern-owl.png'
              alt='Owl Outline'
              fill
              className='object-contain invert brightness-90 opacity-80'
            />
          </div>

          {/* Coyote */}
          <div className='absolute right-[12%] bottom-[15%] w-[26%] h-[35%] z-10'>
            <Image
              src='/coyote.png'
              alt='Coyote Outline'
              fill
              className='object-contain invert brightness-75 opacity-60'
            />
          </div>

          <div className='absolute inset-0 bg-white/5 blur-3xl rounded-full opacity-20' />
        </div>

        {/* Text Area */}
        <div className='max-w-4xl mx-auto w-full relative z-40'>
          <p className='text-3xl md:text-5xl lg:text-6xl text-white leading-[1.1] font-light tracking-tight'>
            With the <span className='font-black'>desire</span> to preserve{' '}
            <br />
            the{' '}
            <span className='font-black text-[#C8FF00] drop-shadow-[0_0_20px_rgba(200,255,0,0.4)]'>
              precious animals
            </span>{' '}
            so generations <br />
            can witness their <span className='font-black'>majesty</span>
          </p>

          {/* THE GLOWING BUTTON */}
          <div className='relative mt-10 inline-block group'>
            <div className='absolute inset-0 bg-[#C8FF00] blur-2xl opacity-20 group-hover:opacity-50 transition-opacity duration-500 animate-pulse' />

            <Link
              href='/species'
              className='relative z-10 inline-block bg-[#C8FF00] text-black font-black py-4 px-12 rounded-2xl text-xl hover:scale-105 transition-all uppercase tracking-widest shadow-[0_0_30px_rgba(200,255,0,0.3)] group-hover:shadow-[0_0_50px_rgba(200,255,0,0.6)]'
            >
              Start now!
            </Link>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: THE INSPIRATION --- */}
      <section className='relative h-[800px] md:h-[900px] w-full overflow-hidden flex flex-col justify-end pb-40 px-8 md:px-24'>
        <Image
          src='/firefly-night-background.jpg' // Your firefly night image
          alt='New England crisp summer night with fireflies'
          fill
          className='object-cover object-center opacity-85'
        />

        {/* --- FIREFLY PULSE EFFECT --- */}

        <div className='absolute inset-0 z-10 pointer-events-none'>
          <div
            className='absolute top-[30%] right-[20%] w-60 h-60 bg-[#C8FF00]/10 blur-3xl animate-pulse rounded-full'
            style={{ animationDuration: '6s' }}
          />
          <div
            className='absolute bottom-[40%] left-[15%] w-40 h-40 bg-[#C8FF00]/15 blur-3xl animate-pulse rounded-full'
            style={{ animationDuration: '4s', animationDelay: '1s' }}
          />
        </div>

        {/* Deeper gradient for Section 3 text readability */}
        <div className='absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/60 to-transparent z-15' />

        <div className='relative z-20 max-w-5xl mx-auto w-full'>
          <p className='text-3xl md:text-5xl lg:text-6xl text-white leading-tight font-light tracking-tight'>
            Inspired by my <span className='font-black'>childhood</span>,
            remembering <br />
            <span className='font-black'>New England</span> crisp{' '}
            <span className='font-black text-[#C8FF00] italic'>
              summer nights
            </span>{' '}
            and <br />
            seeing <span className='font-black'>fireflies everywhere</span>
          </p>
          <Link
            href='/signup'
            className='mt-16 inline-block bg-[#C8FF00] text-black font-black py-4 px-12 rounded-2xl text-xl hover:scale-110 hover:shadow-[0_15px_40px_rgba(200,255,0,0.4)] transition-all uppercase tracking-widest'
          >
            Become a Firefly!
          </Link>
        </div>
      </section>

      {/* Very subtle structural footer divider */}
      <div className='pb-16 text-center opacity-5 relative z-20'>
        <div className='h-px bg-gradient-to-r from-transparent via-white to-transparent w-full mb-8' />
      </div>
    </main>
  );
}
