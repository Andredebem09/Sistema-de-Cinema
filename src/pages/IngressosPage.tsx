import { useEffect, useState } from 'react';
import api from '../services.api';
import { Filme, Ingresso, Sala, Sessao } from '../types';

function IngressosPage() {
  const [ingressos, setIngressos] = useState<Ingresso[]>([]);
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);

  async function carregarDados() {
    const [respIngressos, respSessoes, respFilmes, respSalas] = await Promise.all([
      api.get<Ingresso[]>('/ingressos'),
      api.get<Sessao[]>('/sessoes'),
      api.get<Filme[]>('/filmes'),
      api.get<Sala[]>('/salas')
    ]);
    setIngressos(respIngressos.data);
    setSessoes(respSessoes.data);
    setFilmes(respFilmes.data);
    setSalas(respSalas.data);
  }

  useEffect(() => {
    void carregarDados();
  }, []);

  function obterSessao(ingresso: Ingresso) {
    return sessoes.find(s => s.id === ingresso.sessaoId);
  }

  function obterFilmeDaSessao(sessao?: Sessao) {
    if (!sessao) return undefined;
    return filmes.find(f => f.id === sessao.filmeId);
  }

  function obterSalaDaSessao(sessao?: Sessao) {
    if (!sessao) return undefined;
    return salas.find(s => s.id === sessao.salaId);
  }

  async function handleCancelarCompra(id?: number) {
    if (!id) return;
    if (!window.confirm('Deseja realmente cancelar este ingresso?')) return;
    try {
      await api.delete(`/ingressos/${id}`);
      alert('Ingresso cancelado com sucesso!');
      await carregarDados();
    } catch {
      alert('Falha ao cancelar o ingresso.');
    }
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0 text-primary">
          <i className="bi bi-ticket-perforated me-2" />
          Meus Ingressos
        </h2>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-light fw-semibold">Lista de ingressos</div>
        <div className="card-body p-0">
          {ingressos.length === 0 ? (
            <p className="p-3 mb-0 text-muted">Nenhum ingresso vendido até o momento.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Filme</th>
                    <th>Sala</th>
                    <th>Tipo</th>
                    <th>Valor ingresso</th>
                    <th>Valor combos</th>
                    <th>Total</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {ingressos.map(ingresso => {
                    const sessao = obterSessao(ingresso);
                    const filme = obterFilmeDaSessao(sessao);
                    const sala = obterSalaDaSessao(sessao);

                    return (
                      <tr key={ingresso.id}>
                        <td>{ingresso.id}</td>
                        <td>{filme?.titulo ?? '-'}</td>
                        <td>{sala ? `Sala ${sala.numero}` : '-'}</td>
                        <td>{ingresso.tipo}</td>
                        <td>R$ {ingresso.valorIngresso.toFixed(2)}</td>
                        <td>R$ {ingresso.valorCombos.toFixed(2)}</td>
                        <td>R$ {ingresso.valorTotal.toFixed(2)}</td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => void handleCancelarCompra(ingresso.id)}
                          >
                            <i className="bi bi-x-circle me-2" />
                            Cancelar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default IngressosPage;
