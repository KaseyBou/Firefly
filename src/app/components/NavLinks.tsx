'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks({
  isLoggedIn,
  username,
  className = '',
}: {
  isLoggedIn: boolean;
  username?: string;
  className?: string;
}) {
  const pathname = usePathname();

  // Use the firefly lime green for active states
  const activeStyle = (path: string) =>
    `transition-colors whitespace-nowrap ${
      pathname === path
        ? 'text-[#C8FF00]'
        : 'text-gray-300 hover:text-[#C8FF00]'
    }`;

  return (
    <div className={`items-center font-medium ${className}`}>
      {/* 1. Greeting: Only for logged-in users */}
      {isLoggedIn && (
        <span className='font-black text-[#C8FF00] mb-2 md:mb-0'>
          Hi, {username}
        </span>
      )}

      {/* 2. Marketing Links: Only for logged-out users */}
      {!isLoggedIn && (
        <>
          <Link href='/' className={activeStyle('/')}>
            Home
          </Link>
          <Link href='/about' className={activeStyle('/about')}>
            About
          </Link>
        </>
      )}

      {/* 3. Universal Link */}
      <Link href='/species' className={activeStyle('/species')}>
        Species
      </Link>

      {/* 4. Protected Links: Only for logged-in users */}
      {isLoggedIn && (
        <>
          <Link href='/map' className={activeStyle('/map')}>
            Map
          </Link>
          <Link href='/upload' className={activeStyle('/upload')}>
            Upload
          </Link>
        </>
      )}
    </div>
  );
}
