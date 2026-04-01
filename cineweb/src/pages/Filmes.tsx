import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";
import FilmeCard from "../components/FilmeCard";

export default function Filmes() {
  const [lista, setLista] = useState<any[]>([]);
  const [erro, setErro] = useState<string>("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setErro("");
      const res = await api.get("/filmes");
      setLista(res.data);
    } catch (e) {
      console.error(e);
      setErro("Não foi possível carregar filmes. Verifique se o backend está rodando em http://localhost:3000.");
    }
  }

  async function del(id: number) {
    if (!confirm("Excluir filme?")) return;
    await api.delete(`/filmes/${id}`);
    await load();
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Filmes</h2>
        <Link className="btn btn-cine" to="/filmes/novo">+ Novo Filme</Link>
      </div>

      {erro && <div className="alert alert-warning">{erro}</div>}

      <div className="row g-3">
        {lista.map(f => (
          <div key={f.id} className="col-12 col-md-6 col-lg-4">
            <FilmeCard filme={f} onDelete={() => del(f.id)} />
          </div>
        ))}
      </div>
    </>
  );
}
