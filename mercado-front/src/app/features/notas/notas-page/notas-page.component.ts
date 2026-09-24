import { Component, OnInit, inject, signal } from '@angular/core';
import { NotaService } from '../../../core/services/nota.service';
import { ProdutoService } from '../../../core/services/produto.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { NotaDetailComponent } from '../nota-detail/nota-detail.component';

@Component({
  selector: 'app-notas-page',
  standalone: true,
  imports: [EmptyStateComponent, NotaDetailComponent],
  templateUrl: './notas-page.component.html',
  styleUrl: './notas-page.component.scss'
})
export class NotasPageComponent implements OnInit {
  private readonly service = inject(NotaService);
  private readonly produtoService = inject(ProdutoService);

  readonly notas = this.service.notas;
  readonly carregando = this.service.carregando;
  readonly erro = this.service.erro;
  readonly produtos = this.produtoService.produtos;

  readonly expandidaN = signal<number | null>(null);

  ngOnInit(): void {
    this.service.carregar();
    this.produtoService.carregar();
  }

  toggle(n: number): void {
    this.expandidaN.update((atual) => (atual === n ? null : n));
  }

}
