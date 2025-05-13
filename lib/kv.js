import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function getKV(key) {
  try {
    const value = await redis.get(key);
    return value; // Retorna null se a chave não existe
  } catch (error) {
    throw new Error(`Failed to get key ${key}: ${error.message}`);
  }
}

export async function setKV(key, value) {
  try {
    await redis.set(key, value);
  } catch (error) {
    throw new Error(`Failed to set key ${key}: ${error.message}`);
  }
}
