import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@/auth';
import NavLinks from './NavLinks';
import LogoutButton from './LogoutButton';
import MobileMenu from './MobileMenu';

export default async function Header() {
  const session = await auth();
  const displayName = session?.user?.username || 'Explorer';

  return (
    <header className='sticky top-0 z-50 w-full bg-[#1a1c1e] text-white border-b border-gray-800 shadow-md'>
      {/* Main Container: Fixed at w-full with overflow protection */}
      <nav className='flex items-center justify-between w-full max-w-7xl mx-auto p-4 px-6 overflow-hidden'>
        {/* Logo Section: shrink-0 prevents it from getting squished on phone  */}
        <Link
          href='/'
          className='flex items-center gap-3 hover:opacity-80 transition-opacity z-50 shrink-0'
        >
          <Image
            src='/FireFly-logo.png'
            alt='Logo'
            width={38}
            height={38}
            className='rounded-full'
            priority
          />
          <span className='text-xl md:text-2xl font-bold tracking-tight'>
            Firefly
          </span>
        </Link>

        {/* --- DESKTOP NAVIGATION (Hidden on mobile) --- */}
        <div className='hidden md:flex items-center gap-8'>
          <NavLinks
            isLoggedIn={!!session}
            username={displayName}
            className='flex gap-8 text-sm'
          />

          <div className='flex items-center'>
            {session ? (
              <LogoutButton />
            ) : (
              <div className='flex items-center gap-8'>
                <Link
                  href='/login'
                  className='text-sm font-medium text-gray-300 hover:text-[#C8FF00] transition-colors'
                >
                  Login
                </Link>
                <Link
                  href='/signup'
                  className='bg-[#C8FF00] text-black px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider hover:scale-105 transition-transform'
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* --- MOBILE NAVIGATION TOGGLE (Shown only on mobile) --- */}
        <div className='md:hidden flex items-center shrink-0'>
          <MobileMenu
            isLoggedIn={!!session}
            username={displayName}
            logoutButton={<LogoutButton />}
          />
        </div>
      </nav>
    </header>
  );
}
