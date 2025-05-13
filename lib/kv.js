import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function getKV(key) {
  try {
    console.log(`[KV] Buscando chave: ${key}`);
    const value = await redis.get(key);
    console.log(`[KV] Valor retornado para ${key}:`, value);
    return value; // Retorna null se a chave não existe
  } catch (error) {
    console.error(`[KV] Erro ao buscar chave ${key}:`, error);
    throw new Error(`Failed to get key ${key}: ${error.message}`);
  }
}

export async function setKV(key, value) {
  try {
    console.log(`[KV] Salvando chave: ${key}, valor:`, value);
    await redis.set(key, value);
    console.log(`[KV] Chave salva: ${key}`);
  } catch (error) {
    console.error(`[KV] Erro ao salvar chave ${key}:`, error);
    throw new Error(`Failed to set key ${key}: ${error.message}`);
  }
}
