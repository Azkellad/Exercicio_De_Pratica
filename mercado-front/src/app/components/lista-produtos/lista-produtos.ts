import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoService, Produto } from '../../services/produto';

@Component({
  selector: 'app-lista-produtos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-produtos.html',
  styleUrls: ['./lista-produtos.css']
})
export class ListaProdutosComponent implements OnInit {
  produtos: Produto[] = [];

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.produtoService.listar().subscribe(dados => this.produtos = dados);
  }
}
