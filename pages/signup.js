import { useState } from 'react';
import { useRouter } from 'next/router';
import { getKV, setKV } from '@/lib/kv';
import { signIn } from 'next-auth/react';
import bcrypt from 'bcryptjs';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Verificar se o usuário já existe
      const existingUserData = await getKV(`user:${email}`);
      if (existingUserData) {
        throw new Error('Usuário já cadastrado');
      }

      // Criar novo usuário com senha hasheada
      const hashedPassword = await bcrypt.hash(password, 10);
      const userData = {
        name,
        email,
        password: hashedPassword,
        phones: [],
      };
      await setKV(`user:${email}`, JSON.stringify(userData));

      // Fazer login automático
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      router.push('/dashboard');
    } catch (err) {
      setError(`Erro ao cadastrar: ${err.message}`);
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
            />
          </div>
          <button
            type="submit"
            className="bg-telegram-blue text-white p-2 rounded w-full hover:bg-blue-600"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
