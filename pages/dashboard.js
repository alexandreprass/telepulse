import { useEffect } from 'react';
import { useRouter } from 'next/router';
import jwt_decode from 'jwt-decode'; // Use jwt-decode para decodificar o token sem verificá-lo

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
      // Decodifique o token para obter as informações do usuário
      const decoded = jwt_decode(token);
      console.log('[Dashboard] Token decodificado:', decoded);

      // Opcional: verifique se o token ainda é válido com base no tempo de expiração
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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 trolls rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-telegram-blue mb-6">Dashboard</h1>
        <p>Bem-vindo ao seu painel! Você está logado.</p>
      </div>
    </div>
  );
}
