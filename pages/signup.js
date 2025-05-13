import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Cadastrar usuário
      console.log('[Signup] Enviando cadastro:', { name, email });
      const signupResponse = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const signupData = await signupResponse.json();
      console.log('[Signup] Resposta de /api/signup:', signupData);
      if (!signupResponse.ok) {
        throw new Error(signupData.error || 'Erro ao cadastrar usuário');
      }

      // Fazer login automático
      console.log('[Signup] Tentando login automático para:', email);
      const loginResponse = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginResponse.json();
      console.log('[Signup] Resposta de /api/login:', loginData);
      if (!loginResponse.ok) {
        throw new Error(loginData.error || 'Erro ao fazer login');
      }

      console.log('[Signup] Redirecionando para /dashboard');
      router.push('/dashboard');
    } catch (err) {
      console.error('[Signup] Erro:', err);
      setError(`Erro: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-telegram-blue mb-6">Cadastrar</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
              autoComplete="name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
              autoComplete="email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            className="bg-telegram-blue text-white p-2 rounded w-full hover:bg-blue-600"
          >
            Cadastrar
          </button>
        </form>
        <p className="mt-4 text-center">
          Já tem conta? <a href="/" className="text-telegram-blue hover:underline">Entrar</a>
        </p>
      </div>
    </div>
  );
}
