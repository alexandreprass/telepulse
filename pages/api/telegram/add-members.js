import { addMembers, getAddCount } from '../../../lib/telegram';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: 'Não autenticado' });

  const { phone, chatId, userIds } = req.body;
  if (!phone || !session.user.phones.includes(phone)) {
    return res.status(403).json({ error: 'Número de telefone inválido' });
  }

  try {
    const count = await getAddCount(phone);
    if (count >= 40) {
      return res.status(400).json({ error: 'Limite diário de 40 adições atingido' });
    }
    await addMembers(phone, chatId, userIds);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 
