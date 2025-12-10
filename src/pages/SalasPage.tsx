import { useEffect, useState } from 'react';
import { z } from 'zod';
import api from '../services.api';
import { Sala } from '../types';

type SalaFormData = {
  numero: string;
  capacidade: string;
};

const salaSchema = z.object({
  numero: z.coerce.number().int().positive('Número da sala é obrigatório'),
  capacidade: z.coerce.number().int().positive('Capacidade deve ser maior que 0')
});

type SalaPayload = z.infer<typeof salaSchema>;
type SalaFormErrors = Partial<Record<keyof SalaFormData, string>>;

const initialFormData: SalaFormData = {
  numero: '',
  capacidade: ''
};

function SalasPage() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [formData, setFormData] = useState<SalaFormData>(initialFormData);
  const [errors, setErrors] = useState<SalaFormErrors>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  async function carregarSalas() {
    const response = await api.get<Sala[]>('/salas');
    setSalas(response.data);
  }

  useEffect(() => {
    void carregarSalas();
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
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

  function mapZodErrors(issues: z.ZodIssue[]): SalaFormErrors {
    const formErrors: SalaFormErrors = {};
    for (const issue of issues) {
      const field = issue.path[0] as keyof SalaFormData;
      formErrors[field] = issue.message;
    }
    return formErrors;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});

    const result = salaSchema.safeParse(formData);
    if (!result.success) {
      setErrors(mapZodErrors(result.error.issues));
      return;
    }

    const payload: SalaPayload = result.data;

    if (editingId) {
      await api.put(`/salas/${editingId}`, { id: editingId, ...payload });
    } else {
      await api.post('/salas', payload);
    }

    await carregarSalas();
    resetForm();
  }

  async function handleEdit(sala: Sala) {
    setEditingId(sala.id ?? null);
    setFormData({
      numero: String(sala.numero),
      capacidade: String(sala.capacidade)
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!window.confirm('Deseja realmente excluir esta sala?')) return;
    await api.delete(`/salas/${id}`);
    await carregarSalas();
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0 text-primary">
          <i className="bi bi-door-open me-2" />
          Salas
        </h2>
      </div>

      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white fw-semibold">
          {editingId ? 'Editar Sala' : 'Cadastrar Sala'}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} noValidate className="row g-3">
            <div className="col-md-4">
              <label className="form-label">
                Número da Sala
                <input
                  type="number"
                  name="numero"
                  className={`form-control ${errors.numero ? 'input-error' : ''}`}
                  value={formData.numero}
                  onChange={handleChange}
                />
                {errors.numero && <small className="text-danger">{errors.numero}</small>}
              </label>
            </div>

            <div className="col-md-4">
              <label className="form-label">
                Capacidade Máxima
                <input
                  type="number"
                  name="capacidade"
                  className={`form-control ${errors.capacidade ? 'input-error' : ''}`}
                  value={formData.capacidade}
                  onChange={handleChange}
                />
                {errors.capacidade && <small className="text-danger">{errors.capacidade}</small>}
              </label>
            </div>

            <div className="col-md-4 d-flex align-items-end gap-2">
              <button type="submit" className="btn btn-primary flex-grow-1">
                <i className="bi bi-save me-2" />
                {editingId ? 'Salvar Alterações' : 'Cadastrar Sala'}
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
        <div className="card-header bg-light fw-semibold">Salas cadastradas</div>
        <div className="card-body p-0">
          {salas.length === 0 ? (
            <p className="p-3 mb-0 text-muted">Nenhuma sala cadastrada ainda.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Número</th>
                    <th>Capacidade</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {salas.map(sala => (
                    <tr key={sala.id}>
                      <td>{sala.numero}</td>
                      <td>{sala.capacidade} lugares</td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => void handleEdit(sala)}
                        >
                          <i className="bi bi-pencil-square" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => void handleDelete(sala.id)}
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

export default SalasPage;