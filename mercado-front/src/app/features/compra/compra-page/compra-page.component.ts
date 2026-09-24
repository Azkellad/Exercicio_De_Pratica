import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ItemNotaPayload } from '../../../core/models/item-nota.model';
import { Produto } from '../../../core/models/produto.model';
import { NotaService } from '../../../core/services/nota.service';
import { ProdutoService } from '../../../core/services/produto.service';
import { ToastService } from '../../../shared/components/toast/toast.service';

interface ItemCompra extends ItemNotaPayload {
  produto: Produto;
}

@Component({
  selector: 'app-compra-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './compra-page.component.html',
  styleUrl: './compra-page.component.scss'
})
export class CompraPageComponent implements OnInit {
  private readonly produtoService = inject(ProdutoService);
  private readonly notaService = inject(NotaService);
  private readonly toast = inject(ToastService);

  readonly produtos = this.produtoService.produtos;
  readonly carregando = this.produtoService.carregando;
  readonly carrinho = signal<ItemCompra[]>([]);
  readonly produtoSelecionado = signal('');
  readonly quantidade = signal(1);
  readonly finalizando = signal(false);

  ngOnInit(): void {
    this.produtoService.carregar();
  }

  produtoAtual(): Produto | undefined {
    return this.produtos().find((produto) => produto.id === this.produtoSelecionado());
  }

  quantidadeNoCarrinho(produtoId: string): number {
    return this.carrinho()
      .filter((item) => item.prodId === produtoId)
      .reduce((total, item) => total + item.quantidade, 0);
  }

  adicionar(): void {
    const produto = this.produtoAtual();
    const quantidade = this.quantidade();

    if (!produto || !Number.isInteger(quantidade) || quantidade <= 0) {
      return;
    }

    const total = this.quantidadeNoCarrinho(produto.id) + quantidade;
    if (total > produto.quantidade) {
      this.toast.erro('A quantidade desejada é maior que o estoque disponível.');
      return;
    }

    this.carrinho.update((itens) => {
      const existente = itens.find((item) => item.prodId === produto.id);
      if (existente) {
        return itens.map((item) =>
          item.prodId === produto.id ? { ...item, quantidade: item.quantidade + quantidade } : item
        );
      }
      return [...itens, { prodId: produto.id, quantidade, produto }];
    });
    this.quantidade.set(1);
  }

  remover(produtoId: string): void {
    this.carrinho.update((itens) => itens.filter((item) => item.prodId !== produtoId));
  }

  totalItens(): number {
    return this.carrinho().reduce((total, item) => total + item.quantidade, 0);
  }

  finalizar(): void {
    if (this.carrinho().length === 0 || this.finalizando()) {
      return;
    }

    if (!confirm('Confirmar pagamento e finalizar esta compra?')) {
      return;
    }

    this.finalizando.set(true);
    const itens = this.carrinho().map(({ prodId, quantidade }) => ({ prodId, quantidade }));
    this.notaService.finalizarCompra(itens).subscribe({
      next: (nota) => {
        this.carrinho.set([]);
        this.produtoService.carregar();
        this.finalizando.set(false);
        this.toast.sucesso(`Compra paga. Nota Nº ${nota.n} gerada.`);
      },
      error: () => {
        this.finalizando.set(false);
        this.toast.erro('Não foi possível finalizar a compra. Verifique o estoque disponível.');
      }
    });
  }
}