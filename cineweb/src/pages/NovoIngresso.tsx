import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";
import { useForm } from "react-hook-form";

export default function NovoIngresso() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [filmes, setFilmes] = useState<any[]>([]);
    const [sessoes, setSessoes] = useState<any[]>([]);
    const [lanches, setLanches] = useState<any[]>([]);
    const [filmeSelecionado, setFilmeSelecionado] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSessoes();
    }, []);

    async function loadSessoes() {
        try {
            const [filmesRes, sessoesRes, lanchesRes] = await Promise.all([
                api.get("/filmes"),
                api.get("/sessoes"),
                api.get("/lanches-combo"),
            ]);
            setFilmes(filmesRes.data);
            setSessoes(sessoesRes.data);
            setLanches(lanchesRes.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function onSubmit(data: any) {
        try {
            const lancheIds = Array.isArray(data.lancheIds)
                ? data.lancheIds.map(Number).filter(Boolean)
                : data.lancheIds
                    ? [Number(data.lancheIds)]
                    : [];

            if (!filmeSelecionado) {
                alert("Selecione um filme para continuar.");
                return;
            }

            if (lancheIds.length > 0 && !data.clienteId) {
                alert("Informe o ID do cliente para concluir venda com combos.");
                return;
            }

            const ingressoPayload = {
                sessaoId: Number(data.sessaoId),
                tipo: data.tipo,
                valorPago: Number(data.valorPago),
            };

            const ingressoCriado = await api.post("/ingressos", ingressoPayload);

            if (lancheIds.length > 0) {
                await api.post("/pedidos", {
                    cliente: Number(data.clienteId),
                    ingressoIds: [ingressoCriado.data.id],
                    lanches: lancheIds.map((lancheComboId: number) => ({
                        lancheComboId,
                        quantidade: 1,
                    })),
                });
            }

            window.location.href = "/ingressos";
        } catch (e) {
            console.error(e);
            alert("Erro ao criar ingresso");
        }
    }

    if (loading) return <p>Carregando...</p>;

    return (
        <>
            <h2 className="page-title mb-4"> Novo Ingresso</h2>

            <div className="form-card">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label className="form-label">Filme</label>
                        <select
                            className="form-control"
                            value={filmeSelecionado ?? ""}
                            onChange={(e) => setFilmeSelecionado(e.target.value ? Number(e.target.value) : null)}
                        >
                            <option value="">Selecione um filme</option>
                            {filmes.map(f => (
                                <option key={f.id} value={f.id}>{f.titulo}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Sessão</label>
                        <select className="form-control" {...register("sessaoId", { required: "Sessão é obrigatória" })}>
                            <option value="">Selecione uma sessão</option>
                            {sessoes
                                .filter(s => !filmeSelecionado || s.filmeId === filmeSelecionado)
                                .map(s => (
                                    <option key={s.id} value={s.id}>
                                        Sala {s.sala?.numero} • {new Date(s.horarioInicio).toLocaleString()}
                                    </option>
                                ))}
                        </select>
                        {errors.sessaoId && <div className="text-danger">{String(errors.sessaoId.message)}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Tipo</label>
                        <select className="form-control" {...register("tipo", { required: "Tipo é obrigatório" })}>
                            <option value="">Selecione o tipo</option>
                            <option value="INTEIRA">Inteira</option>
                            <option value="MEIA">Meia</option>
                        </select>
                        {errors.tipo && <div className="text-danger">{String(errors.tipo.message)}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Valor Pago</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            {...register("valorPago", { required: "Valor é obrigatório" })}
                        />
                        {errors.valorPago && <div className="text-danger">{String(errors.valorPago.message)}</div>}
                    </div>

                    <hr />
                    <h6 className="mb-2">Adicionar combos à venda (opcional)</h6>

                    <div className="mb-3">
                        <label className="form-label">ID do Cliente (necessário para venda com combo)</label>
                        <input
                            type="number"
                            className="form-control"
                            {...register("clienteId")}
                            placeholder="Ex: 1001"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Combos</label>
                        <select multiple className="form-control" size={4} {...register("lancheIds")}>
                            {lanches.map((l) => (
                                <option key={l.id} value={l.id}>
                                    {l.nome} - R$ {Number(l.preco).toFixed(2)}
                                </option>
                            ))}
                        </select>
                        <small className="text-muted">Segure Ctrl para selecionar múltiplos combos.</small>
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-cine">Salvar</button>
                        <Link to="/ingressos" className="btn btn-secondary">Cancelar</Link>
                    </div>
                </form>
            </div>
        </>
    );
}
