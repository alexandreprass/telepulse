import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function AddMembers() {
  const { data: session } = useSession();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [members, setMembers] = useState('');
  const [file, setFile] = useState(null);
  const [addCount, setAddCount] = useState(0);
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
      axios.get('/api/telegram/get-add-count', { params: { phone: selectedPhone } })
        .then((res) => setAddCount(res.data.count));
    }
  }, [selectedPhone]);

  const handleAddMembers = async () => {
    if (addCount >= 40) {
      alert('Limite diário de 40 adições atingido!');
      return;
    }
    try {
      let userIds = members.split(',').map((m) => m.trim());
      if (file) {
        const text = await file.text();
        userIds = text.split('\n').map((line) => line.trim());
      }
      const remaining = 40 - addCount;
      userIds = userIds.slice(0, remaining);
      await axios.post('/api/telegram/add-members', {
        phone: selectedPhone,
        chatId: selectedGroup,
        userIds,
      });
      alert('Membros adicionados com sucesso!');
      axios.get('/api/telegram/get-add-count', { params: { phone: selectedPhone } })
        .then((res) => setAddCount(res.data.count));
    } catch (error) {
      alert('Erro ao adicionar membros: ' + error.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-telegram-blue mb-4">Adicionar Membros a Grupos</h2>
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
        <label className="block text-gray-700">Selecionar Grupo</label>
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Selecione um grupo</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.title}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">IDs/Números de Telefone (separados por vírgula)</label>
        <textarea
          value={members}
          onChange={(e) => setMembers(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Ou importar arquivo CSV</label>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full p-2"
        />
      </div>
      <p className="text-gray-700 mb-4">Adições restantes hoje: {40 - addCount}</p>
      <button
        onClick={handleAddMembers}
        className="bg-telegram-blue text-white p-2 rounded hover:bg-blue-600"
      >
        Adicionar Membros
      </button>
    </div>
  );
}