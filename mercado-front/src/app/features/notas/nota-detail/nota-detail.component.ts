import { Component, Input } from '@angular/core';
import { Nota } from '../../../core/models/nota.model';
import { Produto } from '../../../core/models/produto.model';

@Component({
  selector: 'app-nota-detail',
  standalone: true,
  imports: [],
  templateUrl: './nota-detail.component.html',
  styleUrl: './nota-detail.component.scss'
})
export class NotaDetailComponent {
  @Input({ required: true }) nota!: Nota;
  @Input() produtos: Produto[] = [];

  nomeProduto(prodId: string): string {
    return this.produtos.find((produto) => produto.id === prodId)?.produto ?? 'Produto removido';
  }
}
