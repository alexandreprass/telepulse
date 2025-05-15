import { useEffect } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';

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
      jwt.verify(token, process.env.JWT_SECRET || '123456789');
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
