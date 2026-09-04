import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NotaService, Nota } from '../../services/nota';

@Component({
  selector: 'app-form-nota',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-nota.component.html'
})
export class FormNotaComponent {
  private fb = inject(FormBuilder);
  private notaService = inject(NotaService);

  notaAtual: Nota | null = null;
  mensagem = '';
  erro = '';

  itemForm = this.fb.group({
    prodId: ['', Validators.required],
    quantidade: [1, [Validators.required, Validators.min(1)]]
  });

  criarNota(): void {
    this.notaService.criarNota().subscribe({
      next: (nota) => { this.notaAtual = nota; this.mensagem = `Nota ${nota.n} criada.`; this.erro = ''; },
      error: (err) => { this.erro = err.error ?? 'Erro ao criar nota.'; }
    });
  }

  adicionarItem(): void {
    if (this.itemForm.invalid || !this.notaAtual) return;
    const { prodId, quantidade } = this.itemForm.value;
    this.notaService.adicionarItem(this.notaAtual.n, prodId!, quantidade!).subscribe({
      next: (notaAtualizada) => { this.notaAtual = notaAtualizada; this.mensagem = 'Item adicionado à nota.'; this.erro = ''; this.itemForm.reset({ quantidade: 1 }); },
      error: (err) => { this.erro = err.error ?? 'Erro ao adicionar item (verifique o estoque).'; this.mensagem = ''; }
    });
  }

  fecharNota(): void {
    if (!this.notaAtual) return;
    this.notaService.fecharNota(this.notaAtual.n).subscribe({
      next: (notaFechada) => { this.notaAtual = notaFechada; this.mensagem = `Nota ${notaFechada.n} fechada.`; this.erro = ''; },
      error: (err) => { this.erro = err.error ?? 'Erro ao fechar nota.'; }
    });
  }
}