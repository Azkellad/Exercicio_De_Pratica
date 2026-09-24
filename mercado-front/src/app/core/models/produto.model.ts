export interface Produto {
  id: string;
  produto: string;
  descricao: string;
  quantidade: number;
}

export type ProdutoPayload = Omit<Produto, 'id'>;
