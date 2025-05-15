import { Redis } from '@upstash/redis';

// Inicializa o Redis automaticamente a partir das variáveis de ambiente
const redis = Redis.fromEnv();

/**
 * Obtém um valor do Redis com base na chave fornecida
 * @param {string} key - A chave do valor a ser obtido
 * @returns {Promise<any>} - O valor correspondente à chave
 */
export async function getKV(key) {
  try {
    const value = await redis.get(key);
    console.log(`[KV] Valor obtido para a chave ${key}:`, value);
    return value;
  } catch (error) {
    console.error(`[KV] Erro ao obter chave ${key}:`, error);
    throw new Error('Erro ao acessar o banco de dados');
  }
}

/**
 * Define um valor no Redis com base na chave fornecida
 * @param {string} key - A chave para armazenar o valor
 * @param {any} value - O valor a ser armazenado
 * @returns {Promise<any>} - O resultado da operação de definição
 */
export async function setKV(key, value) {
  try {
    const result = await redis.set(key, value);
    console.log(`[KV] Valor definido para a chave ${key}:`, result);
    return result;
  } catch (error) {
    console.error(`[KV] Erro ao definir chave ${key} com valor ${value}:`, error);
    throw new Error('Erro ao acessar o banco de dados');
  }
}
