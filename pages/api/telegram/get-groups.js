import { getGroups } from '@/lib/telegram';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone } = req.query;
  try {
    const groups = await getGroups(phone);
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
