import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';

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

  const handleGoogleLogin = () => {
    // Aqui você integra a chamada para o Google OAuth (Firebase, backend, etc)
    console.log('Iniciando login com Google...');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#09090b] text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30 py-10">
      
      {/* EFEITO AMBIENT LIGHT / LIQUID GLASS */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-teal-600/10 blur-[120px] pointer-events-none" />

      {/* ÁREA DO FORMULÁRIO */}
      <div className="relative z-10 w-full max-w-md px-6">
        
        <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl shadow-2xl">
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-teal-300 tracking-wider mb-2">
              NEOFRAME
            </h1>
            <p className="text-slate-400 text-sm">Acesse seu estúdio criativo</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            
            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm animate-pulse">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{error}</span>
              </div>
            )}

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

          {/* DIVISOR OU */}
          <div className="flex items-center gap-4 my-6">
            <hr className="flex-1 border-white/5" />
            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">ou</span>
            <hr className="flex-1 border-white/5" />
          </div>

          {/* BOTÃO DO GOOGLE */}
          <button 
            type="button" 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] transition-all text-slate-200 font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar com Google
          </button>

          <div className="mt-8 text-center text-sm text-slate-500">
            Ainda não tem uma conta? <Link to="/registro" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Criar conta</Link>
          </div>

        </div>
      </div>
    </div>
  );
}