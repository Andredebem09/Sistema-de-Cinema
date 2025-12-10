import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services.api';
import { Filme, Sala, Sessao } from '../types';
import VendaIngressoPage from './VendaIngressoPage';

function formatarDataHora(valor: string) {
  if (!valor) return '';
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return valor;
  return data.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  });
}

function HomePage() {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarDados() {
      try {
        const [respSessoes, respFilmes, respSalas] = await Promise.all([
          api.get<Sessao[]>('/sessoes'),
          api.get<Filme[]>('/filmes'),
          api.get<Sala[]>('/salas')
        ]);

        setSessoes(respSessoes.data);
        setFilmes(respFilmes.data);
        setSalas(respSalas.data);
      } finally {
        setLoading(false);
      }
    }

    void carregarDados();
  }, []);

  function obterFilme(sessao: Sessao) {
    return filmes.find(f => f.id === sessao.filmeId);
  }

  function obterSala(sessao: Sessao) {
    return salas.find(s => s.id === sessao.salaId);
  }

  function handleComprarIngresso(sessaoId: number) {
    navigate(`/sessoes/${sessaoId}/venda`);
  }


  return (
    <section>
      {/* Cabeçalho da Home */}
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold mb-3 text-primary">Sistema de cinema</h1>
        <p className="lead">
          Use o menu acima para gerenciar <strong>Filmes</strong>, <strong>Salas</strong>,{' '}
          <strong>Sessões</strong> e <strong>Ingressos</strong>.
        </p>
        <p className="text-muted">
          Sistema de gestão de cinema de gerenciamento de filmes, salas, sessões e venda de ingressos.
        </p>
      </div>

      {/* Sessões em cartaz com pôster */}
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white fw-semibold">
          Sessões em cartaz
        </div>
        <div className="card-body">
          {loading ? (
            <p className="mb-0">Carregando sessões...</p>
          ) : sessoes.length === 0 ? (
            <p className="mb-0 text-muted">Nenhuma sessão cadastrada no momento.</p>
          ) : (
            <div className="row g-4">
              {sessoes.map(sessao => {
                const filme = obterFilme(sessao);
                const sala = obterSala(sessao);

                const posterUrl =
                  (filme as any)?.urlPoster ||
                  'https://via.placeholder.com/300x450?text=Sem+poster';

                return (
                  <div key={sessao.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <div className="card h-100 shadow-sm">
                      <img
                        src={posterUrl}
                        className="card-img-top"
                        alt={filme?.titulo ?? 'Pôster do filme'}
                        style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                      />
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title mb-2">
                          {filme?.titulo ?? 'Filme não encontrado'}
                        </h5>
                        <p className="card-text mb-1">
                          <strong>Sala:</strong>{' '}
                          {sala ? `Sala ${sala.numero}` : 'Sala não encontrada'}
                        </p>
                        <p className="card-text mb-2">
                          <strong>Horário:</strong> {formatarDataHora(sessao.horarioExibicao)}
                        </p>
                        {filme?.genero && (
                          <span className="badge bg-primary align-self-start mb-2">
                            {filme.genero}
                          </span>
                        )}
                        <button
                          className="btn btn-success mt-auto"
                          onClick={() => handleComprarIngresso(sessao.id!)}
                        >
                          Comprar Ingresso
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default HomePage;
