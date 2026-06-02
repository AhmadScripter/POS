import { ChangeDetectorRef, Component } from '@angular/core';
import { Sale } from '../../../../core/models/sale.model';
import { BillingService } from '../../../billing/services/billing-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sales-list',
  imports: [CommonModule],
  templateUrl: './sales-list.html',
  styleUrl: './sales-list.css',
})
export class SalesList {
  sales: Sale[] = [];
  isLoading = false;
  selectedSale: Sale | null = null;

  constructor(private billingService: BillingService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.isLoading = true;
    this.billingService.getSales().subscribe({
      next: (res) => {
        this.sales = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  get totalRevenue(): number {
    return this.sales.reduce((s, sale) => s + sale.total, 0);
  }

  get todaySales(): number {
    const today = new Date().toDateString();
    return this.sales.filter(s => new Date(s.createdAt!).toDateString() === today).length;
  }

  get todayRevenue(): number {
    const today = new Date().toDateString();
    return this.sales
      .filter(s => new Date(s.createdAt!).toDateString() === today)
      .reduce((s, sale) => s + sale.total, 0);
  }

  viewDetail(sale: Sale): void {
    this.selectedSale = sale;
  }

  closeDetail(): void {
    this.selectedSale = null;
  }
}
