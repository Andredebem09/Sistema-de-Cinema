import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";

export default function Ingressos() {
    const [lista, setLista] = useState<any[]>([]);
    const [erro, setErro] = useState("");

    useEffect(() => {
        load();
    }, []);

    async function load() {
        try {
            setErro("");
            const res = await api.get("/ingressos");
            setLista(res.data);
        } catch (e) {
            console.error(e);
            setErro("Erro ao carregar ingressos");
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="page-title"> Ingressos</h2>
                <Link to="/ingressos/novo" className="btn btn-cine">+ Novo Ingresso</Link>
            </div>

            {erro && <div className="alert alert-danger">{erro}</div>}

            <div className="table-responsive bg-white rounded-3 shadow-sm">
                <table className="table table-hover mb-0">
                    <thead className="table-header">
                        <tr>
                            <th>ID</th>
                            <th>Tipo</th>
                            <th>Valor Pago</th>
                            <th>Sessão</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lista.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-4">Nenhum ingresso cadastrado</td>
                            </tr>
                        ) : (
                            lista.map(i => (
                                <tr key={i.id} className="table-row">
                                    <td className="fw-bold">#{i.id}</td>
                                    <td>
                                        <span className="badge bg-info">{i.tipo}</span>
                                    </td>
                                    <td>R$ {Number(i.valorPago).toFixed(2)}</td>
                                    <td>Sess. {i.sessaoId}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
