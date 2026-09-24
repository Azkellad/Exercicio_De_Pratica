import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Produto, ProdutoPayload } from '../../../core/models/produto.model';

@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './produto-form.component.html',
  styleUrl: './produto-form.component.scss'
})
export class ProdutoFormComponent implements OnChanges {
  @Input() produto: Produto | null = null;
  @Output() salvar = new EventEmitter<ProdutoPayload>();
  @Output() cancelar = new EventEmitter<void>();

  nome = '';
  descricao = '';
  quantidade = 0;

  get editando(): boolean {
    return this.produto !== null;
  }

  ngOnChanges(): void {
    this.nome = this.produto?.produto ?? '';
    this.descricao = this.produto?.descricao ?? '';
    this.quantidade = this.produto?.quantidade ?? 0;
  }

  get valido(): boolean {
    return this.nome.trim().length > 0 && this.quantidade >= 0;
  }

  onSalvar(): void {
    if (!this.valido) {
      return;
    }
    this.salvar.emit({
      produto: this.nome.trim(),
      descricao: this.descricao.trim(),
      quantidade: this.quantidade
    });
  }
}
