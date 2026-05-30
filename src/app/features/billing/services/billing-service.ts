import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sale, ApiResponse } from '../../../core/models/sale.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BillingService {

  private apiUrl = `${environment.apiUrl}/api/sales`;

  constructor(private http: HttpClient) { }

  getSales(): Observable<ApiResponse<Sale[]>> {
    return this.http.get<ApiResponse<Sale[]>>(this.apiUrl);
  }

  getSale(id: string): Observable<ApiResponse<Sale>> {
    return this.http.get<ApiResponse<Sale>>(`${this.apiUrl}/${id}`);
  }

  createSale(sale: Sale): Observable<ApiResponse<Sale>> {
    return this.http.post<ApiResponse<Sale>>(this.apiUrl, sale);
  }
}