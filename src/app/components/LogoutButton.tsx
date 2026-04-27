'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className='text-sm font-medium text-gray-400 hover:text-red-400 transition-colors'
    >
      Logout
    </button>
  );
}
