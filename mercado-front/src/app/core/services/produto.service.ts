import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Produto, ProdutoPayload } from '../models/produto.model';

/**
 * Assume rotas REST convencionais em cima de MapProdutoRoutes():
 *   GET    /produtos
 *   POST   /produtos
 *   PUT    /produtos/{id}
 *   DELETE /produtos/{id}
 * Ajuste os caminhos abaixo se as rotas reais do seu Program.cs forem diferentes.
 */
@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/produtos`;

  private readonly _produtos = signal<Produto[]>([]);
  private readonly _carregando = signal(false);
  private readonly _erro = signal<string | null>(null);

  readonly produtos = this._produtos.asReadonly();
  readonly carregando = this._carregando.asReadonly();
  readonly erro = this._erro.asReadonly();

  readonly total = computed(() => this._produtos().length);
  readonly semEstoque = computed(() => this._produtos().filter((p) => p.quantidade <= 0).length);

  carregar(): void {
    this._carregando.set(true);
    this._erro.set(null);
    this.http.get<Produto[]>(this.baseUrl).subscribe({
      next: (produtos) => {
        this._produtos.set(produtos);
        this._carregando.set(false);
      },
      error: () => {
        this._erro.set('Não foi possível carregar os produtos. Verifique se a API está rodando.');
        this._carregando.set(false);
      }
    });
  }

  criar(payload: ProdutoPayload): Observable<Produto> {
    return this.http
      .post<Produto>(this.baseUrl, payload)
      .pipe(tap((novo) => this._produtos.update((lista) => [...lista, novo])));
  }

  atualizar(id: string, payload: ProdutoPayload): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload).pipe(
      tap(() =>
        this._produtos.update((lista) =>
          lista.map((p) => (p.id === id ? { ...p, ...payload } : p))
        )
      )
    );
  }

  remover(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}`)
      .pipe(tap(() => this._produtos.update((lista) => lista.filter((p) => p.id !== id))));
  }
}
