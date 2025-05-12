import { signOut } from 'next-auth/react';

export default function Navbar() {
  return (
    <nav className="bg-telegram-blue text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">TelePulse</h1>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="bg-white text-telegram-blue px-4 py-2 rounded hover:bg-gray-200"
        >
          Sair
        </button>
      </div>
    </nav>
  );
}