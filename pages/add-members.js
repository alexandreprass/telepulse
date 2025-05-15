import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function AddMembers() {
  const { data: session, status } = useSession();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (phone) {
      fetch(`/api/telegram/get-groups?phone=${phone}`)
        .then((res) => res.json())
        .then((data) => setGroups(data))
        .catch(() => setError('Erro ao carregar grupos'));
    }
  }, [phone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/telegram/add-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao adicionar membros');
      setSuccess('Membros adicionados com sucesso!');
    } catch (err) {
      setError(`Erro: ${err.message}`);
    }
  };

  if (status === 'unauthenticated') return <p>Por favor, faça login.</p>;
  if (status === 'loading') return <p>Carregando...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-500 mb-6">Adicionar Membros a Grupos</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Número de Telefone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Código de Autenticação</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Grupo</label>
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
          <button
            type="submit"
            className="bg-yellow-500 text-white p-2 rounded w-full hover:bg-yellow-600"
          >
            Adicionar Membros
          </button>
        </form>
      </div>
    </div>
  );
}
