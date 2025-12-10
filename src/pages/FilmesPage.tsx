import { useEffect, useState } from 'react';
import { z } from 'zod';
import api from '../services.api';
import { Filme } from '../types';

type FilmeFormData = {
  titulo: string;
  sinopse: string;
  classificacao: string;
  duracao: string;
  genero: string;
  dataInicioExibicao: string;
  dataFimExibicao: string;
  urlPoster: string;
};

const filmeSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  sinopse: z.string().min(10, 'Sinopse deve ter no mínimo 10 caracteres'),
  classificacao: z.string().min(1, 'Classificação é obrigatória'),
  duracao: z.coerce.number().positive('Duração deve ser maior que 0'),
  genero: z.string().min(1, 'Gênero é obrigatório'),
  dataInicioExibicao: z.string().min(1, 'Data de início é obrigatória'),
  dataFimExibicao: z.string().min(1, 'Data de fim é obrigatória'),
  urlPoster: z.string().url('Informe uma URL válida do pôster')
});

type FilmePayload = z.infer<typeof filmeSchema>;
type FilmeFormErrors = Partial<Record<keyof FilmeFormData, string>>;

const initialFormData: FilmeFormData = {
  titulo: '',
  sinopse: '',
  classificacao: '',
  duracao: '',
  genero: '',
  dataInicioExibicao: '',
  dataFimExibicao: '',
  urlPoster: ''
};

function FilmesPage() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [formData, setFormData] = useState<FilmeFormData>(initialFormData);
  const [errors, setErrors] = useState<FilmeFormErrors>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  async function carregarFilmes() {
    const response = await api.get<Filme[]>('/filmes');
    setFilmes(response.data);
  }

  useEffect(() => {
    void carregarFilmes();
  }, []);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function mapZodErrors(issues: z.ZodIssue[]): FilmeFormErrors {
    const formErrors: FilmeFormErrors = {};
    for (const issue of issues) {
      const field = issue.path[0] as keyof FilmeFormData;
      formErrors[field] = issue.message;
    }
    return formErrors;
  }

  function resetForm() {
    setFormData(initialFormData);
    setErrors({});
    setEditingId(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});

    const result = filmeSchema.safeParse(formData);
    if (!result.success) {
      setErrors(mapZodErrors(result.error.issues));
      return;
    }

    const payload: FilmePayload = result.data;

    if (editingId) {
      await api.put(`/filmes/${editingId}`, { id: editingId, ...payload });
    } else {
      await api.post('/filmes', payload);
    }

    await carregarFilmes();
    resetForm();
  }

  function handleEdit(filme: Filme) {
    setEditingId(filme.id ?? null);
    setFormData({
      titulo: filme.titulo,
      sinopse: filme.sinopse,
      classificacao: filme.classificacao,
      duracao: String(filme.duracao),
      genero: filme.genero,
      dataInicioExibicao: filme.dataInicioExibicao,
      dataFimExibicao: filme.dataFimExibicao,
      urlPoster: filme.urlPoster ?? ''
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!window.confirm('Deseja realmente excluir este filme?')) return;
    await api.delete(`/filmes/${id}`);
    await carregarFilmes();
  }

  return (
    <section>
      <h2 className="mb-3 text-primary">
        <i className="bi bi-collection-play me-2" />
        Filmes
      </h2>

      {/* FORMULÁRIO */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white fw-semibold">
          {editingId ? 'Editar Filme' : 'Cadastrar Filme'}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} noValidate className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Título</label>
              <input
                name="titulo"
                className={`form-control ${errors.titulo ? 'input-error' : ''}`}
                value={formData.titulo}
                onChange={handleChange}
              />
              {errors.titulo && <small className="text-danger">{errors.titulo}</small>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Classificação</label>
              <input
                name="classificacao"
                className={`form-control ${errors.classificacao ? 'input-error' : ''}`}
                value={formData.classificacao}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-12">
              <label className="form-label">Sinopse</label>
              <textarea
                name="sinopse"
                rows={3}
                className={`form-control ${errors.sinopse ? 'input-error' : ''}`}
                value={formData.sinopse}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Duração (min)</label>
              <input
                type="number"
                name="duracao"
                className={`form-control ${errors.duracao ? 'input-error' : ''}`}
                value={formData.duracao}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Gênero</label>
              <input
                name="genero"
                className={`form-control ${errors.genero ? 'input-error' : ''}`}
                value={formData.genero}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">URL do pôster</label>
              <input
                name="urlPoster"
                className={`form-control ${errors.urlPoster ? 'input-error' : ''}`}
                value={formData.urlPoster}
                onChange={handleChange}
                placeholder="https://exemplo.com/poster.jpg"
              />
              {errors.urlPoster && (
                <small className="text-danger">{errors.urlPoster}</small>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Início exibição</label>
              <input
                type="date"
                name="dataInicioExibicao"
                className="form-control"
                value={formData.dataInicioExibicao}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Fim exibição</label>
              <input
                type="date"
                name="dataFimExibicao"
                className="form-control"
                value={formData.dataFimExibicao}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 text-end">
              <button type="submit" className="btn btn-primary me-2">
                <i className="bi bi-save me-2" />
                {editingId ? 'Salvar Alterações' : 'Cadastrar Filme'}
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

      {/* LISTA */}
      <div className="card shadow-sm">
        <div className="card-header fw-semibold">Filmes cadastrados</div>
        <div className="card-body p-0">
          {filmes.length === 0 ? (
            <p className="p-3 mb-0 text-muted">Nenhum filme cadastrado.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Pôster</th>
                    <th>Título</th>
                    <th>Gênero</th>
                    <th>Duração</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filmes.map(filme => (
                    <tr key={filme.id}>
                      <td>
                        <img
                          src={
                            filme.urlPoster ||
                            'https://via.placeholder.com/60x90?text=Sem+Imagem'
                          }
                          alt={filme.titulo}
                          style={{ width: 60, height: 90, objectFit: 'cover' }}
                        />
                      </td>
                      <td>{filme.titulo}</td>
                      <td>{filme.genero}</td>
                      <td>{filme.duracao} min</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEdit(filme)}
                        >
                          <i className="bi bi-pencil-square" />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(filme.id)}
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

export default FilmesPage;