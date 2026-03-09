'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks({
  isLoggedIn,
  username,
}: {
  isLoggedIn: boolean;
  username?: string;
}) {
  const pathname = usePathname();
  const activeStyle = (path: string) =>
    `transition-colors ${pathname === path ? 'text-[#B7BA64]' : 'text-gray-300 hover:text-[#B7BA64]'}`;

  return (
    <div className='flex gap-8 items-center text-sm font-medium'>
      {/* 1. Hi, [username] sits at the very beginning of the list */}
      {isLoggedIn && (
        <span className='font-bold text-[#C8FF00]'>Hi, {username}</span>
      )}

      {/* 2. Marketing links only show when logged out */}
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

      {/* 3. Species link follows the greeting (when logged in) or About (when logged out) */}
      <Link href='/species' className={activeStyle('/species')}>
        Species
      </Link>

      {/* 4. Protected links */}
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
