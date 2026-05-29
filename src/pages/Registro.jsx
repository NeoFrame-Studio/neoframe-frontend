import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';

export function Registro() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError('');

    // validação senha igual
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setIsLoading(false);
      return;
    }

    // validação mínima
    if (password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await client.post('/auth/register', {
        name,
        email,
        password,
      });

      // auto login
      localStorage.setItem('@NeoFrame:token', response.data.token);

      // redirecionamento React SPA
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'Erro ao criar conta. Tente novamente mais tarde.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#09090b] text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30 py-10">
      {/* BACKGROUND LIGHT */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-teal-600/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl shadow-2xl">
          {/* HEADER */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-teal-300 tracking-wider mb-2">
              NEOFRAME
            </h1>

            <p className="text-slate-400 text-sm">
              Crie sua conta e entre no estúdio criativo
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm animate-pulse">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>

                <span>{error}</span>
              </div>
            )}

            {/* NOME */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 px-1">
                Nome completo
              </label>

              <input
                type="text"
                autoComplete="name"
                placeholder="Seu nome"
                className="w-full px-5 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] focus:border-indigo-500/50 focus:bg-white/[0.05] text-slate-200 outline-none transition-all placeholder:text-slate-600"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 px-1">
                E-mail
              </label>

              <input
                type="email"
                autoComplete="email"
                placeholder="nome@exemplo.com"
                className="w-full px-5 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] focus:border-indigo-500/50 focus:bg-white/[0.05] text-slate-200 outline-none transition-all placeholder:text-slate-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* SENHA */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 px-1">
                Senha
              </label>

              <input
                type="password"
                autoComplete="new-password"
                placeholder="Crie uma senha forte"
                className="w-full px-5 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] focus:border-indigo-500/50 focus:bg-white/[0.05] text-slate-200 outline-none transition-all placeholder:text-slate-600 tracking-widest"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <p className="text-xs text-slate-500 mt-2 px-1">
                Use pelo menos 6 caracteres.
              </p>
            </div>

            {/* CONFIRMAR SENHA */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 px-1">
                Confirmar senha
              </label>

              <input
                type="password"
                autoComplete="new-password"
                placeholder="Digite novamente sua senha"
                className="w-full px-5 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] focus:border-indigo-500/50 focus:bg-white/[0.05] text-slate-200 outline-none transition-all placeholder:text-slate-600 tracking-widest"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* BOTÃO */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full flex items-center justify-center px-6 py-4 rounded-full bg-indigo-500 text-white font-medium hover:bg-indigo-400 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] disabled:opacity-70 disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                'Criar Conta'
              )}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-6 text-center text-sm text-slate-500">
            Já possui uma conta?{' '}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}