'use server';
import bcrypt from 'bcrypt';
import prisma from '../libs/prismadb';
import { registerSchema } from '../libs/schemas';

type RegisterResponse = {
  success?: boolean;
  error?: string;
};

export async function registerUser(
  prevState: any,
  formData: FormData,
): Promise<RegisterResponse> {
  const rawData = Object.fromEntries(formData.entries());

  // 1. Zod handles the "Is this valid?" check
  const validatedFields = registerSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const firstErrorMessage = validatedFields.error.issues[0]?.message;
    return { error: firstErrorMessage || 'Invalid input data' };
  }

  const { username, email, password } = validatedFields.data;

  try {
    // 2. Prisma handles the "Does this exist?" check
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { error: 'Email already in use.' };

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: { username, email, hashedPassword },
    });

    return { success: true };
  } catch (err) {
    return { error: 'Failed to create account. Please try again.' };
  }
}
