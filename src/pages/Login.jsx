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

  // Login Tradicional (E-mail e Senha)
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

  // Sucesso no Login com Google
  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError('');
    
    try {
      const googleToken = credentialResponse.credential;
      const response = await client.post('/auth/google', { 
        token: googleToken 
      });

      localStorage.setItem('@NeoFrame:token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Erro ao autenticar com o Google no servidor.');
      console.error("Falha no login social:", err);
    } finally {
      setIsLoading(false);
    }
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

          {/* BOTÃO DO GOOGLE (Corrigido para ocupar 100% da largura) */}
          {/* BOTÃO DO GOOGLE */}
          <div className="w-full flex justify-center">

            {/* CONTAINER FIXO */}
            <div
              className="
                relative
                w-full
                h-[44px]
                flex
                items-center
                justify-center
                overflow-hidden
              "
            >

              {/* CENTRALIZA O IFRAME DO GOOGLE */}
              <div
                className="
                  absolute
                  left-1/2
                  -translate-x-1/2
                "
              >

                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Falha ao abrir pop-up do Google')}
                  theme="outline"
                  size="large"
                  shape="pill"
                  text="continue_with"
                  width="380"
                />

              </div>

            </div>

          </div>

          <div className="mt-8 text-center text-sm text-slate-500">
            Ainda não tem uma conta? <Link to="/registro" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Criar conta</Link>
          </div>

        </div>
      </div>
    </div>
  );
}