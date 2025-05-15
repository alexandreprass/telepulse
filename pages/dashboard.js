import { useEffect } from 'react';
import { useRouter } from 'next/router';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('[Dashboard] Token não encontrado, redirecionando para /');
      router.push('/');
      return;
    }

    try {
      const decoded = jwt_decode(token);
      console.log('[Dashboard] Token decodificado:', decoded);

      const currentTime = Date.now() / 1000; // Tempo atual em segundos
      if (decoded.exp && decoded.exp < currentTime) {
        throw new Error('Token expirado');
      }

      console.log('[Dashboard] Token válido, usuário autenticado');
    } catch (err) {
      console.error('[Dashboard] Token inválido:', err);
      localStorage.removeItem('token');
      router.push('/');
    }
  }, [router]);

  const handleTelegramLogin = async () => {
    try {
      const response = await axios.get('/api/auth/telegram/login');
      if (response.status === 200) {
        alert('Login no Telegram realizado com sucesso!');
      } else {
        alert('Erro ao realizar login no Telegram.');
      }
    } catch (error) {
      console.error('[Telegram Login] Erro:', error);
      alert('Erro ao realizar login no Telegram: ' + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-telegram-blue mb-6">Dashboard</h1>
        <p>Bem-vindo ao seu painel! Escolha uma funcionalidade abaixo:</p>

        {/* Botões para funcionalidades */}
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
