import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import { InventoryService } from '../../services/inventory-service';
import { CommonModule } from '@angular/common';
import { AddProduct } from '../add-product/add-product';
import { StockAdjust } from '../stock-adjust/stock-adjust';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, AddProduct, StockAdjust],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = false;
  showAddModal = false;
  showStockModal = false;
  searchQuery = '';
  activeFilter: 'all' | 'low' | 'expiry' = 'all';
  selectedProduct: Product | null = null;
  stats = { total: 0, value: 0, lowStock: 0, expiring: 0 };

  constructor(private inventoryService: InventoryService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadProducts();
  }
  loadProducts(): void {
    this.isLoading = true;
    this.inventoryService.getProducts().subscribe({
      next: (res) => {
        this.products = res.data;
        this.filteredProducts = [...this.products];
        this.calcStats();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    })
  }

  calcStats(): void {
    const in30 = new Date();
    in30.setDate(in30.getDate() + 30);
    this.stats.total = this.products.length;
    this.stats.value = this.products.reduce((s, p) => s + (p.purchase_price * p.quantity), 0);
    this.stats.lowStock = this.products.filter(p => p.quantity <= p.min_stock_alert).length;
    this.stats.expiring = this.products.filter(p => p.expiry_date && new Date(p.expiry_date) <= in30).length;
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }

  setFilter(filter: 'all' | 'low' | 'expiry'): void {
    this.activeFilter = filter;
    this.applyFilters();
  }

  applyFilters(): void {
    const in30 = new Date();
    in30.setDate(in30.getDate() + 30);
    let result = [...this.products];

    if (this.searchQuery) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (p.generic_name?.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    }

    if (this.activeFilter === 'low') {
      result = result.filter(p => p.quantity <= p.min_stock_alert);
    } else if (this.activeFilter === 'expiry') {
      result = result.filter(p => p.expiry_date && new Date(p.expiry_date) <= in30);
    }

    this.filteredProducts = result;
  }

  getStockStatus(p: Product): 'ok' | 'low' | 'out' {
    if (p.quantity === 0) return 'out';
    if (p.quantity <= p.min_stock_alert) return 'low';
    return 'ok';
  }

  openAddModal(): void {
    this.selectedProduct = null;
    this.showAddModal = true;
  }
  onStockUpdated(): void {
    this.showStockModal = false;
    this.loadProducts();
  }
  openEditModal(product: Product): void {
    this.selectedProduct = { ...product };
    this.showAddModal = true;
  }

  onProductSaved(product: Product): void {
    if (this.selectedProduct) {
      this.inventoryService.updateProduct(this.selectedProduct._id!, product).subscribe({
        next: () => {
          this.loadProducts();
          this.showAddModal = false;
          this.selectedProduct = null;
        },
        error: (err) => {
          console.error(err);
        }
      });
    } else {
      this.inventoryService.addProduct(product).subscribe({
        next: () => {
          this.loadProducts();
          this.showAddModal = false;
        },
        error: (err) => {
          console.error(err);
        }
      })
    }
  }

  deleteProduct(product: Product): void {
    if (!confirm(`Are you sure you want to delete ${product.name}`)) return;
    this.inventoryService.deleteProduct(product._id!).subscribe({
      next: () => this.loadProducts(),
      error: (err) => console.error(err)
    })
  }

}
