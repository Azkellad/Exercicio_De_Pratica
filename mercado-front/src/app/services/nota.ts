import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ItemNota {
  id: number;
  notaId: number;
  prodId: string;
  quantidade: number;
}

export interface Nota {
  n: number;
  status: 'Aberta' | 'Fechada';
  itens: ItemNota[];
}

@Injectable({providedIn: 'root',})
export class NotaService {
  private apiUrl = 'http://localhost:5145/nota';

  constructor(private http: HttpClient) {}

  getNotas(): Observable<Nota[]> {
    return this.http.get<Nota[]>(this.apiUrl);
  }

  getNotaById(n: number): Observable<Nota> {
    return this.http.get<Nota>(`${this.apiUrl}/${n}`);
  }

  criarNota(): Observable<Nota> {
    return this.http.post<Nota>(this.apiUrl,{});
  }

  adicionarItem(n: number, prodId: string, quantidade: number): Observable<Nota> {
    const par = `prodId=${prodId}&quantidade=${quantidade}`;
    return this.http.post<Nota>(`${this.apiUrl}/${n}/itens?${par}`, {});
  }

  fecharNota(n: number): Observable<Nota> {
    return this.http.put<Nota>(`${this.apiUrl}/${n}/fechar`, {});
  }
}
