import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProdutoService } from '../../services/produto';

@Component({
  selector: 'app-form-produto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-produto.component.html'
})
export class FormProdutoComponent {
  private fb = inject(FormBuilder);
  private produtoService = inject(ProdutoService);

  mensagem = '';
  erro = '';

  cadastroForm = this.fb.group({
    produto: ['', [Validators.required, Validators.maxLength(50)]],
    descricao: ['', Validators.maxLength(100)],
    quantidade: [0, [Validators.required, Validators.min(0)]]
  });

  estoqueForm = this.fb.group({
    id: ['', Validators.required],
    quantidade: [1, [Validators.required, Validators.min(1)]],
    operacao: ['adicionar', Validators.required]
  });

  cadastrar(): void {
    if (this.cadastroForm.invalid) return;
    const { produto, descricao, quantidade } = this.cadastroForm.value;
    this.produtoService.criar({ produto: produto!, descricao: descricao ?? '', quantidade: quantidade! })
      .subscribe({
        next: (novoProduto) => {
          this.mensagem = `Produto "${novoProduto.produto}" cadastrado com sucesso. Id: ${novoProduto.id}`;
          this.erro = '';
          this.cadastroForm.reset({ quantidade: 0 });
        },
        error: (err) => { this.erro = err.error ?? 'Erro ao cadastrar produto.'; this.mensagem = ''; }
      });
  }

  movimentarEstoque(): void {
    if (this.estoqueForm.invalid) return;
    const { id, quantidade, operacao } = this.estoqueForm.value;
    this.produtoService.atualizarEstoque(id!, quantidade!, operacao as 'adicionar' | 'baixar')
      .subscribe({
        next: (produtoAtualizado) => { this.mensagem = `Estoque atualizado. Saldo atual: ${produtoAtualizado.quantidade}`; this.erro = ''; },
        error: (err) => { this.erro = err.error ?? 'Erro ao atualizar estoque.'; this.mensagem = ''; }
      });
  }
}