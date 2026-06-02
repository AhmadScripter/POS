import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import { Sale, SaleItem } from '../../../../core/models/sale.model';
import { InventoryService } from '../../../inventory/services/inventory-service';
import { BillingService } from '../../services/billing-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-billing-pos',
  imports: [CommonModule, FormsModule],
  templateUrl: './billing-pos.html',
  styleUrl: './billing-pos.css',
})
export class BillingPos implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery = '';

  cartItems: SaleItem[] = [];
  discount = 5;
  paymentMethod: 'cash' | 'card' = 'cash';

  isLoading = false;
  showInvoice = false;
  lastSale: Sale | null = null;

  constructor(
    private inventoryService: InventoryService,
    private billingService: BillingService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.inventoryService.getProducts().subscribe({
      next: (res) => {
        this.products = res.data.filter(p => p.quantity > 0);
        this.filteredProducts = [...this.products];
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      (p.generic_name?.toLowerCase().includes(query.toLowerCase()))
    );
  }

  addToCart(product: Product): void {
    const existing = this.cartItems.find(i => i.product_id === product._id);
    if (existing) {
      if (existing.quantity >= product.quantity) return;
      existing.quantity++;
      existing.total = existing.quantity * existing.sale_price;
    } else {
      this.cartItems.push({
        product_id: product._id!,
        product_name: product.name,
        quantity: 1,
        sale_price: product.sale_price,
        total: product.sale_price
      });
    }
  }

  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
  }

  updateQuantity(index: number, qty: number): void {
    if (qty <= 0) { this.removeFromCart(index); return; }
    const product = this.products.find(p => p._id === this.cartItems[index].product_id);
    if (product && qty > product.quantity) return;
    this.cartItems[index].quantity = qty;
    this.cartItems[index].total = qty * this.cartItems[index].sale_price;
  }

  get subtotal(): number {
    return this.cartItems.reduce((s, i) => s + i.total, 0);
  }

  get discountAmount(): number {
    return Math.round(this.subtotal * this.discount / 100);
  }

  get total(): number {
    return this.subtotal - this.discountAmount;
  }

  checkout(): void {
    if (this.cartItems.length === 0) return;

    const sale: Sale = {
      items: this.cartItems,
      subtotal: this.subtotal,
      discount: this.discount,
      total: this.total,
      payment_method: this.paymentMethod
    };

    this.isLoading = true;
    this.billingService.createSale(sale).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.lastSale = res.data;
        this.showInvoice = true;
        this.cartItems = [];
        this.loadProducts();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  newSale(): void {
    this.showInvoice = false;
    this.lastSale = null;
    this.cartItems = [];
  }
}
