import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/app/libs/prismadb';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { z } from 'zod';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = z
          .object({ email: z.string().email(), password: z.string() })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.hashedPassword) return null;

        const isCorrect = await bcrypt.compare(password, user.hashedPassword);
        if (!isCorrect) return null;

        // Return the user object (Prisma includes the 'id' here by default)
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id; // Store the database ID in the token
        token.username = (user as any).username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string; // Pass the ID to the session object
        session.user.username = token.username as string;
      }
      return session;
    },
  },
});
