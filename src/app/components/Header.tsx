'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className='p-4 border-b border-gray-200'>
      <nav className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Image
            src='/FireFly-logo.png'
            alt='Firefly Logo'
            width={45}
            height={45}
            className='rounded-full'
            priority
          />
          <h1 className='text-2xl font-bold'>Firefly</h1>
        </div>
        <div className='flex gap-4'>
          <Link
            href='/'
            className={`transition-colors ${
              pathname === '/' ? 'text-[#B7BA64]' : 'hover:text-[#B7BA64]'
            }`}
          >
            Home
          </Link>
          <Link
            href='/about'
            className={`transition-colors ${
              pathname === '/about' ? 'text-[#B7BA64]' : 'hover:text-[#B7BA64]'
            }`}
          >
            About
          </Link>
          <Link
            href='/species'
            className={`transition-colors ${
              pathname === '/species'
                ? 'text-[#B7BA64]'
                : 'hover:text-[#B7BA64]'
            }`}
          >
            Species
          </Link>
          <Link
            href='/signup'
            className={`transition-colors ${
              pathname === '/signup' ? 'text-[#B7BA64]' : 'hover:text-[#B7BA64]'
            }`}
          >
            Sign Up
          </Link>
          <Link
            href='/login'
            className={`transition-colors ${
              pathname === '/login' ? 'text-[#B7BA64]' : 'hover:text-[#B7BA64]'
            }`}
          >
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}
