export interface ItemNota {
  id: number;
  notaId: number;
  prodId: string;
  quantidade: number;
}

export interface ItemNotaPayload {
  prodId: string;
  quantidade: number;
}
