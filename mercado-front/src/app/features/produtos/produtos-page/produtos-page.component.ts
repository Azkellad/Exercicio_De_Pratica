import { Component, OnInit, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ProdutoService } from '../../../core/services/produto.service';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ProdutoFormComponent } from '../produto-form/produto-form.component';
import { Produto, ProdutoPayload } from '../../../core/models/produto.model';

@Component({
  selector: 'app-produtos-page',
  standalone: true,
  imports: [EmptyStateComponent, ProdutoFormComponent],
  templateUrl: './produtos-page.component.html',
  styleUrl: './produtos-page.component.scss'
})
export class ProdutosPageComponent implements OnInit {
  private readonly service = inject(ProdutoService);
  private readonly toast = inject(ToastService);

  readonly produtos = this.service.produtos;
  readonly carregando = this.service.carregando;
  readonly erro = this.service.erro;

  readonly formAberto = signal(false);
  readonly editando = signal<Produto | null>(null);
  readonly removendoId = signal<string | null>(null);

  ngOnInit(): void {
    this.service.carregar();
  }

  faixaEstoque(qtd: number): 'ok' | 'baixo' | 'zerado' {
    if (qtd <= 0) return 'zerado';
    if (qtd < 10) return 'baixo';
    return 'ok';
  }

  larguraBarra(qtd: number): string {
    const pct = Math.max(0, Math.min(100, (qtd / 50) * 100));
    return `${pct}%`;
  }

  abrirNovo(): void {
    this.editando.set(null);
    this.formAberto.set(true);
  }

  editar(produto: Produto): void {
    this.editando.set(produto);
    this.formAberto.set(true);
  }

  fecharForm(): void {
    this.formAberto.set(false);
    this.editando.set(null);
  }

  salvar(payload: ProdutoPayload): void {
    const emEdicao = this.editando();
    const acao: Observable<unknown> = emEdicao
      ? this.service.atualizar(emEdicao.id, payload)
      : this.service.criar(payload);

    acao.subscribe({
      next: () => {
        this.toast.sucesso(emEdicao ? 'Produto atualizado.' : 'Produto cadastrado.');
        this.fecharForm();
      },
      error: () => this.toast.erro('Não foi possível salvar o produto.')
    });
  }

  remover(produto: Produto): void {
    if (!confirm(`Remover "${produto.produto}" do cadastro?`)) {
      return;
    }
    this.removendoId.set(produto.id);
    this.service.remover(produto.id).subscribe({
      next: () => {
        this.toast.sucesso('Produto removido.');
        this.removendoId.set(null);
      },
      error: () => {
        this.toast.erro('Não foi possível remover o produto.');
        this.removendoId.set(null);
      }
    });
  }
}
