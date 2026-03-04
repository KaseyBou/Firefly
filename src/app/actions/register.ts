'use server';
import bcrypt from 'bcrypt';
import prisma from '@prisma/client';

export async function registerUser(formData: FormData) {
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        hashedPassword,
      },
    });
    return { success: true };
  } catch (error) {
    return { error: 'Username or Email already exists.' };
  }
}
