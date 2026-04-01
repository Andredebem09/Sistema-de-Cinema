import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function Salas() {
  const [lista, setLista] = useState<any[]>([]);

  async function load() {
    const r = await api.get("/salas");
    setLista(r.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function del(id: number) {
    if (!confirm("Excluir?")) return;
    await api.delete(`/salas/${id}`);
    load();
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title"> Salas</h2>
        <a className="btn btn-cine" href="/salas/novo">+ Nova Sala</a>
      </div>

      <div className="table-responsive bg-white rounded-3 shadow-sm">
        <table className="table table-hover mb-0">
          <thead>
            <tr className="table-header">
              <th>ID</th>
              <th>Número</th>
              <th>Capacidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lista.map(s => (
              <tr key={s.id} className="table-row">
                <td>{s.id}</td>
                <td>{s.numero}</td>
                <td>{s.capacidade}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => del(s.id)}
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
