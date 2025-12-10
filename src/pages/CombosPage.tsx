import { useEffect, useState } from 'react';
import api from '../services.api';
import { Combo } from '../types';

function CombosPage() {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [editingCombo, setEditingCombo] = useState<Combo | null>(null);
  const [formData, setFormData] = useState<Combo & { qtUnidade?: number }>({
    descricao: '',
    tamanho: '',
    valorUnitario: '' as any,
    qtUnidade: '' as any
  });

  async function carregarDados() {
    const resp = await api.get<Combo[]>('/combos');
    setCombos(resp.data);
  }

  useEffect(() => {
    void carregarDados();
  }, []);

  function handleEditar(combo: Combo) {
    setEditingCombo(combo);
    setFormData({ ...combo, qtUnidade: combo.qtUnidade ?? 1 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelar() {
    setEditingCombo(null);
    setFormData({ descricao: '', tamanho: '', valorUnitario: '' as any, qtUnidade: '' as any });
  }

  async function handleSalvar(event: React.FormEvent) {
    event.preventDefault();
    const payload = { ...formData };

    if (editingCombo?.id) {
      await api.put(`/combos/${editingCombo.id}`, payload);
    } else {
      await api.post('/combos', payload);
    }

    handleCancelar();
    await carregarDados();
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!window.confirm('Deseja realmente excluir este combo?')) return;
    await api.delete(`/combos/${id}`);
    await carregarDados();
  }

  function subtotal(combo: Combo & { qtUnidade?: number }) {
    return (combo.qtUnidade ?? 1) * combo.valorUnitario;
  }

  const mostrarTamanho = formData.descricao.toLowerCase().includes('pipoca');

  return (
    <>
      <style>{`
        /* Remove as setas (spinners) dos inputs do tipo number */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>

      <section>
        <h2 className="text-primary mb-3">Gerenciar Combos</h2>

        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-primary text-white fw-semibold">
            {editingCombo ? `Editar Combo #${editingCombo.id}` : 'Novo Combo'}
          </div>
          <div className="card-body">
            <form onSubmit={handleSalvar} className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Descrição</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ex: Pipoca, Refrigerante"
                  value={formData.descricao}
                  onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                  required
                />
              </div>

              {mostrarTamanho && (
                <div className="col-md-2">
                  <label className="form-label">Tamanho</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex: P, M, G"
                    value={formData.tamanho}
                    onChange={e => setFormData({ ...formData, tamanho: e.target.value })}
                    required={mostrarTamanho}
                  />
                </div>
              )}

              <div className="col-md-2">
                <label className="form-label">Valor Unitário (R$)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="0.00"
                  value={formData.valorUnitario}
                  onChange={e =>
                    setFormData({ ...formData, valorUnitario: e.target.value === '' ? '' as any : Number(e.target.value) })
                  }
                  min={0}
                  step={0.01}
                  required
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">Qtd. Unidade</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="1"
                  value={formData.qtUnidade ?? ''}
                  onChange={e =>
                    setFormData({ ...formData, qtUnidade: e.target.value === '' ? '' as any : Number(e.target.value) })
                  }
                  min={1}
                />
              </div>

              <div className="col-md-2 d-flex align-items-end gap-2">
                <button type="submit" className="btn btn-primary">
                  {editingCombo ? 'Salvar' : 'Adicionar'}
                </button>
                {editingCombo && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCancelar}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-header bg-light fw-semibold">Lista de Combos</div>
          <div className="card-body p-0">
            {combos.length === 0 ? (
              <p className="p-3 text-muted mb-0">Nenhum combo cadastrado.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Descrição</th>
                      <th>Tamanho</th>
                      <th>Valor Unitário</th>
                      <th>Qtd. Unidade</th>
                      <th>Subtotal</th>
                      <th className="text-end">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {combos.map(combo => (
                      <tr key={combo.id}>
                        <td>{combo.id}</td>
                        <td>{combo.descricao}</td>
                        <td>{combo.tamanho ?? '-'}</td>
                        <td>R$ {combo.valorUnitario.toFixed(2)}</td>
                        <td>{combo.qtUnidade ?? 1}</td>
                        <td>R$ {subtotal({ ...combo, qtUnidade: combo.qtUnidade })?.toFixed(2)}</td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEditar(combo)}
                          >
                            <i className="bi bi-pencil-square" />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => void handleDelete(combo.id)}
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
    </>
  );
}

export default CombosPage;