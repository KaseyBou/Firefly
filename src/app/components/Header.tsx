import Image from 'next/image';
import Link from 'next/link';
import { auth, signOut } from '@/auth';
import NavLinks from './NavLinks';

export default async function Header() {
  const session = await auth();
  const displayName = session?.user?.username || 'Explorer';

  return (
    <header className='sticky top-0 z-50 w-full bg-[#1a1c1e] text-white border-b border-gray-800 shadow-md'>
      <nav className='flex items-center justify-between max-w-7xl mx-auto p-4 px-6'>
        {/* Logo */}
        <Link
          href='/'
          className='flex items-center gap-3 hover:opacity-80 transition-opacity'
        >
          <Image
            src='/FireFly-logo.png'
            alt='Logo'
            width={40}
            height={40}
            className='rounded-full'
            priority
          />
          <span className='text-2xl font-bold tracking-tight'>Firefly</span>
        </Link>

        {/* Unified Navigation Area */}
        <div className='flex items-center gap-8'>
          <NavLinks isLoggedIn={!!session} username={displayName} />

          <div className='flex items-center gap-8'>
            {session ? (
              <form
                action={async () => {
                  'use server';
                  // FIXED: Now explicitly redirects to Home page on logout
                  await signOut({ redirectTo: '/' });
                }}
              >
                <button className='text-sm font-medium text-gray-400 hover:text-red-400 transition-colors'>
                  Logout
                </button>
              </form>
            ) : (
              <div className='flex items-center gap-8'>
                <Link
                  href='/login'
                  className='text-sm font-medium text-gray-300 hover:text-[#B7BA64] transition-colors'
                >
                  Login
                </Link>
                <Link
                  href='/signup'
                  className='text-sm font-medium text-gray-300 hover:text-[#B7BA64] transition-colors'
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
