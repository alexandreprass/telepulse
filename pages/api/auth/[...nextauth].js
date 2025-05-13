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

        try {
          console.log(`[NextAuth] Buscando usuário: user:${credentials.email}`);
          const userData = await getKV(`user:${credentials.email}`);
          console.log(`[NextAuth] userData retornado:`, userData);

          if (!userData) {
            throw new Error('Usuário não encontrado');
          }

          let user;
          try {
            user = JSON.parse(userData);
            console.log(`[NextAuth] Usuário parseado:`, user);
          } catch (parseError) {
            console.error(`[NextAuth] Erro ao parsear userData:`, parseError);
            throw new Error('Dados do usuário inválidos');
          }

          if (!user.password) {
            console.error(`[NextAuth] Senha não encontrada no usuário:`, user);
            throw new Error('Dados do usuário incompletos');
          }

          console.log(`[NextAuth] Comparando senhas para ${credentials.email}`);
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            console.log(`[NextAuth] Senha incorreta para ${credentials.email}`);
            throw new Error('Senha incorreta');
          }

          console.log(`[NextAuth] Autenticação bem-sucedida para ${credentials.email}`);
          return { email: user.email, name: user.name, phones: user.phones };
        } catch (error) {
          console.error(`[NextAuth] Erro na autenticação:`, error);
          throw new Error(`Erro ao verificar credenciais: ${error.message}`);
        }
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
