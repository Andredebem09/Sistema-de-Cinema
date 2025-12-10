export interface Filme {
  id?: number;
  titulo: string;
  sinopse: string;
  classificacao: string;
  duracao: number;
  genero: string;
  dataInicioExibicao: string;
  dataFimExibicao: string;
  urlPoster?: string; // <- NOVO
}

export interface Sala {
  id?: number;
  numero: number;
  capacidade: number;
}

export interface Sessao {
  id?: number;
  horarioExibicao: string;
  filmeId: number;
  salaId: number;
}

export type TipoIngresso = 'INTEIRA' | 'MEIA';

export interface Combo {
  id?: number;
  descricao: string;
  tamanho: string;
  valorUnitario: number;
}

export interface Ingresso {
  id?: number;
  tipo: TipoIngresso;
  valorIngresso: number;
  valorCombos: number;
  valorTotal: number;
  sessaoId: number;
  combosSelecionadosIds: number[];
}

export interface Combo {
  id?: number;
  descricao: string;
  tamanho: string;
  valorUnitario: number;
  qtUnidade?: number; // opcional, usado para calcular subtotal
}
