'use client';

import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../actions/register';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await registerUser(null, formData);
      if (result?.error) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      router.push('/login');
    },
    onError: (error: any) => {
      setErrorMessage(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-[80vh] p-6 bg-black'>
      <div className='w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl'>
        <h1 className='text-3xl font-bold text-[#B7BA64] mb-2 text-center'>
          Join Firefly
        </h1>
        <p className='text-gray-400 mb-8 text-center text-sm'>
          Help us track Connecticut's wildlife.
        </p>

        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          {errorMessage && (
            <p className='text-red-400 text-xs bg-red-400/10 p-3 rounded border border-red-400/20'>
              {errorMessage}
            </p>
          )}

          <div className='space-y-1'>
            <label className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
              Username
            </label>
            <input
              name='username'
              type='text'
              required
              placeholder='NatureLover203'
              className='w-full p-3 rounded bg-black border border-gray-800 focus:border-[#B7BA64] outline-none text-white transition-all'
            />
          </div>

          <div className='space-y-1'>
            <label className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
              Email
            </label>
            <input
              name='email'
              type='email'
              required
              placeholder='JohnDoe@example.com'
              className='w-full p-3 rounded bg-black border border-gray-800 focus:border-[#B7BA64] outline-none text-white transition-all'
            />
          </div>

          <div className='space-y-1'>
            <label className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
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

          <div className='space-y-1'>
            <label className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
              Confirm Password
            </label>
            <input
              name='confirmPassword'
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
            {mutation.isPending ? 'Saving to Database...' : 'Create Account'}
          </button>
        </form>

        <p className='mt-6 text-center text-sm text-gray-500'>
          Already have an account?{' '}
          <Link href='/login' className='text-[#B7BA64] hover:underline'>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
