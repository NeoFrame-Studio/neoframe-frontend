import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Importando suas telas
import { Dashboard } from "./pages/Dashboard";
import UploadForm from "./components/UploadForm"; 
import { Login } from "./pages/Login";
import { Registro } from "./pages/Registro";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota padrão joga pro login ou dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Aqui está a mágica: a rota que o botão do Dashboard chama */}
        <Route path="/upload" element={<UploadForm />} />
      </Routes>
    </BrowserRouter>
  );
}