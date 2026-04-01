import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function Sessoes() {
  const [lista, setLista] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const s = await api.get("/sessoes");
    setLista(s.data);
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title"> Sessões</h2>
        <a className="btn btn-cine" href="/sessoes/novo">+ Nova Sessão</a>
      </div>

      <div className="table-responsive bg-white rounded-3 shadow-sm">
        <table className="table table-hover mb-0">
          <thead>
            <tr className="table-header">
              <th>ID</th>
              <th>Filme</th>
              <th>Sala</th>
              <th>Data/Hora</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lista.map(s => (
              <tr key={s.id} className="table-row">
                <td>{s.id}</td>
                <td>{s.filme?.titulo}</td>
                <td>{s.sala?.numero}</td>
                <td>{new Date(s.horarioInicio).toLocaleString()}</td>
                <td>
                  <a href={`/venda/${s.id}`} className="btn btn-sm btn-cine">Vender</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
