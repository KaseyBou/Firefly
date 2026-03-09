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

        return user; // Prisma returns the 'username' here
      },
    }),
  ],
  callbacks: {
    // This moves the username from the DB user into the secure JWT token
    async jwt({ token, user }) {
      if (user) {
        token.username = (user as any).username;
      }
      return token;
    },
    // This moves the username from the token into the Session object the Header sees
    async session({ session, token }) {
      if (token?.username) {
        session.user.username = token.username as string;
      }
      return session;
    },
  },
});
