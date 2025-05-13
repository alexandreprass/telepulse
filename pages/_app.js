import { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Verifica se o usuário está logado (exemplo simples)
    const checkAuth = async () => {
      const response = await fetch('/api/auth/session');
      const session = await response.json();
      if (!session.user && router.pathname !== '/signup' && router.pathname !== '/') {
        router.push('/');
      }
    };
    checkAuth();
  }, [router.pathname]);

  return <Component {...pageProps} />;
}

export default MyApp;
