import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";
import { useForm } from "react-hook-form";

export default function NovoLanche() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    async function onSubmit(data: any) {
        setLoading(true);
        try {
            const payload = {
                nome: data.nome,
                descricao: data.descricao,
                preco: Number(data.preco),
                itens: data.itens || "",
            };
            await api.post("/lanches-combo", payload);
            window.location.href = "/lanches";
        } catch (e) {
            console.error(e);
            alert("Erro ao criar lanche");
            setLoading(false);
        }
    }

    return (
        <>
            <h2 className="page-title mb-4"> Novo Combo de Lanches</h2>

            <div className="form-card">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label className="form-label">Nome</label>
                        <input
                            className="form-control"
                            placeholder="Ex: Combo Popular"
                            {...register("nome", { required: "Nome é obrigatório" })}
                        />
                        {errors.nome && <div className="text-danger">{String(errors.nome.message)}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Descrição</label>
                        <textarea
                            className="form-control"
                            rows={3}
                            placeholder="Ex: Pipoca média + refrigerante grande"
                            {...register("descricao")}
                        ></textarea>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Itens (opcional)</label>
                        <textarea
                            className="form-control"
                            rows={2}
                            placeholder="Ex: 1x Pipoca, 1x Refrigerante"
                            {...register("itens")}
                        ></textarea>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Preço</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            placeholder="Ex: 25.90"
                            {...register("preco", { required: "Preço é obrigatório" })}
                        />
                        {errors.preco && <div className="text-danger">{String(errors.preco.message)}</div>}
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-cine" disabled={loading}>
                            {loading ? "Salvando..." : "Salvar"}
                        </button>
                        <Link to="/lanches" className="btn btn-secondary">Cancelar</Link>
                    </div>
                </form>
            </div>
        </>
    );
}
