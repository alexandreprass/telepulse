import { getTabs } from '@/lib/kv';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { phone } = req.query;
  try {
    const tabs = await getTabs(phone);
    res.status(200).json(tabs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
