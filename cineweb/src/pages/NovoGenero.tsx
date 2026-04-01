import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/api";

export default function NovoGenero() {
    const { register, handleSubmit } = useForm();
    const nav = useNavigate();

    async function salvar(d: any) {
        await api.post("/generos", { nome: d.nome });
        nav("/generos");
    }

    return (
        <>
            <h2 className="page-title mb-4"> Novo Gênero</h2>

            <div className="form-card">
                <form onSubmit={handleSubmit(salvar)}>
                    <div className="mb-3">
                        <label className="form-label">Nome</label>
                        <input className="form-control" {...register("nome", { required: true })} />
                    </div>

                    <div className="d-flex gap-2">
                        <button className="btn btn-cine">Salvar</button>
                        <Link to="/generos" className="btn btn-secondary">Cancelar</Link>
                    </div>
                </form>
            </div>
        </>
    );
}
