import { getKV } from '@/lib/kv';
import bcrypt from 'bcryptjs';

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
    if (typeof userData === 'string') {
      try {
        user = JSON.parse(userData);
        console.log(`[Login API] Usuário parseado de string:`, user);
      } catch (parseError) {
        console.error(`[Login API] Erro ao parsear userData string:`, parseError, `userData:`, userData);
        return res.status(500).json({ error: 'Dados do usuário inválidos' });
      }
    } else if (typeof userData === 'object' && userData !== null) {
      user = userData;
      console.log(`[Login API] Usuário recebido como objeto:`, user);
    } else {
      console.error(`[Login API] Formato de userData inválido:`, userData);
      return res.status(500).json({ error: 'Formato de dados inválido' });
    }

    if (!user.password || !user.email) {
      console.error(`[Login API] Dados do usuário incompletos:`, user);
      return res.status(500).json({ error: 'Dados do usuário incompletos' });
    }

    console.log(`[Login API] Comparando senhas para ${email}`);
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log(`[Login API] Senha incorreta para ${email}`);
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    console.log(`[Login API] Login bem-sucedido para ${email}`);
    return res.status(200).json({
      message: 'Login bem-sucedido',
      user: { email: user.email, name: user.name, phones: user.phones || [] },
    });
  } catch (err) {
    console.error(`[Login API] Erro ao autenticar:`, err);
    return res.status(500).json({ error: `Erro ao autenticar: ${err.message}` });
  }
}
