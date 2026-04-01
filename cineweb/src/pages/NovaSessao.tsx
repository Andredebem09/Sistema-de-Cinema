import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function NovaSessao() {
  const { register, handleSubmit } = useForm();
  const [filmes, setFilmes] = useState<any[]>([]);
  const [salas, setSalas] = useState<any[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    api.get("/filmes").then(r => setFilmes(r.data));
    api.get("/salas").then(r => setSalas(r.data));
  }, []);

  async function salvar(d: any) {
    const hoje = new Date().toISOString().slice(0, 16);
    if (d.horarioInicio < hoje) {
      alert("Data não pode ser retroativa");
      return;
    }

    const payload = {
      filmeId: Number(d.filmeId),
      salaId: Number(d.salaId),
      horarioInicio: new Date(d.horarioInicio).toISOString(),
      valorIngresso: Number(d.valorIngresso),
    };

    await api.post("/sessoes", payload);
    nav("/sessoes");
  }

  return (
    <>
      <h2 className="page-title mb-4"> Nova Sessão</h2>

      <div className="form-card">
        <form onSubmit={handleSubmit(salvar)}>
          <div className="mb-3">
            <label className="form-label">Filme</label>
            <select {...register("filmeId", { required: true })} className="form-control">
              <option></option>
              {filmes.map(f => (
                <option key={f.id} value={f.id}>{f.titulo}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Sala</label>
            <select {...register("salaId", { required: true })} className="form-control">
              <option></option>
              {salas.map(s => (
                <option key={s.id} value={s.id}>Sala {s.numero}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Data/Hora</label>
            <input type="datetime-local" {...register("horarioInicio", { required: true })} className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label">Valor do Ingresso</label>
            <input type="number" step="0.01" min="0" {...register("valorIngresso", { required: true })} className="form-control" />
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-cine">Salvar</button>
            <Link to="/sessoes" className="btn btn-secondary">Cancelar</Link>
          </div>
        </form>
      </div>
    </>
  );
}
