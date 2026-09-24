import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Produto {
  id: number;
  produto: string;
  descricao: string;
  quantidade: number;
}

@Injectable({providedIn: 'root',})
export class ProdutoService {
  private apiUrl = 'https://localhost:5145/produtos';
  
  constructor(private http: HttpClient) {}

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }

  criar(produto: { produto: string; quantidade: number; descricao: string }): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto);
  }

  // Tipo do id corrigido para number
  atualizarEstoque(id: number, quantidade: number, operacao: 'adicionar' | 'baixar'): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}/estoque?quantidade=${quantidade}&operacao=${operacao}`, {});
  }
}
