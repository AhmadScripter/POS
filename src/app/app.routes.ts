import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'inventory', pathMatch: 'full' },
  {
    path: 'inventory',
    loadComponent: () =>
      import('./features/inventory/components/product-list/product-list')
      .then(m => m.ProductList)
  }
];