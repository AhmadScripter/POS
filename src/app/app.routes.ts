import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'inventory', pathMatch: 'full' },
  {
    path: 'inventory',
    loadComponent: () =>
      import('./features/inventory/components/product-list/product-list')
        .then(m => m.ProductList)
  },
  {
    path: 'billing',
    loadComponent: () =>
      import('./features/billing/components/billing-pos/billing-pos')
        .then(m => m.BillingPos)
  },
  {
    path: 'sales',
    loadComponent: () =>
      import('./features/sales/components/sales-list/sales-list')
        .then(m => m.SalesList)
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./features/reports/components/reports/reports')
        .then(m => m.Reports)
  }
];