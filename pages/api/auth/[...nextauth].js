import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getKV } from '../../../lib/kv';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credenciais',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        const userData = await getKV(`user:${email}`);
        if (!userData) {
          throw new Error('Usuário não encontrado');
        }
        const user = typeof userData === 'string' ? JSON.parse(userData) : userData;
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new Error('Senha incorreta');
        }
        return { id: user.email, name: user.name, email: user.email, phones: user.phones || [] };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.phones = user.phones;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.phones = token.phones;
      return session;
    },
  },
  pages: {
    signIn: '/',
    signUp: '/signup',
  },
});