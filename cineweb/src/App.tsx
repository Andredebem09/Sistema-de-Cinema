import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Filmes from "./pages/Filmes";
import NovoFilme from "./pages/NovoFilme";

import EditarFilme from "./pages/EditarFilme";

import Salas from "./pages/Salas";
import NovaSala from "./pages/NovaSala";

import Sessoes from "./pages/Sessoes";
import NovaSessao from "./pages/NovaSessao";


import VenderIngresso from "./pages/VenderIngresso";
import Home from "./pages/Home";
import Generos from "./pages/Generos";
import NovoGenero from "./pages/NovoGenero";
import Ingressos from "./pages/Ingressos";
import NovoIngresso from "./pages/NovoIngresso";
import Lanches from "./pages/Lanches";
import NovoLanche from "./pages/NovoLanche";
import EditarLanche from "./pages/EditarLanche";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/filmes" element={<Filmes />} />
          <Route path="/filmes/novo" element={<NovoFilme />} />
          <Route path="/filmes/editar/:id" element={<EditarFilme />} />

          <Route path="/generos" element={<Generos />} />
          <Route path="/generos/novo" element={<NovoGenero />} />

          <Route path="/salas" element={<Salas />} />
          <Route path="/salas/novo" element={<NovaSala />} />

          <Route path="/sessoes" element={<Sessoes />} />
          <Route path="/sessoes/novo" element={<NovaSessao />} />

          <Route path="/venda/:id" element={<VenderIngresso />} />

          <Route path="/ingressos" element={<Ingressos />} />
          <Route path="/ingressos/novo" element={<NovoIngresso />} />

          <Route path="/lanches" element={<Lanches />} />
          <Route path="/lanches/novo" element={<NovoLanche />} />
          <Route path="/lanches/editar/:id" element={<EditarLanche />} />
        </Routes>
      </div>
    </>
  );
}
