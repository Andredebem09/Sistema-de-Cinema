import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import api from '../services.api';
import { Filme, Sala, Sessao } from '../types';

type SessaoFormData = {
  filmeId: string;
  salaId: string;
  horarioExibicao: string;
};

const sessaoSchema = z
  .object({
    filmeId: z.coerce.number().int().positive('Selecione um filme'),
    salaId: z.coerce.number().int().positive('Selecione uma sala'),
    horarioExibicao: z.string().min(1, 'Informe a data e horário')
  })
  .refine(
    data => {
      const dataSessao = new Date(data.horarioExibicao);
      const hoje = new Date();
      return dataSessao >= new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    },
    {
      path: ['horarioExibicao'],
      message: 'A data da sessão não pode ser retroativa.'
    }
  );

type SessaoPayload = z.infer<typeof sessaoSchema>;
type SessaoFormErrors = Partial<Record<keyof SessaoFormData, string>>;

const initialFormData: SessaoFormData = {
  filmeId: '',
  salaId: '',
  horarioExibicao: ''
};

function formatarDataHora(valor: string) {
  if (!valor) return '';
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return valor;
  return data.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  });
}

function SessoesPage() {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [formData, setFormData] = useState<SessaoFormData>(initialFormData);
  const [errors, setErrors] = useState<SessaoFormErrors>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  async function carregarDados() {
    const [respSessoes, respFilmes, respSalas] = await Promise.all([
      api.get<Sessao[]>('/sessoes'),
      api.get<Filme[]>('/filmes'),
      api.get<Sala[]>('/salas')
    ]);
    setSessoes(respSessoes.data);
    setFilmes(respFilmes.data);
    setSalas(respSalas.data);
  }

  useEffect(() => {
    void carregarDados();
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function resetForm() {
    setFormData(initialFormData);
    setErrors({});
    setEditingId(null);
  }

  function mapZodErrors(issues: z.ZodIssue[]): SessaoFormErrors {
    const formErrors: SessaoFormErrors = {};
    for (const issue of issues) {
      const field = issue.path[0] as keyof SessaoFormData;
      formErrors[field] = issue.message;
    }
    return formErrors;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});

    const result = sessaoSchema.safeParse(formData);
    if (!result.success) {
      setErrors(mapZodErrors(result.error.issues));
      return;
    }

    const payload: SessaoPayload = result.data;

    if (editingId) {
      await api.put(`/sessoes/${editingId}`, { id: editingId, ...payload });
    } else {
      await api.post('/sessoes', payload);
    }

    await carregarDados();
    resetForm();
  }

  async function handleEdit(sessao: Sessao) {
    setEditingId(sessao.id ?? null);
    setFormData({
      filmeId: String(sessao.filmeId),
      salaId: String(sessao.salaId),
      horarioExibicao: sessao.horarioExibicao.slice(0, 16)
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!window.confirm('Deseja realmente excluir esta sessão?')) return;
    await api.delete(`/sessoes/${id}`);
    await carregarDados();
  }

  function obterNomeFilme(filmeId: number) {
    return filmes.find(f => f.id === filmeId)?.titulo ?? 'Filme não encontrado';
  }

  function obterNumeroSala(salaId: number) {
    return salas.find(s => s.id === salaId)?.numero ?? '-';
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0 text-primary">
          <i className="bi bi-calendar-event me-2" />
          Sessões
        </h2>
      </div>

      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white fw-semibold">
          {editingId ? 'Editar Sessão' : 'Agendar Sessão'}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} noValidate className="row g-3">
            <div className="col-md-4">
              <label className="form-label">
                Filme
                <select
                  name="filmeId"
                  className={`form-select ${errors.filmeId ? 'input-error' : ''}`}
                  value={formData.filmeId}
                  onChange={handleChange}
                >
                  <option value="">Selecione um filme</option>
                  {filmes.map(filme => (
                    <option key={filme.id} value={filme.id}>
                      {filme.titulo}
                    </option>
                  ))}
                </select>
                {errors.filmeId && <small className="text-danger">{errors.filmeId}</small>}
              </label>
            </div>

            <div className="col-md-4">
              <label className="form-label">
                Sala
                <select
                  name="salaId"
                  className={`form-select ${errors.salaId ? 'input-error' : ''}`}
                  value={formData.salaId}
                  onChange={handleChange}
                >
                  <option value="">Selecione uma sala</option>
                  {salas.map(sala => (
                    <option key={sala.id} value={sala.id}>
                      Sala {sala.numero}
                    </option>
                  ))}
                </select>
                {errors.salaId && <small className="text-danger">{errors.salaId}</small>}
              </label>
            </div>

            <div className="col-md-4">
              <label className="form-label">
                Data e horário
                <input
                  type="datetime-local"
                  name="horarioExibicao"
                  className={`form-control ${errors.horarioExibicao ? 'input-error' : ''}`}
                  value={formData.horarioExibicao}
                  onChange={handleChange}
                />
                {errors.horarioExibicao && (
                  <small className="text-danger">{errors.horarioExibicao}</small>
                )}
              </label>
            </div>

            <div className="col-12 d-flex justify-content-end gap-2">
              <button type="submit" className="btn btn-primary">
                <i className="bi bi-save me-2" />
                {editingId ? 'Salvar Alterações' : 'Agendar Sessão'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={resetForm}
                >
                  <i className="bi bi-x-circle me-2" />
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-light fw-semibold">Sessões agendadas</div>
        <div className="card-body p-0">
          {sessoes.length === 0 ? (
            <p className="p-3 mb-0 text-muted">Nenhuma sessão agendada ainda.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Filme</th>
                    <th>Sala</th>
                    <th>Data / Horário</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {sessoes.map(sessao => (
                    <tr key={sessao.id}>
                      <td>{obterNomeFilme(sessao.filmeId)}</td>
                      <td>Sala {obterNumeroSala(sessao.salaId)}</td>
                      <td>{formatarDataHora(sessao.horarioExibicao)}</td>
                      <td className="text-end">
                        <Link
                          to={`/sessoes/${sessao.id}/venda`}
                          className="btn btn-sm btn-primary me-2"
                        >
                          <i className="bi bi-ticket-detailed me-1" />
                          Vender ingresso
                        </Link>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => void handleEdit(sessao)}
                        >
                          <i className="bi bi-pencil-square" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => void handleDelete(sessao.id)}
                        >
                          <i className="bi bi-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default SessoesPage;