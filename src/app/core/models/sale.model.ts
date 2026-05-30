export interface SaleItem {
    product_id: string;
    product_name: string;
    quantity: number;
    sale_price: number;
    total: number;
}

export interface Sale {
    _id?: string;
    items: SaleItem[];
    subtotal: number;
    discount: number;
    total: number;
    payment_method: 'cash' | 'card';
    createdAt?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}