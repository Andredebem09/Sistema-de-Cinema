import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";

export default function Lanches() {
    const [lista, setLista] = useState<any[]>([]);
    const [erro, setErro] = useState("");

    useEffect(() => {
        load();
    }, []);

    async function load() {
        try {
            setErro("");
            const res = await api.get("/lanches-combo");
            setLista(res.data);
        } catch (e) {
            console.error(e);
            setErro("Erro ao carregar lanches");
        }
    }

    async function del(id: number) {
        if (!confirm("Excluir lanche?")) return;
        try {
            await api.delete(`/lanches-combo/${id}`);
            await load();
        } catch (e) {
            console.error(e);
            setErro("Erro ao excluir lanche");
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="page-title"> Lanches e Combos</h2>
                <Link to="/lanches/novo" className="btn btn-cine">+ Novo Combo</Link>
            </div>

            {erro && <div className="alert alert-danger">{erro}</div>}

            <div className="row g-3">
                {lista.length === 0 ? (
                    <div className="col-12">
                        <div className="alert alert-info">Nenhum lanche cadastrado</div>
                    </div>
                ) : (
                    lista.map(l => (
                        <div key={l.id} className="col-md-6 col-lg-4">
                            <div className="lanche-card">
                                <div className="lanche-header">
                                    <h5>{l.nome}</h5>
                                    <span className="badge bg-success">R$ {Number(l.preco).toFixed(2)}</span>
                                </div>
                                <p className="lanche-desc">{l.descricao || "Sem descrição"}</p>
                                <div className="lanche-footer">
                                    <Link to={`/lanches/editar/${l.id}`} className="btn btn-sm btn-primary">Editar</Link>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => del(l.id)}
                                    >
                                        Deletar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}
