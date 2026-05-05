'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import NavLinks from './NavLinks';

export default function MobileMenu({
  isLoggedIn,
  username,
  logoutButton,
}: {
  isLoggedIn: boolean;
  username: string;
  logoutButton: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // FORCE RESET: This ensures the menu closes and icon reverts whenever the URL changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // SCROLL LOCK: Prevents background scrolling when the menu is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to ensure scroll is restored if component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* The Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='p-2 text-gray-300 hover:text-[#C8FF00] z-[60] relative transition-colors'
        aria-label='Toggle Menu'
      >
        {/* The icon will now react immediately to the setIsOpen(false) in the useEffect */}
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {isOpen && (
        <>
          {/* Backdrop: Clicking this also triggers the close */}
          <div
            className='fixed inset-0 bg-black/80 backdrop-blur-sm z-[40] animate-in fade-in duration-300'
            onClick={() => setIsOpen(false)}
          />

          {/* Mobile Drawer */}
          <div className='fixed top-[73px] left-0 w-full bg-[#1a1c1e] border-b border-gray-800 flex flex-col p-8 gap-8 animate-in slide-in-from-top duration-300 z-[50] shadow-2xl'>
            <div onClick={() => setIsOpen(false)}>
              <NavLinks
                isLoggedIn={isLoggedIn}
                username={username}
                className='flex flex-col gap-8 text-xl'
              />
            </div>

            <hr className='border-gray-800' />

            <div className='flex flex-col gap-4'>
              {isLoggedIn ? (
                <div onClick={() => setIsOpen(false)}>{logoutButton}</div>
              ) : (
                <div
                  className='flex flex-col gap-4'
                  onClick={() => setIsOpen(false)}
                >
                  <Link
                    href='/login'
                    className='text-lg font-medium text-center'
                  >
                    Login
                  </Link>
                  <Link
                    href='/signup'
                    className='bg-[#C8FF00] text-black text-center py-4 rounded-xl font-black uppercase tracking-widest'
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
