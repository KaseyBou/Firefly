'use client';

import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../actions/login';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // 1. Import the router

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter(); // 2. Initialize the router

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      setErrorMessage('');
      const result = await loginUser(formData);

      // If the server returns an error, we throw it so React Query triggers onError
      if (result?.error) throw new Error(result.error);

      return result;
    },
    onSuccess: () => {
      // 3. This runs ONLY if no error was thrown.
      // We navigate and refresh to update the Header state.
      router.push('/species');
      router.refresh();
    },
    onError: (error: any) => {
      // Now this will only catch real login failures, not redirects!
      setErrorMessage(error.message);
    },
  });

  return (
    <div className='flex items-center justify-center min-h-[80vh] p-6 bg-black'>
      <div className='w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl'>
        <h1 className='text-3xl font-bold text-[#B7BA64] mb-2 text-center tracking-tight'>
          Welcome Back
        </h1>
        <p className='text-gray-400 mb-8 text-center text-sm'>
          Log in to track Connecticut's wildlife.
        </p>

        <form
          action={(formData) => mutation.mutate(formData)}
          className='flex flex-col gap-5'
        >
          {errorMessage && (
            <p className='text-red-400 text-xs bg-red-400/10 p-3 rounded border border-red-400/20 text-center'>
              {errorMessage}
            </p>
          )}

          <div className='space-y-1'>
            <label className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
              Email
            </label>
            <input
              name='email'
              type='email'
              required
              placeholder='kasey@example.com'
              className='w-full p-3 rounded bg-black border border-gray-800 focus:border-[#B7BA64] outline-none text-white transition-all'
            />
          </div>

          <div className='space-y-1'>
            <label className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
              Password
            </label>
            <input
              name='password'
              type='password'
              required
              placeholder='••••••••'
              className='w-full p-3 rounded bg-black border border-gray-800 focus:border-[#B7BA64] outline-none text-white transition-all'
            />
          </div>

          <button
            disabled={mutation.isPending}
            type='submit'
            className='mt-4 bg-[#B7BA64] text-black font-bold py-3 rounded-lg hover:bg-[#a3a65a] transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-[#B7BA64]/10'
          >
            {mutation.isPending ? 'Authenticating...' : 'Log In'}
          </button>
        </form>

        <p className='mt-6 text-center text-sm text-gray-500'>
          New to the community?{' '}
          <Link href='/signup' className='text-[#B7BA64] hover:underline'>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
