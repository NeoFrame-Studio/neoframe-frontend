import { Navigate } from 'react-router-dom';

export function RequireAuth({ children }) {
  // O mais básico possível: verifica se a string existe no navegador
  const token = localStorage.getItem('@NeoFrame:token');

  if (!token) {
    // Se não tem token, redireciona pro login imediatamente
    return <Navigate to="/login" replace />;
  }

  // Se tem token, renderiza a tela que o usuário pediu (ex: Dashboard)
  return children;
}