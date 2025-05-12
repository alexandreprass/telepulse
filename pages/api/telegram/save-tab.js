import { saveTab } from '../../../lib/kv';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: 'Não autenticado' });

  const { phone, tabName, selectedGroups, message } = req.body;
  if (!phone || !session.user.phones.includes(phone)) {
    return res.status(403).json({ error: 'Número de telefone inválido' });
  }

  try {
    await saveTab(phone, { name: tabName, groups: selectedGroups, message });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 
