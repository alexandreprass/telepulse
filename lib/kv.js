import { createClient } from '@vercel/kv';

export const kv = createClient({
  url: process.env.VERCEL_KV_URL,
  token: process.env.VERCEL_KV_TOKEN,
});
