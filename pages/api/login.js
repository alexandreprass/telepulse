import { getKV } from '@/lib/kv';
import bcrypt from 'bcryptjs';
import { signIn } from 'next-auth/react';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    const emailKey = `user:${email.trim().toLowerCase()}`;
    console.log(`[Login API] Buscando usuário: ${emailKey}`);
    const userData = await getKV(emailKey);
    console.log(`[Login API] userData retornado:`, userData);

    if (!userData) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    let user;
    try {
      user = JSON.parse(userData);
      console.log(`[Login API] Usuário parseado:`, user);
    } catch (parseError) {
      console.error(`[Login API] Erro ao parsear userData:`, parseError);
      return res.status(500).json({ error: 'Dados do usuário inválidos' });
    }

    if (!user.password) {
      return res.status(500).json({ error: 'Dados do usuário incompletos' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Autenticar com NextAuth
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result.error) {
      return res.status(401).json({ error: result.error });
    }

    return res.status(200).json({ message: 'Login bem-sucedido' });
  } catch (err) {
    console.error(`[Login API] Erro ao autenticar:`, err);
    return res.status(500).json({ error: `Erro ao autenticar: ${err.message}` });
  }
}
