import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function deleteTab(phone, id) {
  try {
    await redis.del(`tab:${phone}:${id}`);
  } catch (error) {
    throw new Error(`Failed to delete tab: ${error.message}`);
  }
}

// Você pode manter a instância 'redis' exportada se precisar usá-la em outros lugares
export default redis;
