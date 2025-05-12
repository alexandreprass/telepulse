import { kv } from '@vercel/kv';

export async function getKV(key) {
  return await kv.get(key);
}

export async function setKV(key, value) {
  await kv.set(key, value);
}

export async function getTabs(phone) {
  const tabs = await getKV(`tabs:${phone}`) || [];
  return typeof tabs === 'string' ? JSON.parse(tabs) : tabs;
}

export async function saveTab(phone, tab) {
  const tabs = await getTabs(phone);
  const newTab = { id: Date.now().toString(), ...tab };
  tabs.push(newTab);
  await setKV(`tabs:${phone}`, JSON.stringify(tabs.slice(-5)));
  return newTab;
}

export async function deleteTab(phone, tabId) {
  const tabs = await getTabs(phone);
  const updatedTabs = tabs.filter((tab) => tab.id !== tabId);
  await setKV(`tabs:${phone}`, JSON.stringify(updatedTabs));
} 
