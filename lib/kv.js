import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function deleteTab(phone, id) {
  try {
    await redis.del(`tab:${phone}:${id}`);
  } catch (error) {
    throw new Error(`Failed to delete tab: ${error.message}`);
  }
}

export default redis;
