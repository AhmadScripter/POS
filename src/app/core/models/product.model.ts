export interface Product {
    _id?: string;
    name: string;
    generic_name?: string;
    category: string;
    barcode?: string;
    purchase_price: number;
    sale_price: number;
    quantity: number;
    min_stock_alert: number;
    expiry_date?: string;
    batch_number?: string;
    manufacturer?: string;
    is_active?: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}