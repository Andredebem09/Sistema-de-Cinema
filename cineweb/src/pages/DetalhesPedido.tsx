import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { api } from "../api/api";

export default function DetalhesPedido() {
    const { id } = useParams();
    const [pedido, setPedido] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPedido();
    }, []);

    async function loadPedido() {
        try {
            const res = await api.get(`/pedidos/${id}`);
            setPedido(res.data);
        } catch (e) {
            console.error(e);
            alert("Erro ao carregar pedido");
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <p>Carregando...</p>;
    if (!pedido) return <p>Pedido não encontrado</p>;

    return (
        <>
            <div className="mb-4">
                <Link to="/pedidos" className="btn btn-secondary btn-sm">← Voltar</Link>
            </div>

            <h2 className="page-title mb-4">📦 Pedido #{pedido.id}</h2>

            <div className="row g-3">
                <div className="col-md-6">
                    <div className="info-card">
                        <h5>Informações do Pedido</h5>
                        <p><strong>Cliente:</strong> {pedido.cliente}</p>
                        <p><strong>Data/Hora:</strong> {new Date(pedido.dataHora).toLocaleString()}</p>
                        <p><strong>Valor Total:</strong> <span className="text-success fw-bold">R$ {Number(pedido.valorTotal).toFixed(2)}</span></p>
                    </div>
                </div>

                {pedido.pedidoIngressos && pedido.pedidoIngressos.length > 0 && (
                    <div className="col-md-6">
                        <div className="info-card">
                            <h5>Ingressos</h5>
                            <ul className="list-unstyled">
                                {pedido.pedidoIngressos.map((pi: any) => (
                                    <li key={pi.id} className="mb-2">
                                        <span className="badge bg-info">{pi.ingresso?.tipo}</span>
                                        R$ {Number(pi.ingresso?.valorPago).toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {pedido.pedidoLanches && pedido.pedidoLanches.length > 0 && (
                    <div className="col-md-6">
                        <div className="info-card">
                            <h5>Lanches</h5>
                            <ul className="list-unstyled">
                                {pedido.pedidoLanches.map((pl: any) => (
                                    <li key={pl.id} className="mb-2">
                                        <span className="badge bg-warning">{pl.lanche?.nome}</span>
                                        R$ {Number(pl.lanche?.preco).toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
