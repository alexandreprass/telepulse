import { getKV } from '@/lib/kv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

    if (!userData) {
      console.log(`[Login API] Usuário não encontrado: ${emailKey}`);
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    let user;
    if (typeof userData === 'string') {
      user = JSON.parse(userData);
    } else if (typeof userData === 'object' && userData !== null) {
      user = userData;
    } else {
      return res.status(500).json({ error: 'Formato de dados inválido' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { email: user.email, name: user.name },
      process.env.JWT_SECRET || 'seu-segredo-aqui',
      { expiresIn: '1h' }
    );

    console.log(`[Login API] Login bem-sucedido para ${email}`);
    return res.status(200).json({
      message: 'Login bem-sucedido',
      token,
      user: { email: user.email, name: user.name, phones: user.phones || [] },
    });
  } catch (err) {
    console.error(`[Login API] Erro ao autenticar:`, err);
    return res.status(500).json({ error: `Erro ao autenticar: ${err.message}` });
  }
}
