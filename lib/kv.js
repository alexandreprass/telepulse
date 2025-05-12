import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: 'https://shining-troll-28985.upstash.io',
  token: 'AXE5AAIjcDFkMWQwMTQxYmJhMzI0OGI1YTEyMDEwMWJlOGIxODM0NHAxMA',
});

export async function deleteTab(phone, id) {
  try {
    await redis.del(`tab:<span class="math-inline">\{phone\}\:</span>{id}`);
  } catch (error) {
    throw new Error(`Failed to delete tab: ${error.message}`);
  }
}

export default redis;
