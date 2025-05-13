import { getKV, setKV } from '@/lib/kv';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
  }

  try {
    // Verificar se o usuário já existe
    const existingUserData = await getKV(`user:${email}`);
    if (existingUserData) {
      return res.status(400).json({ error: 'Usuário já cadastrado' });
    }

    // Criar novo usuário com senha hasheada
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      name,
      email,
      password: hashedPassword,
      phones: [],
    };
    await setKV(`user:${email}`, JSON.stringify(userData));

    return res.status(200).json({ message: 'Usuário cadastrado com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: `Erro ao cadastrar: ${err.message}` });
  }
}
