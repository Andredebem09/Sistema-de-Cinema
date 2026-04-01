import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";

export default function Generos() {
    const [lista, setLista] = useState<any[]>([]);
    const [erro, setErro] = useState("");

    useEffect(() => {
        load();
    }, []);

    async function load() {
        try {
            setErro("");
            const r = await api.get("/generos");
            setLista(r.data);
        } catch (e) {
            console.error(e);
            setErro("Erro ao carregar gêneros");
        }
    }

    async function del(id: number) {
        if (!confirm("Excluir gênero?")) return;
        try {
            await api.delete(`/generos/${id}`);
            await load();
        } catch (e) {
            console.error(e);
            setErro("Erro ao excluir gênero");
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="page-title"> Gêneros</h2>
                <Link to="/generos/novo" className="btn btn-cine">+ Novo Gênero</Link>
            </div>

            {erro && <div className="alert alert-danger">{erro}</div>}

            <div className="table-responsive bg-white rounded-3 shadow-sm">
                <table className="table table-hover mb-0">
                    <thead>
                        <tr className="table-header">
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lista.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="text-center py-4">Nenhum gênero cadastrado</td>
                            </tr>
                        ) : (
                            lista.map((g) => (
                                <tr key={g.id} className="table-row">
                                    <td>{g.id}</td>
                                    <td>{g.nome}</td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => del(g.id)}>
                                            Deletar
                                        </button>
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
