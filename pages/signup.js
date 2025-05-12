import { useState } from 'react';
import { useRouter } from 'next/router';
import bcrypt from 'bcryptjs';
import { getKV, setKV } from '../lib/kv';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const existingUser = await getKV(`user:${email}`);
      if (existingUser) {
        setError('Email já cadastrado');
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await setKV(`user:${email}`, JSON.stringify({
        name,
        email,
        password: hashedPassword,
        phones: [],
      }));
      router.push('/');
    } catch (err) {
      setError('Erro ao cadastrar: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-telegram-blue mb-6">TelePulse - Cadastro</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSignup}>
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
            className="w-full bg-telegram-blue text-white p-2 rounded hover:bg-blue-600"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}