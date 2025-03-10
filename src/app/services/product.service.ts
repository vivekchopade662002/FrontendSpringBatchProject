import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    console.log('Fetching products from:', this.baseUrl);
    return this.http.get<Product[]>(this.baseUrl);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    // Format data to match MySQL table structure
    const formattedProduct = {
      name: product.name?.trim() || '',
      description: product.description?.trim() || '',
      price: typeof product.price === 'string' ? product.price : Number(product.price).toFixed(2),
      category: product.category?.trim() || ''
    };

    console.log('Sending formatted product data:', formattedProduct);

    return this.http.post<Product>(
      this.baseUrl,
      formattedProduct,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    ).pipe(
      catchError(error => {
        console.error('Detailed error:', error?.error);
        throw error;
      })
    );
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  importCsv(): Observable<any> {
    return this.http.get(`${this.baseUrl}/import`, { responseType: 'text' as 'json' });
  }
}
