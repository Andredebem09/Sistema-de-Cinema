import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import FilmesPage from './pages/FilmesPage';
import SalasPage from './pages/SalasPage';
import SessoesPage from './pages/SessoesPage';
import IngressosPage from './pages/IngressosPage';
import VendaIngressoPage from './pages/VendaIngressoPage';
import CombosPage from './pages/CombosPage';

function App() {
  return (
    <>
      <Navbar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/filmes" element={<FilmesPage />} />
          <Route path="/salas" element={<SalasPage />} />
          <Route path="/sessoes" element={<SessoesPage />} />
          <Route path="/ingressos" element={<IngressosPage />} />
          <Route path="/sessoes/:sessaoId/venda" element={<VendaIngressoPage />} />
          <Route path="*" element={<Navigate to="/" />} />
            <Route path="/combos" element={<CombosPage />} />

        </Routes>
      </main>
    </>
  );
}

export default App;
