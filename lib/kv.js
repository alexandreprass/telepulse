import { Redis } from '@upstash/redis';

// Inicializa a conexão com o Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

// Função para obter um valor do Redis
export async function getKV(key) {
  try {
    return await redis.get(key);
  } catch (error) {
    console.error(`[KV] Erro ao obter chave ${key}:`, error);
    throw new Error('Erro ao acessar o banco de dados');
  }
}

// Função para definir um valor no Redis
export async function setKV(key, value) {
  try {
    return await redis.set(key, value);
  } catch (error) {
    console.error(`[KV] Erro ao definir chave ${key} com valor ${value}:`, error);
    throw new Error('Erro ao acessar o banco de dados');
  }
}
