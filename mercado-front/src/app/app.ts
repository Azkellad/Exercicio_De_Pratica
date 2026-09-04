import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormProdutoComponent } from './components/form-produto/form-produto.component';
import { FormNotaComponent } from './components/form-nota/form-nota.component';

@Component({
  selector: 'app-root',
  imports: [FormProdutoComponent, FormNotaComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mercado-front');
}
