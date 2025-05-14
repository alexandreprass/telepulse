import 'server-only';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

export async function getKV(key) {
  try {
    const value = await redis.get(key);
    console.log(`[KV] Valor bruto retornado para ${key}:`, value);
    console.log(`[KV] Tipo do valor:`, typeof value);
    if (value === null) {
      console.log(`[KV] Chave ${key} não encontrada (retornou null)`);
    }
    return value;
  } catch (error) {
    console.error(`[KV] Erro ao buscar chave ${key}:`, error);
    throw error;
  }
}

export async function setKV(key, value) {
  try {
    console.log(`[KV] Salvando chave: ${key}, valor:`, value);
    console.log(`[KV] Tipo do valor a salvar:`, typeof value);
    await redis.set(key, value);
    console.log(`[KV] Chave salva: ${key}`);
  } catch (error) {
    console.error(`[KV] Erro ao salvar chave ${key}:`, error);
    throw error;
  }
}