import { getSession, useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import BulkMessage from '../components/BulkMessage';
import AddMembers from '../components/AddMembers';
import { getKV, setKV } from '@/lib/kv';

export default function Dashboard({ initialSession }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [phones, setPhones] = useState(initialSession?.user.phones || []);
  const [newPhone, setNewPhone] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (session) {
      setPhones(session.user.phones || []);
    }
  }, [status, session]);

  const handleAddPhone = async () => {
    try {
      const response = await fetch('/api/telegram/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: newPhone, code: '' }),
      });
      if (!response.ok) throw new Error((await response.json()).error);
      setIsCodeSent(true);
    } catch (err) {
      setError('Erro ao enviar código: ' + err.message);
    }
  };

  const handleVerifyPhone = async () => {
    try {
      const response = await fetch('/api/telegram/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: newPhone, code }),
      });
      if (!response.ok) throw new Error((await response.json()).error);
      const userData = JSON.parse(await getKV(`user:${session.user.email}`));
      userData.phones = [...new Set([...userData.phones, newPhone])];
      await setKV(`user:${session.user.email}`, JSON.stringify(userData));
      setPhones(userData.phones);
      setNewPhone('');
      setCode('');
      setIsCodeSent(false);
      alert('Número adicionado com sucesso!');
    } catch (err) {
      setError('Erro ao verificar número: ' + err.message);
    }
  };

  const handleRemovePhone = async (phone) => {
    try {
      const userData = JSON.parse(await getKV(`user:${session.user.email}`));
      userData.phones = userData.phones.filter((p) => p !== phone);
      await setKV(`user:${session.user.email}`, JSON.stringify(userData));
      setPhones(userData.phones);
      await setKV(`session:${phone}`, null);
      alert('Número removido com sucesso!');
    } catch (err) {
      setError('Erro ao remover número: ' + err.message);
    }
  };

  if (status === 'loading') return <div>Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-telegram-blue mb-6">
          Bem-vindo ao TelePulse, {session?.user.name}
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-bold text-telegram-blue mb-4">
            Gerenciar Números de Telefone
          </h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block text-gray-700">Adicionar Novo Número</label>
            <input
              type="text"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="+5511999999999"
            />
          </div>
          {isCodeSent && (
            <div className="mb-4">
              <label className="block text-gray-700">Código de Verificação</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          )}
          {!isCodeSent ? (
            <button
              onClick={handleAddPhone}
              className="bg-telegram-blue text-white p-2 rounded hover:bg-blue-600"
            >
              Enviar Código
            </button>
          ) : (
            <button
              onClick={handleVerifyPhone}
              className="bg-telegram-blue text-white p-2 rounded hover:bg-blue-600"
            >
              Verificar Número
            </button>
          )}
          <div className="mt-4">
            <h3 className="text-gray-700">Números Cadastrados</h3>
            <ul>
              {phones.map((phone) => (
                <li key={phone} className="flex justify-between py-2">
                  <span>{phone}</span>
                  <button
                    onClick={() => handleRemovePhone(phone)}
                    className="text-red-500 hover:underline"
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BulkMessage />
          <AddMembers />
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: { initialSession: session },
  };
}
