import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import CadastroPessoa from "./pages/cadastro/CadastroPessoa";
import Consulta from './pages/consulta/Consulta';
import ConsultaDetalhe from './pages/consulta/ConsultaDetalhe';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cadastro" element={<CadastroPessoa />} />
        <Route path="/consulta" element={<Consulta />} />
        <Route path="/lista-pessoas" element={<Consulta />} />
        <Route path="/consulta/:id" element={<ConsultaDetalhe />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;