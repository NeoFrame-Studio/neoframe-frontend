import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

// Páginas
import { Dashboard } from "./pages/Dashboard";
import UploadForm from "./components/UploadForm";
import { Login } from "./pages/Login";
import { Registro } from "./pages/Registro";

// Proteção de rotas
import { RequireAuth } from "./pages/RequireAuth";

// Substitua pelo seu ID real gerado no Google Cloud
const GOOGLE_CLIENT_ID = "SEU_CLIENT_ID_AQUI.apps.googleusercontent.com";

export default function App() {

  // verifica se existe token salvo
  const isAuthenticated = localStorage.getItem("@NeoFrame:token");

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>

          {/* Rota raiz inteligente */}
          <Route
            path="/"
            element={
              isAuthenticated
                ? <Navigate to="/dashboard" replace />
                : <Navigate to="/login" replace />
            }
          />

          {/* =========================
              ROTAS PÚBLICAS
          ========================== */}

          <Route path="/login" element={<Login />} />

          <Route path="/registro" element={<Registro />} />

          {/* =========================
              ROTAS PRIVADAS
          ========================== */}

          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />

          <Route
            path="/upload"
            element={
              <RequireAuth>
                <UploadForm />
              </RequireAuth>
            }
          />

          {/* Qualquer rota inexistente */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}