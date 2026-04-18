// src/lib/auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        studentId: { label: '학번', type: 'text' },
        password:  { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials) {
        const { studentId, password } = credentials as {
          studentId: string;
          password: string;
        };

        if (!studentId || !password) return null;

        const user = await prisma.user.findUnique({
          where: { studentId },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return {
          id:        user.id,
          name:      user.name,
          email:     user.email,
          studentId: user.studentId,
          role:      user.role,
        };
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id        = user.id;
        token.studentId = (user as any).studentId;
        token.role      = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id        = token.id as string;
        (session.user as any).studentId = token.studentId;
        (session.user as any).role      = token.role;
      }
      return session;
    },
  },
});