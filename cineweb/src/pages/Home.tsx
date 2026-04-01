import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";

export default function Home() {
    const [stats, setStats] = useState({
        filmes: 0,
        salas: 0,
        sessoes: 0,
        ingressos: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    async function loadStats() {
        try {
            const [filmesRes, salasRes, sessoesRes, ingressosRes] = await Promise.all([
                api.get("/filmes"),
                api.get("/salas"),
                api.get("/sessoes"),
                api.get("/ingressos"),
            ]);

            setStats({
                filmes: filmesRes.data.length,
                salas: salasRes.data.length,
                sessoes: sessoesRes.data.length,
                ingressos: ingressosRes.data.length,
            });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="home-container">
            <div className="hero-section mb-5">
                <h1 className="hero-title">🎬 Bem-vindo ao CineWeb</h1>
                <p className="hero-subtitle">Sistema Completo de Gerenciamento de Cinema</p>
            </div>

            {loading ? (
                <p className="text-center">Carregando...</p>
            ) : (
                <>
                    <div className="row g-4 mb-5">
                        <div className="col-md-6 col-lg-3">
                            <div className="stat-card">
                                <div className="stat-icon"></div>
                                <h3>{stats.filmes}</h3>
                                <p>Filmes</p>
                                <Link to="/filmes" className="stat-link">Ver mais →</Link>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-3">
                            <div className="stat-card">
                                <div className="stat-icon"></div>
                                <h3>{stats.salas}</h3>
                                <p>Salas</p>
                                <Link to="/salas" className="stat-link">Ver mais →</Link>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-3">
                            <div className="stat-card">
                                <div className="stat-icon"></div>
                                <h3>{stats.sessoes}</h3>
                                <p>Sessões</p>
                                <Link to="/sessoes" className="stat-link">Ver mais →</Link>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-3">
                            <div className="stat-card">
                                <div className="stat-icon"></div>
                                <h3>{stats.ingressos}</h3>
                                <p>Ingressos</p>
                                <Link to="/ingressos" className="stat-link">Ver mais →</Link>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="menu-card">
                                <h3> Gerenciar Filmes</h3>
                                <p>Cadastre, edite e remova filmes do catálogo</p>
                                <Link to="/filmes" className="btn btn-cine w-100">Ir para Filmes</Link>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="menu-card">
                                <h3> Gerenciar Salas</h3>
                                <p>Controle as salas de exibição e capacidades</p>
                                <Link to="/salas" className="btn btn-cine w-100">Ir para Salas</Link>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="menu-card">
                                <h3> Gerenciar Sessões</h3>
                                <p>Agende exibições e controle horários</p>
                                <Link to="/sessoes" className="btn btn-cine w-100">Ir para Sessões</Link>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="menu-card">
                                <h3> Vender Ingressos</h3>
                                <p>Venda ingressos para as sessões</p>
                                <Link to="/ingressos" className="btn btn-cine w-100">Ir para Ingressos</Link>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="menu-card">
                                <h3> Gerenciar Lanches</h3>
                                <p>Cadastre combos de lanches</p>
                                <Link to="/lanches" className="btn btn-cine w-100">Ir para Lanches</Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
