import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Nota } from '../models/nota.model';
import { ItemNota, ItemNotaPayload } from '../models/item-nota.model';

/**
 * Assume rotas REST convencionais em cima de MapNotaRoutes():
 *   GET   /notas                      -> lista notas com itens
 *   POST  /notas                      -> abre uma nota nova
 *   PUT   /notas/{n}/fechar           -> fecha a nota
 *   POST  /notas/{n}/itens            -> adiciona item à nota
 *   DELETE /notas/{n}/itens/{itemId}  -> remove item da nota
 * Ajuste os caminhos abaixo se as rotas reais do seu Program.cs forem diferentes.
 */
@Injectable({ providedIn: 'root' })
export class NotaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/nota`;

  private readonly _notas = signal<Nota[]>([]);
  private readonly _carregando = signal(false);
  private readonly _erro = signal<string | null>(null);

  readonly notas = this._notas.asReadonly();
  readonly carregando = this._carregando.asReadonly();
  readonly erro = this._erro.asReadonly();

  readonly abertas = computed(() => this._notas().filter((n) => n.status === 'Aberta').length);

  carregar(): void {
    this._carregando.set(true);
    this._erro.set(null);
    this.http.get<Nota[]>(this.baseUrl).subscribe({
      next: (notas) => {
        this._notas.set(notas);
        this._carregando.set(false);
      },
      error: () => {
        this._erro.set('Não foi possível carregar as notas. Verifique se a API está rodando.');
        this._carregando.set(false);
      }
    });
  }

  abrirNota(): Observable<Nota> {
    return this.http
      .post<Nota>(this.baseUrl, {})
      .pipe(tap((nova) => this._notas.update((lista) => [{ ...nova, itens: nova.itens ?? [] }, ...lista])));
  }

  fecharNota(n: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${n}/fechar`, {}).pipe(
      tap(() =>
        this._notas.update((lista) =>
          lista.map((nota) => (nota.n === n ? { ...nota, status: 'Fechada' } : nota))
        )
      )
    );
  }

  finalizarCompra(itens: ItemNotaPayload[]): Observable<Nota> {
    return this.http.post<Nota>(`${this.baseUrl}/comprar`, { itens }).pipe(
      tap((nota) =>
        this._notas.update((lista) => {
          const atualizada = { ...nota, itens: nota.itens ?? [] };
          const existe = lista.some((item) => item.n === nota.n);
          return existe
            ? lista.map((item) => (item.n === nota.n ? atualizada : item))
            : [atualizada, ...lista];
        })
      )
    );
  }

  adicionarItem(n: number, payload: ItemNotaPayload): Observable<Nota> {
    return this.http.post<Nota>(`${this.baseUrl}/${n}/itens`, payload).pipe(
      tap((notaAtualizada) =>
        this._notas.update((lista) =>
          lista.map((nota) => (nota.n === n ? notaAtualizada : nota))
        )
      )
    );
  }

  removerItem(n: number, itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${n}/itens/${itemId}`).pipe(
      tap(() =>
        this._notas.update((lista) =>
          lista.map((nota) =>
            nota.n === n ? { ...nota, itens: nota.itens.filter((i) => i.id !== itemId) } : nota
          )
        )
      )
    );
  }
}
