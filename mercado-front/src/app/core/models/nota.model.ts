export type StatusNota = 'Aberta' | 'Fechada';

export interface Nota {
  n: number;
  status: StatusNota;
  itens: import('./item-nota.model').ItemNota[];
}
