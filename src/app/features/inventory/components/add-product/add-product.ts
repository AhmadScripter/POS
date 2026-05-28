import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProduct implements OnInit {
  @Input() product: Product | null = null;
  @Output() saved = new EventEmitter<Product>();
  @Output() cancelled = new EventEmitter<void>();

  categories = ['Tablet', 'Syrup', 'Injection', 'Capsule', 'Cream/Ointment', 'Drop', 'Other'];
  isEdit = false;
  form!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.isEdit = !!this.product;
    this.form = this.fb.group({
      name: [this.product?.name || '', Validators.required],
      generic_name: [this.product?.generic_name || '',],
      category: [this.product?.category || 'Tablet', Validators.required],
      purchase_price: [this.product?.purchase_price || null, [Validators.required, Validators.min(0)]],
      sale_price: [this.product?.sale_price || null, [Validators.required, Validators.min(0)]],
      quantity: [this.product?.quantity || 0, [Validators.required, Validators.min(0)]],
      min_stock_alert: [this.product?.min_stock_alert || 10,],
      expiry_date: [this.product?.expiry_date || '',],
      batch_number: [this.product?.batch_number || '',],
      manufacturer: [this.product?.manufacturer || '',],
    });
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saved.emit(this.form.value);
  }

}
