'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function loginUser(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = loginSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message };
  }

  const { email, password } = validatedFields.data;

  try {
    // We set redirect: false so the server doesn't try to navigate
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return { success: true }; // Tell the client it worked!
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === 'CredentialsSignin')
        return { error: 'Invalid email or password.' };
      return { error: 'Something went wrong.' };
    }
    return { error: 'An unexpected error occurred.' };
  }
}
