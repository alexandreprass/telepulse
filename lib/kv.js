import { createClient } from '@vercel/kv';

export const kv = createClient({
  url: process.env.VERCEL_KV_URL,
  token: process.env.VERCEL_KV_TOKEN,
});

export async function deleteTab(phone, id) {
  try {
    await kv.del(`tab:${phone}:${id}`);
  } catch (error) {
    throw new Error(`Failed to delete tab: ${error.message}`);
  }
}
