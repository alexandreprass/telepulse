import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function BulkMessages() {
  const { data: session, status } = useSession();
  const [phone, setPhone] = useState('');
  const [chatIds, setChatIds] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/telegram/send-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, chatIds: chatIds.split(','), message }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao enviar mensagens');
      setSuccess('Mensagens enviadas com sucesso!');
    } catch (err) {
      setError(`Erro: ${err.message}`);
    }
  };

  if (status === 'unauthenticated') return <p>Por favor, faça login.</p>;
  if (status === 'loading') return <p>Carregando...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-500 mb-6">Enviar Mensagens em Massa</h1>
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
            <label className="block text-gray-700">IDs dos Chats (separados por vírgula)</label>
            <input
              type="text"
              value={chatIds}
              onChange={(e) => setChatIds(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mensagem</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded w-full hover:bg-green-600"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
