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
    console.log(`[Login API] userData bruto retornado:`, userData);
    console.log(`[Login API] Tipo de userData:`, typeof userData);

    if (!userData) {
      console.log(`[Login API] Usuário não encontrado: ${emailKey}`);
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    let user;
    try {
      if (typeof userData !== 'string') {
        console.error(`[Login API] userData não é string:`, userData);
        return res.status(500).json({ error: 'Formato de dados inválido' });
      }
      user = JSON.parse(userData);
      console.log(`[Login API] Usuário parseado com sucesso:`, user);
    } catch (parseError) {
      console.error(`[Login API] Erro ao parsear userData:`, parseError, `userData bruto:`, userData);
      return res.status(500).json({ error: 'Dados do usuário inválidos' });
    }

    if (!user.password) {
      console.error(`[Login API] Senha ausente:`, user);
      return res.status(500).json({ error: 'Dados do usuário incompletos' });
    }

    console.log(`[Login API] Comparando senhas para ${email}`);
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log(`[Login API] Senha incorreta para ${email}`);
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    console.log(`[Login API] Tentando signIn para ${email}`);
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    console.log(`[Login API] Resultado do signIn:`, result);
    if (result.error) {
      console.error(`[Login API] Erro no signIn:`, result.error);
      return res.status(401).json({ error: result.error });
    }

    console.log(`[Login API] Login bem-sucedido para ${email}`);
    return res.status(200).json({ message: 'Login bem-sucedido' });
  } catch (err) {
    console.error(`[Login API] Erro ao autenticar:`, err);
    return res.status(500).json({ error: `Erro ao autenticar: ${err.message}` });
  }
}
