import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth();

  // AUTH GUARD: If user is logged in, redirect to the app logic
  if (session) {
    redirect('/species');
  }

  return (
    <main className='bg-[#121212] min-h-screen font-sans selection:bg-[#C8FF00] selection:text-black overflow-x-hidden'>
      {/* --- HERO SECTION --- */}
      <section className='relative h-[500px] md:h-[600px] w-full overflow-hidden rounded-b-[40px] md:rounded-b-[80px] shadow-2xl border-b border-white/5'>
        <Image
          src='/banner.jpg'
          alt='Firefly Forest'
          fill
          className='object-cover object-center opacity-60'
          priority
        />

        {/* Gradient overlay ensures text is readable over the forest image */}
        <div className='absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent' />

        <div className='absolute inset-0 flex flex-col justify-center px-6 md:px-24 max-w-7xl mx-auto'>
          <h1 className='text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-2xl'>
            Let's light up the <br />
            state <span className='text-[#C8FF00] italic'>together</span>
          </h1>
          <p className='text-2xl md:text-3xl text-zinc-300 mt-6 font-medium tracking-wide'>
            Become a <span className='text-[#C8FF00] font-bold'>FireFly!</span>
          </p>

          <Link
            href='/signup'
            className='mt-10 bg-[#C8FF00] text-black font-black py-4 px-10 rounded-2xl w-fit text-lg uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_10px_40px_rgba(200,255,0,0.3)] hover:shadow-[0_15px_50px_rgba(200,255,0,0.5)]'
          >
            Sign Up
          </Link>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className='max-w-7xl mx-auto py-24 px-6 md:px-12'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 lg:gap-24'>
          <FeatureCard
            imageSrc='/squirrel.png'
            title='Explore'
            description='Explore the many places in CT where creatures may be hiding on our interactive map.'
          />

          <FeatureCard
            imageSrc='/biodiversity.png'
            title='Contribute'
            description='Take Wildlife Conservation into your own hands! Now anyone can become an Environmentalist.'
          />

          <FeatureCard
            imageSrc='/tiger.png'
            title='Track'
            description='Let’s explore and track wildlife together! Just mark the location of the animal on the map.'
          />
        </div>
      </section>

      {/* Subtle Divider */}
      <div className='max-w-3xl mx-auto pb-16 opacity-10'>
        <div className='h-px bg-white w-full' />
      </div>
    </main>
  );
}

function FeatureCard({
  imageSrc,
  title,
  description,
}: {
  imageSrc: string;
  title: string;
  description: string;
}) {
  return (
    <div className='flex flex-col items-center text-center group'>
      <div className='relative w-32 h-32 md:w-40 md:h-40 mb-8 transition-all duration-500 group-hover:-translate-y-4'>
        <div className='absolute inset-0 bg-[#C8FF00]/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700' />

        <Image
          src={imageSrc}
          alt={title}
          fill
          className='object-contain invert brightness-90 group-hover:brightness-100 transition-all'
        />
      </div>

      <h3 className='text-3xl font-bold text-white mb-4 tracking-tight group-hover:text-[#C8FF00] transition-colors'>
        {title}
      </h3>

      <p className='text-zinc-400 text-lg leading-relaxed font-medium group-hover:text-zinc-200 transition-colors'>
        {description}
      </p>
    </div>
  );
}
