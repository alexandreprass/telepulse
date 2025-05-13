import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function deleteTab(phone, id) {
  try {
    await redis.del(`tab:${phone}:${id}`);
  } catch (error) {
    throw new Error(`Failed to delete tab: ${error.message}`);
  }
}

export async function getTabs(phone) {
  try {
    const keys = await redis.keys(`tab:${phone}:*`);
    const tabs = await Promise.all(
      keys.map(async (key) => {
        const value = await redis.get(key);
        return { id: key.split(':').pop(), ...JSON.parse(value) };
      })
    );
    return tabs;
  } catch (error) {
    throw new Error(`Failed to get tabs: ${error.message}`);
  }
}

export async function saveTab(phone, id, data) {
  try {
    await redis.set(`tab:${phone}:${id}`, JSON.stringify(data));
  } catch (error) {
    throw new Error(`Failed to save tab: ${error.message}`);
  }
}

export async function getKV(key) {
  try {
    const value = await redis.get(key);
    return value;
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

export default redis;
