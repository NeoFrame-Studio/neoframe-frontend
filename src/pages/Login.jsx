import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { GoogleLogin } from '@react-oauth/google';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await client.post('/auth/login', { email, password });
      localStorage.setItem('@NeoFrame:token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await client.post('/auth/google', {
        token: credentialResponse.credential,
      });
      localStorage.setItem('@NeoFrame:token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Erro ao autenticar com o Google no servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#09090b] text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30 py-10">

      {/* Ambient blobs */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-teal-600/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl shadow-2xl">

          {/* Logo */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-teal-300 tracking-wider mb-2">
              NEOFRAME
            </h1>
            <p className="text-slate-400 text-sm">Acesse seu estúdio criativo</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 px-1">E-mail</label>
              <input
                type="email"
                placeholder="nome@exemplo.com"
                className="w-full px-5 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] focus:border-indigo-500/50 focus:bg-white/[0.05] text-slate-200 outline-none transition-all placeholder:text-slate-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <label className="block text-sm font-medium text-slate-400">Senha</label>
                <Link to="/esqueci-senha" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  Esqueceu a senha?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-5 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] focus:border-indigo-500/50 focus:bg-white/[0.05] text-slate-200 outline-none transition-all placeholder:text-slate-600 tracking-widest"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full flex items-center justify-center px-6 py-4 rounded-full bg-white text-black font-medium hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] disabled:opacity-70 disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                'Entrar na Plataforma'
              )}
            </button>
          </form>

          {/* Divisor */}
          <div className="flex items-center gap-4 my-6">
            <hr className="flex-1 border-white/5" />
            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">ou</span>
            <hr className="flex-1 border-white/5" />
          </div>

          {/*
            TRUQUE: O botão visual é seu, 100% estilizado.
            O <GoogleLogin> fica em cima via absolute, invisível (opacity-0),
            mas clicável — o Google processa o clique no iframe dele.
            Resultado: visual seu, autenticação deles. Sem hacks de CSS.
          */}
          <div className="relative w-full h-[52px]">

            {/* Botão visual — camada de baixo */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 rounded-full bg-white/[0.03] border border-white/[0.08] text-slate-300 font-medium pointer-events-none select-none">
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              Continuar com Google
            </div>

            {/* GoogleLogin invisível — camada de cima, capta o clique */}
            <div className="absolute inset-0 opacity-0 overflow-hidden rounded-full [&>div]:!w-full [&>div]:!h-full [&_iframe]:!w-full [&_iframe]:!h-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Falha ao abrir pop-up do Google')}
                width="999"
                shape="pill"
                size="large"
                text="continue_with"
              />
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-slate-500">
            Ainda não tem uma conta?{' '}
            <Link to="/registro" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Criar conta
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}