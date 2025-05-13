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
    const emailKey = `user:${email.trim().toLowerCase()}`;
    console.log(`[Signup API] Verificando usuário: ${emailKey}`);
    const existingUserData = await getKV(emailKey);
    if (existingUserData) {
      console.log(`[Signup API] Usuário já existe: ${emailKey}`);
      return res.status(400).json({ error: 'Usuário já cadastrado' });
    }

    console.log(`[Signup API] Criando usuário: ${emailKey}`);
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      name,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      phones: [],
    };
    const userDataString = JSON.stringify(userData);
    console.log(`[Signup API] Salvando userData:`, userDataString);
    await setKV(emailKey, userDataString);
    console.log(`[Signup API] Usuário salvo: ${emailKey}`);

    return res.status(200).json({ message: 'Usuário cadastrado com sucesso' });
  } catch (err) {
    console.error(`[Signup API] Erro ao cadastrar:`, err);
    return res.status(500).json({ error: `Erro ao cadastrar: ${err.message}` });
  }
}
