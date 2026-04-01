import { useForm } from "react-hook-form";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function NovaSala() {
  const { register, handleSubmit } = useForm();
  const nav = useNavigate();

  async function salvar(d: any) {
    d.numero = Number(d.numero);
    d.capacidade = Number(d.capacidade);
    await api.post("/salas", d);
    nav("/salas");
  }

  return (
    <>
      <h2 className="page-title mb-4"> Nova Sala</h2>

      <div className="form-card">
        <form onSubmit={handleSubmit(salvar)}>
          <div className="mb-3">
            <label className="form-label">Número</label>
            <input {...register("numero", { required: true })} className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label">Capacidade</label>
            <input {...register("capacidade", { required: true })} className="form-control" />
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-cine">Salvar</button>
            <Link to="/salas" className="btn btn-secondary">Cancelar</Link>
          </div>
        </form>
      </div>
    </>
  );
}
