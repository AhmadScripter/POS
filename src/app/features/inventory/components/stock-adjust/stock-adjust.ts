import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../services/inventory-service';

@Component({
  selector: 'app-stock-adjust',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './stock-adjust.html',
  styleUrl: './stock-adjust.css',
})
export class StockAdjust implements OnInit {
  @Input() product: Product | null = null;
  @Input() allProducts: Product[] = [];
  @Output() updated = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form!: FormGroup;
  stockType: 'IN' | 'OUT' = 'IN';
  selectedProduct: Product | null = null;
  errorMsg = '';

  constructor(private fb: FormBuilder, private inventoryService: InventoryService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      product_id: [this.product ? this.allProducts.indexOf(this.product) : '', Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
      reason: ['']
    });

    if (this.product) {
      this.selectedProduct = this.product;
    }

    this.form.get('product_id')!.valueChanges.subscribe(idx => {
      this.selectedProduct = this.allProducts[idx] || null;
      this.errorMsg = '';
    });
  }

  setType(type: 'IN' | 'OUT'): void {
    this.stockType = type;
    this.errorMsg = '';
  }

  get currentStock(): number {
    return this.selectedProduct?.quantity || 0;
  }

  get newStock(): number {
    const qty = this.form.get('quantity')?.value || 0;
    return this.stockType === 'IN' ? this.currentStock + qty : this.currentStock - qty;
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
  
    const qty = this.form.value.quantity;
    if (this.stockType === 'OUT' && qty > this.currentStock) {
      this.errorMsg = `Insufficient stock! Available: ${this.currentStock}`;
      return;
    }
  
    const idx = this.form.value.product_id;
    const product = this.allProducts[idx];
  
    this.inventoryService.adjustStock(product._id!, {
      quantity: qty,
      type: this.stockType,
      reason: this.form.value.reason
    }).subscribe({
      next: () => this.updated.emit(),
      error: (err) => {
        this.errorMsg = err.error?.message || 'Error updating stock';
      }
    });
  }

}
