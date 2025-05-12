import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { getKV, setKV } from './kv';

const apiId = parseInt(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH;

export async function loginWithTelegram(phone, code) {
  const session = new StringSession('');
  const client = new TelegramClient(session, apiId, apiHash, { connectionRetries: 5 });
  await client.start({
    phoneNumber: phone,
    phoneCode: async () => code,
    onError: (err) => { throw err; },
  });
  const sessionString = client.session.save();
  await setKV(`session:${phone}`, sessionString);
  await client.disconnect();
  return true;
}

export async function getClient(phone) {
  const sessionString = await getKV(`session:${phone}`);
  if (!sessionString) throw new Error('Sessão não encontrada');
  const session = new StringSession(sessionString);
  const client = new TelegramClient(session, apiId, apiHash, { connectionRetries: 5 });
  await client.connect();
  return client;
}

export async function getGroups(phone) {
  const client = await getClient(phone);
  const chats = await client.getDialogs();
  const groups = chats
    .filter((chat) => chat.isGroup || chat.isChannel)
    .map((chat) => ({ id: chat.id.toString(), title: chat.title }));
  await client.disconnect();
  return groups;
}

export async function sendBulkMessage(phone, chatIds, message) {
  const client = await getClient(phone);
  for (const chatId of chatIds) {
    await client.sendMessage(chatId, { message });
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  await client.disconnect();
}

export async function addMembers(phone, chatId, userIds) {
  const client = await getClient(phone);
  for (const userId of userIds) {
    await client.invoke({
      _: 'channels.inviteToChannel',
      channel: { _: 'inputChannel', channel_id: parseInt(chatId) },
      users: [{ _: 'inputUser', user_id: parseInt(userId) }],
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  await setKV(`add-count:${phone}:${new Date().toISOString().split('T')[0]}`, userIds.length);
  await client.disconnect();
}

export async function getAddCount(phone) {
  const today = new Date().toISOString().split('T')[0];
  const count = parseInt(await getKV(`add-count:${phone}:${today}`) || '0');
  return count;
}