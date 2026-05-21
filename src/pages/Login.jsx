import { useState } from 'react';
import client from '../api/client';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Chama o controlador de Auth do Java
      const response = await client.post('/auth/login', { email, password });
      
      // Salva o token e redireciona
      localStorage.setItem('@NeoFrame:token', response.data.token);
      window.location.href = '/dashboard'; // Redireciona para a área logada
      
    } catch (err) {
      // Trata a exceção que criamos no ExceptionHandler do Java (400 Bad Request)
      setError(err.response?.data?.error || 'Erro ao fazer login. Tente novamente.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <form onSubmit={handleLogin} className="flex flex-col gap-4 p-8 bg-gray-800 rounded-lg w-96 shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Entrar no NeoFrame</h2>
        
        {error && <div className="p-3 bg-red-500/20 text-red-300 rounded border border-red-500/50">{error}</div>}

        <input
          type="email"
          placeholder="Seu e-mail"
          className="p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="Sua senha"
          className="p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button type="submit" className="p-3 mt-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors">
          Acessar
        </button>
      </form>
    </div>
  );
}