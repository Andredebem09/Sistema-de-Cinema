import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { api } from "../api/api";
import { useForm } from "react-hook-form";

export default function EditarLanche() {
    const { id } = useParams();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLanche();
    }, []);

    async function loadLanche() {
        try {
            const res = await api.get(`/lanches-combo/${id}`);
            setValue("nome", res.data.nome);
            setValue("descricao", res.data.descricao);
            setValue("preco", res.data.preco);
        } catch (e) {
            console.error(e);
            alert("Erro ao carregar lanche");
        } finally {
            setLoading(false);
        }
    }

    async function onSubmit(data: any) {
        try {
            const payload = {
                nome: data.nome,
                descricao: data.descricao,
                preco: Number(data.preco),
            };
            await api.patch(`/lanches-combo/${id}`, payload);
            window.location.href = "/lanches";
        } catch (e) {
            console.error(e);
            alert("Erro ao atualizar lanche");
        }
    }

    if (loading) return <p>Carregando...</p>;

    return (
        <>
            <h2 className="page-title mb-4">🍿 Editar Lanche</h2>

            <div className="form-card">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label className="form-label">Nome</label>
                        <input
                            className="form-control"
                            {...register("nome", { required: "Nome é obrigatório" })}
                        />
                        {errors.nome && <div className="text-danger">{String(errors.nome.message)}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Descrição</label>
                        <textarea
                            className="form-control"
                            rows={3}
                            {...register("descricao")}
                        ></textarea>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Preço</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            {...register("preco", { required: "Preço é obrigatório" })}
                        />
                        {errors.preco && <div className="text-danger">{String(errors.preco.message)}</div>}
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-cine">Salvar</button>
                        <Link to="/lanches" className="btn btn-secondary">Cancelar</Link>
                    </div>
                </form>
            </div>
        </>
    );
}
