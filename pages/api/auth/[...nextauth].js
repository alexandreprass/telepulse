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
          console.log('[NextAuth] Email ou senha ausentes');
          throw new Error('Email e senha são obrigatórios');
        }

        try {
          const emailKey = `user:${credentials.email.trim().toLowerCase()}`;
          console.log(`[NextAuth] Buscando usuário com chave: ${emailKey}`);
          const userData = await getKV(emailKey);
          console.log(`[NextAuth] userData bruto retornado:`, userData);
          console.log(`[NextAuth] Tipo de userData:`, typeof userData);

          if (!userData) {
            console.log(`[NextAuth] Usuário não encontrado para chave: ${emailKey}`);
            throw new Error('Usuário não encontrado');
          }

          let user;
          if (typeof userData === 'string') {
            try {
              user = JSON.parse(userData);
              console.log(`[NextAuth] Usuário parseado de string:`, user);
            } catch (parseError) {
              console.error(`[NextAuth] Erro ao parsear userData string:`, parseError, `userData:`, userData);
              throw new Error('Dados do usuário inválidos');
            }
          } else if (typeof userData === 'object' && userData !== null) {
            user = userData;
            console.log(`[NextAuth] Usuário recebido como objeto:`, user);
          } else {
            console.error(`[NextAuth] Formato de userData inválido:`, userData);
            throw new Error('Formato de dados inválido');
          }

          if (!user || !user.password || !user.email) {
            console.error(`[NextAuth] Dados do usuário incompletos:`, user);
            throw new Error('Dados do usuário incompletos');
          }

          console.log(`[NextAuth] Comparando senhas para ${credentials.email}`);
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            console.log(`[NextAuth] Senha incorreta para ${credentials.email}`);
            throw new Error('Senha incorreta');
          }

          console.log(`[NextAuth] Autenticação bem-sucedida para ${credentials.email}`);
          return { email: user.email, name: user.name, phones: user.phones || [] };
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
