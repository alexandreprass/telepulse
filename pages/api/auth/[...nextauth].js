import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getKV } from '@/lib/kv';
import bcrypt from 'bcryptjs';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios');
        }

        const userData = await getKV(`user:${credentials.email}`);
        if (!userData) {
          throw new Error('Usuário não encontrado');
        }

        const user = JSON.parse(userData);
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Senha incorreta');
        }

        return { email: user.email, name: user.name, phones: user.phones };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.phones = user.phones;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.phones = token.phones;
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
