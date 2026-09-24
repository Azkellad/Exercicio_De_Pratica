import { Injectable, signal } from '@angular/core';

export interface ToastMsg {
  id: number;
  texto: string;
  tipo: 'sucesso' | 'erro';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _mensagens = signal<ToastMsg[]>([]);
  readonly mensagens = this._mensagens.asReadonly();

  private proximoId = 1;

  sucesso(texto: string): void {
    this.emitir(texto, 'sucesso');
  }

  erro(texto: string): void {
    this.emitir(texto, 'erro');
  }

  private emitir(texto: string, tipo: ToastMsg['tipo']): void {
    const id = this.proximoId++;
    this._mensagens.update((lista) => [...lista, { id, texto, tipo }]);
    setTimeout(() => this.dispensar(id), 3600);
  }

  dispensar(id: number): void {
    this._mensagens.update((lista) => lista.filter((m) => m.id !== id));
  }
}
