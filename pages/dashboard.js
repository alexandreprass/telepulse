import { useEffect } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || 'seu-segredo-aqui');
    } catch (err) {
      localStorage.removeItem('token');
      router.push('/');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-telegram-blue mb-6">Dashboard</h1>
        <p>Bem-vindo ao seu painel! Você está logado.</p>
      </div>
    </div>
  );
}
