import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import api from '../services.api';
import { Combo, Sessao, TipoIngresso } from '../types';

type VendaFormData = {
  tipo: TipoIngresso;
  quantidade: number;
  combosSelecionadosIds: number[];
  formaPagamento?: 'CARTAO' | 'PIX' | 'DINHEIRO';
};

const vendaSchema = z.object({
  tipo: z.enum(['INTEIRA', 'MEIA']),
  quantidade: z.number().min(1),
  combosSelecionadosIds: z.array(z.number()).optional(),
  formaPagamento: z.enum(['CARTAO', 'PIX', 'DINHEIRO'])
});

const VALOR_INTEIRA = 30;
const VALOR_MEIA = 15;

function VendaIngressoPage() {
  const { sessaoId } = useParams();
  const navigate = useNavigate();

  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [filmeNome, setFilmeNome] = useState<string>('');
  const [salaNumero, setSalaNumero] = useState<string>('');
  const [combos, setCombos] = useState<Combo[]>([]);
  const [formData, setFormData] = useState<VendaFormData>({
    tipo: 'INTEIRA',
    quantidade: 1,
    combosSelecionadosIds: [],
    formaPagamento: 'CARTAO'
  });
  const [saving, setSaving] = useState(false);
  const [ingressoId, setIngressoId] = useState<number | null>(null);
  const [cancelado, setCancelado] = useState(false);

  const idSessaoNumber = Number(sessaoId);

  const valorUnitarioIngresso = useMemo(
    () => (formData.tipo === 'INTEIRA' ? VALOR_INTEIRA : VALOR_MEIA),
    [formData.tipo]
  );

  const valorTotalIngressos = valorUnitarioIngresso * formData.quantidade;

  const valorCombos = useMemo(
    () =>
      combos
        .filter(combo => formData.combosSelecionadosIds.includes(combo.id ?? -1))
        .reduce((acc, combo) => {
          const qtd = combo.qtUnidade ?? 1;
          return acc + combo.valorUnitario * qtd;
        }, 0),
    [combos, formData.combosSelecionadosIds]
  );

  const valorTotal = valorTotalIngressos + valorCombos;

  useEffect(() => {
    async function carregarDados() {
      if (!sessaoId) return;

      const [respSessao, respCombos] = await Promise.all([
        api.get<Sessao>(`/sessoes/${sessaoId}`),
        api.get<Combo[]>('/combos')
      ]);
      setSessao(respSessao.data);
      setCombos(respCombos.data);

      const respFilme = await api.get(`/filmes/${respSessao.data.filmeId}`);
      setFilmeNome(respFilme.data.titulo);

      const respSala = await api.get(`/salas/${respSessao.data.salaId}`);
      setSalaNumero(respSala.data.numero);
    }

    void carregarDados();
  }, [sessaoId]);

  function handleChangeTipo(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value as TipoIngresso;
    setFormData(prev => ({ ...prev, tipo: value }));
  }

  function handleChangeQuantidade(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value === '' ? 1 : Number(event.target.value);
    setFormData(prev => ({ ...prev, quantidade: value }));
  }

  function handleToggleCombo(id: number) {
    setFormData(prev => {
      const existe = prev.combosSelecionadosIds.includes(id);
      return {
        ...prev,
        combosSelecionadosIds: existe
          ? prev.combosSelecionadosIds.filter(c => c !== id)
          : [...prev.combosSelecionadosIds, id]
      };
    });
  }

  function handleChangePagamento(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value as VendaFormData['formaPagamento'];
    setFormData(prev => ({ ...prev, formaPagamento: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!idSessaoNumber) return;

    const result = vendaSchema.safeParse(formData);
    if (!result.success) {
      alert('Preencha corretamente os dados da venda.');
      return;
    }

    const payload = {
      tipo: formData.tipo,
      quantidade: formData.quantidade,
      valorIngresso: valorTotalIngressos,
      valorCombos,
      valorTotal,
      sessaoId: idSessaoNumber,
      combosSelecionadosIds: formData.combosSelecionadosIds,
      formaPagamento: formData.formaPagamento
    };

    setSaving(true);
    try {
      const resp = await api.post('/ingressos', payload);
      alert('Ingresso vendido com sucesso!');
      setIngressoId(resp.data.id);
      setCancelado(false);
      navigate('/ingressos');
    } finally {
      setSaving(false);
    }
  }

  async function handleCancelarIngresso() {
    if (!ingressoId) return;
    if (!window.confirm('Tem certeza que deseja cancelar este ingresso?')) return;

    try {
      await api.delete(`/ingressos/${ingressoId}`);
      alert('Ingresso cancelado com sucesso!');
      setCancelado(true);
    } catch {
      alert('Falha ao cancelar o ingresso.');
    }
  }

  if (!sessao) {
    return (
      <section>
        <h2 className="text-primary mb-3">Venda de Ingresso</h2>
        <p>Carregando dados da sessão...</p>
      </section>
    );
  }

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
        <h2 className="text-primary mb-3">
          <i className="bi bi-ticket-detailed me-2" />
          Venda de Ingresso
        </h2>

        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-light fw-semibold">Resumo da sessão</div>
          <div className="card-body">
            <p className="mb-1">
              <strong>ID da sessão: </strong>
              {sessao.id}
            </p>
            <p className="mb-1">
              <strong>Filme:</strong> {filmeNome}
            </p>
            <p className="mb-1">
              <strong>Sala:</strong> {salaNumero}
            </p>
            <p className="mb-0">
              <strong>Horário:</strong> {new Date(sessao.horarioExibicao).toLocaleString('pt-BR', {
                dateStyle: 'short',
                timeStyle: 'short'
              })}
            </p>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white fw-semibold">Dados da venda</div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-3">
                <label className="form-label">
                  Tipo de ingresso
                  <select
                    className="form-select"
                    value={formData.tipo}
                    onChange={handleChangeTipo}
                    disabled={cancelado}
                  >
                    <option value="INTEIRA">Inteira</option>
                    <option value="MEIA">Meia</option>
                  </select>
                </label>
              </div>

              <div className="col-md-2">
                <label className="form-label">Quantidade</label>
                <div className="input-group">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setFormData(prev => ({ ...prev, quantidade: Math.max(1, prev.quantidade - 1) }))}
                    disabled={cancelado || formData.quantidade <= 1}
                  >
                    <i className="bi bi-dash" />
                  </button>
                  <input
                    type="number"
                    className="form-control text-center"
                    value={formData.quantidade}
                    onChange={handleChangeQuantidade}
                    min={1}
                    disabled={cancelado}
                    style={{ MozAppearance: 'textfield' }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setFormData(prev => ({ ...prev, quantidade: prev.quantidade + 1 }))}
                    disabled={cancelado}
                  >
                    <i className="bi bi-plus" />
                  </button>
                </div>
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Forma de pagamento
                  <select
                    className="form-select"
                    value={formData.formaPagamento}
                    onChange={handleChangePagamento}
                    disabled={cancelado}
                  >
                    <option value="CARTAO">Cartão</option>
                    <option value="PIX">Pix</option>
                    <option value="DINHEIRO">Dinheiro</option>
                  </select>
                </label>
              </div>

              <div className="col-md-8">
                <p className="fw-semibold mb-2">Combos de pipoca (opcionais)</p>
                <div className="row g-2">
                  {combos.map(combo => (
                    <div className="col-md-4" key={combo.id}>
                      <div className="form-check border rounded p-2 h-100">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`combo-${combo.id}`}
                          checked={formData.combosSelecionadosIds.includes(combo.id ?? -1)}
                          onChange={() => handleToggleCombo(combo.id ?? -1)}
                          disabled={cancelado}
                        />
                        <label className="form-check-label d-block" htmlFor={`combo-${combo.id}`}>
                          <span className="fw-semibold d-block">{combo.descricao}</span>
                          <small className="text-muted">
                            {combo.tamanho && `Tamanho ${combo.tamanho} — `}
                            {combo.qtUnidade && combo.qtUnidade > 1 && `${combo.qtUnidade}x `}
                            R$ {combo.valorUnitario.toFixed(2)}
                            {combo.qtUnidade && combo.qtUnidade > 1 && 
                              ` (Total: R$ ${(combo.valorUnitario * combo.qtUnidade).toFixed(2)})`
                            }
                          </small>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-md-4">
                <div className="border rounded p-3 bg-light">
                  <p className="mb-1">
                    <strong>Ingresso:</strong> {formData.quantidade}x R$ {valorUnitarioIngresso.toFixed(2)} = R$ {valorTotalIngressos.toFixed(2)}
                  </p>
                  <p className="mb-1">
                    <strong>Combos:</strong> R$ {valorCombos.toFixed(2)}
                  </p>
                  <p className="mb-0 fs-5 fw-bold text-primary">
                    Total: R$ {valorTotal.toFixed(2)}
                  </p>
                  {cancelado && <p className="text-danger fw-semibold mt-2">Ingresso cancelado</p>}
                </div>
              </div>

              <div className="col-md-8 d-flex align-items-end justify-content-end">
                {!cancelado && (
                  <>
                    <button type="submit" className="btn btn-primary px-4 me-2" disabled={saving}>
                      <i className="bi bi-cart-check me-2" />
                      {saving ? 'Salvando...' : 'Confirmar compra'}
                    </button>
                    {ingressoId && (
                      <button
                        type="button"
                        className="btn btn-danger px-4"
                        onClick={handleCancelarIngresso}
                      >
                        <i className="bi bi-x-circle me-2" />
                        Cancelar ingresso
                      </button>
                    )}
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default VendaIngressoPage;