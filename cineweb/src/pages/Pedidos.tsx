import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";

export default function Pedidos() {
    const [lista, setLista] = useState<any[]>([]);
    const [erro, setErro] = useState("");

    useEffect(() => {
        load();
    }, []);

    async function load() {
        try {
            setErro("");
            const res = await api.get("/pedidos");
            setLista(res.data);
        } catch (e) {
            console.error(e);
            setErro("Erro ao carregar pedidos");
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="page-title"> Pedidos</h2>
                <Link to="/pedidos/novo" className="btn btn-cine">+ Novo Pedido</Link>
            </div>

            {erro && <div className="alert alert-danger">{erro}</div>}

            <div className="table-responsive bg-white rounded-3 shadow-sm">
                <table className="table table-hover mb-0">
                    <thead className="table-header">
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Data/Hora</th>
                            <th>Valor Total</th>
                            <th>Detalhes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lista.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-4">Nenhum pedido cadastrado</td>
                            </tr>
                        ) : (
                            lista.map(p => (
                                <tr key={p.id} className="table-row">
                                    <td className="fw-bold">#{p.id}</td>
                                    <td>{p.cliente}</td>
                                    <td>{new Date(p.dataHora).toLocaleString()}</td>
                                    <td className="fw-bold text-success">R$ {Number(p.valorTotal).toFixed(2)}</td>
                                    <td>
                                        <Link to={`/pedidos/${p.id}`} className="btn btn-sm btn-info">
                                            Ver
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
