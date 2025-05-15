import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  const handleTelegramLogin = async () => {
    try {
      const response = await fetch('/api/telegram/logins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: 'SEU_NUMERO', code: 'SEU_CODIGO' }), // Ajuste conforme necessário
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao logar no Telegram');
      alert('Login no Telegram realizado com sucesso!');
    } catch (error) {
      alert('Erro ao realizar login no Telegram: ' + error.message);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  if (status === 'loading') return <p>Carregando...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-500 mb-6">Dashboard</h1>
        <p>Bem-vindo ao seu painel, {session?.user?.name || 'Usuário'}! Escolha uma funcionalidade abaixo:</p>
        <div className="mt-6 space-y-4">
          <button
            onClick={handleTelegramLogin}
            className="bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600"
          >
            Login no Telegram
          </button>
          <button
            onClick={() => router.push('/bulk-messages')}
            className="bg-green-500 text-white py-2 px-4 rounded w-full hover:bg-green-600"
          >
            Enviar Mensagens em Massa
          </button>
          <button
            onClick={() => router.push('/add-members')}
            className="bg-yellow-500 text-white py-2 px-4 rounded w-full hover:bg-yellow-600"
          >
            Adicionar Membros a Grupos
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded w-full hover:bg-red-600"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
