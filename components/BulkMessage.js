import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function BulkMessage() {
  const { data: session } = useSession();
  const [groups, setGroups] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [selectedTab, setSelectedTab] = useState('');
  const [tabName, setTabName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState('');

  useEffect(() => {
    if (session?.user.phones.length > 0) {
      setSelectedPhone(session.user.phones[0]);
    }
  }, [session]);

  useEffect(() => {
    if (selectedPhone) {
      axios.get('/api/telegram/get-groups', { params: { phone: selectedPhone } })
        .then((res) => setGroups(res.data.groups));
      axios.get('/api/telegram/get-tabs', { params: { phone: selectedPhone } })
        .then((res) => setTabs(res.data.tabs));
    }
  }, [selectedPhone]);

  const handleSaveTab = async () => {
    try {
      await axios.post('/api/telegram/save-tab', {
        phone: selectedPhone,
        tabName,
        selectedGroups,
        message,
      });
      alert('Aba salva com sucesso!');
      axios.get('/api/telegram/get-tabs', { params: { phone: selectedPhone } })
        .then((res) => setTabs(res.data.tabs));
    } catch (error) {
      alert('Erro ao salvar aba: ' + error.message);
    }
  };

  const handleSendMessage = async () => {
    try {
      await axios.post('/api/telegram/send-bulk', {
        phone: selectedPhone,
        chatIds: selectedGroups,
        message,
      });
      alert('Mensagens enviadas com sucesso!');
    } catch (error) {
      alert('Erro ao enviar mensagens: ' + error.message);
    }
  };

  const loadTab = (tab) => {
    setSelectedTab(tab.id);
    setTabName(tab.name);
    setSelectedGroups(tab.groups);
    setMessage(tab.message);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-telegram-blue mb-4">Envio de Mensagens em Massa</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Selecionar Número</label>
        <select
          value={selectedPhone}
          onChange={(e) => setSelectedPhone(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {session?.user.phones.map((phone) => (
            <option key={phone} value={phone}>{phone}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Nome da Aba</label>
        <input
          type="text"
          value={tabName}
          onChange={(e) => setTabName(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Selecionar Grupos</label>
        <select
          multiple
          value={selectedGroups}
          onChange={(e) => setSelectedGroups([...e.target.selectedOptions].map((o) => o.value))}
          className="w-full p-2 border rounded"
        >
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.title}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Mensagem</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <h3 className="text-gray-700">Abas Salvas</h3>
        <ul>
          {tabs.map((tab) => (
            <li key={tab.id} className="flex justify-between">
              <span onClick={() => loadTab(tab)} className="cursor-pointer text-telegram-blue">
                {tab.name}
              </span>
              <button
                onClick={() => {
                  axios.delete(`/api/telegram/delete-tab/${tab.id}`, { params: { phone: selectedPhone } })
                    .then(() => axios.get('/api/telegram/get-tabs', { params: { phone: selectedPhone } })
                      .then((res) => setTabs(res.data.tabs)));
                }}
                className="text-red-500"
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleSaveTab}
        className="bg-telegram-blue text-white p-2 rounded mr-2 hover:bg-blue-600"
      >
        Salvar Aba
      </button>
      <button
        onClick={handleSendMessage}
        className="bg-telegram-blue text-white p-2 rounded hover:bg-blue-600"
      >
        Enviar Mensagens
      </button>
    </div>
  );
}