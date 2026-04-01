import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";
import { useForm } from "react-hook-form";

export default function NovoPedido() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [ingressos, setIngressos] = useState<any[]>([]);
    const [lanches, setLanches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [ingressosRes, lanchesRes] = await Promise.all([
                api.get("/ingressos"),
                api.get("/lanches-combo"),
            ]);
            setIngressos(ingressosRes.data);
            setLanches(lanchesRes.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function onSubmit(data: any) {
        try {
            const ingressoIds = Array.isArray(data.ingressoIds) ? data.ingressoIds : [data.ingressoIds];
            const lancheIds = Array.isArray(data.lancheIds) ? data.lancheIds : (data.lancheIds ? [data.lancheIds] : []);

            const payload = {
                cliente: Number(data.cliente),
                ingressoIds: ingressoIds.map(Number).filter(Boolean),
                lanches: lancheIds.map(Number).filter(Boolean).map((id: number) => ({
                    lancheComboId: id,
                    quantidade: 1,
                })),
            };

            await api.post("/pedidos", payload);
            window.location.href = "/pedidos";
        } catch (e) {
            console.error(e);
            alert("Erro ao criar pedido");
        }
    }

    if (loading) return <p>Carregando...</p>;

    return (
        <>
            <h2 className="page-title mb-4"> Novo Pedido</h2>

            <div className="form-card">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label className="form-label">ID do Cliente</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Ex: 12345"
                            {...register("cliente", { required: "ID do cliente é obrigatório" })}
                        />
                        {errors.cliente && <div className="text-danger">{String(errors.cliente.message)}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Ingressos</label>
                        <select
                            multiple
                            className="form-control"
                            size={5}
                            {...register("ingressoIds")}
                        >
                            {ingressos.length === 0 ? (
                                <option disabled>Nenhum ingresso disponível</option>
                            ) : (
                                ingressos.map(i => (
                                    <option key={i.id} value={i.id}>
                                        [{i.tipo}] Sessão #{i.sessaoId} - R$ {Number(i.valorPago).toFixed(2)}
                                    </option>
                                ))
                            )}
                        </select>
                        <small className="text-muted">Segure Ctrl para selecionar múltiplos</small>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Lanches (opcional)</label>
                        <select
                            multiple
                            className="form-control"
                            size={5}
                            {...register("lancheIds")}
                        >
                            {lanches.length === 0 ? (
                                <option disabled>Nenhum lanche disponível</option>
                            ) : (
                                lanches.map(l => (
                                    <option key={l.id} value={l.id}>
                                        {l.nome} - R$ {Number(l.preco).toFixed(2)}
                                    </option>
                                ))
                            )}
                        </select>
                        <small className="text-muted">Segure Ctrl para selecionar múltiplos (cada item será adicionado com quantidade 1)</small>
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-cine">Criar Pedido</button>
                        <Link to="/pedidos" className="btn btn-secondary">Cancelar</Link>
                    </div>
                </form>
            </div>
        </>
    );
}
