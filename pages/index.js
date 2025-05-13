const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    console.log('[Login] Tentando login:', { email });
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('[Login] Resposta de /api/login:', data);
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao fazer login');
    }

    console.log('[Login] Redirecionando para /dashboard');
    router.push('/dashboard');
  } catch (err) {
    console.error('[Login] Erro:', err);
    setError(`Erro: ${err.message}`);
  }
};
