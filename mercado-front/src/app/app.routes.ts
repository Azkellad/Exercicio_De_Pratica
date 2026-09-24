import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'produtos' },
  {
    path: 'compra',
    loadComponent: () =>
      import('./features/compra/compra-page/compra-page.component').then(
        (m) => m.CompraPageComponent
      )
  },
  {
    path: 'produtos',
    loadComponent: () =>
      import('./features/produtos/produtos-page/produtos-page.component').then(
        (m) => m.ProdutosPageComponent
      )
  },
  {
    path: 'notas',
    loadComponent: () =>
      import('./features/notas/notas-page/notas-page.component').then(
        (m) => m.NotasPageComponent
      )
  },
  { path: '**', redirectTo: 'produtos' }
];
