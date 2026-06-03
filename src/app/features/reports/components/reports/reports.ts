import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BillingService } from '../../../billing/services/billing-service';
import { Sale } from '../../../../core/models/sale.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports implements OnInit {
  sales: Sale[] = [];
  activeTab: 'daily' | 'monthly' = 'daily';

  constructor(private billingService: BillingService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.billingService.getSales().subscribe({
      next: (res) => {
        this.sales = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  get dailyData(): { date: string; sales: number; revenue: number }[] {
    const map = new Map<string, { sales: number; revenue: number }>();

    this.sales.forEach(sale => {
      const date = new Date(sale.createdAt!).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
      if (!map.has(date)) map.set(date, { sales: 0, revenue: 0 });
      map.get(date)!.sales++;
      map.get(date)!.revenue += sale.total;
    });

    return Array.from(map.entries())
      .map(([date, data]) => ({ date, ...data }))
      .slice(0, 30);
  }

  get monthlyData(): { month: string; sales: number; revenue: number }[] {
    const map = new Map<string, { sales: number; revenue: number }>();

    this.sales.forEach(sale => {
      const month = new Date(sale.createdAt!).toLocaleDateString('en-PK', { month: 'long', year: 'numeric' });
      if (!map.has(month)) map.set(month, { sales: 0, revenue: 0 });
      map.get(month)!.sales++;
      map.get(month)!.revenue += sale.total;
    });

    return Array.from(map.entries()).map(([month, data]) => ({ month, ...data }));
  }

  get totalRevenue(): number {
    return this.sales.reduce((s, sale) => s + sale.total, 0);
  }

  get totalSales(): number {
    return this.sales.length;
  }

  get avgSaleValue(): number {
    if (!this.sales.length) return 0;
    return Math.round(this.totalRevenue / this.totalSales);
  }

  get topProduct(): string {
    const map = new Map<string, number>();
    this.sales.forEach(sale => {
      sale.items.forEach(item => {
        map.set(item.product_name, (map.get(item.product_name) || 0) + item.quantity);
      });
    });
    if (!map.size) return '—';
    return [...map.entries()].sort((a, b) => b[1] - a[1])[0][0];
  }

}
