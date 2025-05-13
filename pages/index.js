import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log('[Login] Tentando login:', { email });
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      console.log('[Login] Resultado do signIn:', result);
      if (result.error) {
        throw new Error(result.error);
      }

      console.log('[Login] Redirecionando para /dashboard');
      router.push('/dashboard');
    } catch (err) {
      console.error('[Login] Erro:', err);
      setError(`Erro: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-telegram-blue mb-6">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
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
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="bg-telegram-blue text-white p-2 rounded w-full hover:bg-blue-600"
          >
            Entrar
          </button>
        </form>
        <p className="mt-4 text-center">
          Não tem conta? <a href="/signup" className="text-telegram-blue hover:underline">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
}
