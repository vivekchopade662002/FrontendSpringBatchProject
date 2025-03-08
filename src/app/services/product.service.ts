import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/products';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    console.log('Fetching products...');
    return this.http.get<Product[]>(this.apiUrl)
      .pipe(
        catchError(error => {
          console.error('Error fetching products:', error);
          throw error;
        })
      );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching product ${id}:`, error);
          throw error;
        })
      );
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
      this.apiUrl,
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
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product)
      .pipe(
        catchError(error => {
          console.error(`Error updating product ${id}:`, error);
          throw error;
        })
      );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error deleting product ${id}:`, error);
          throw error;
        })
      );
  }

  importCsv(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/import`, { responseType: 'text' as 'json' })
      .pipe(
        catchError(error => {
          console.error('Error importing CSV:', error);
          throw error;
        })
      );
  }
}
