import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: false
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error: string | null = null;
  searchId: number | null = null;
  isSearchActive = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Subscribe to query params to handle search by ID
    this.route.queryParams.subscribe(params => {
      const searchId = params['id'];
      if (searchId) {
        this.searchById(Number(searchId));
      } else {
        this.loadProducts();
      }
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    this.isSearchActive = false;
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        console.log('Products loaded:', data);
        this.products = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
      }
    });
  }

  searchById(id: number): void {
    this.loading = true;
    this.error = null;
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        console.log('Product found:', product);
        this.products = [product];
        this.loading = false;
        this.isSearchActive = true;
      },
      error: (error) => {
        console.error('Error finding product:', error);
        this.error = 'Product not found with ID: ' + id;
        this.loading = false;
      }
    });
  }

  clearSearch(): void {
    this.searchId = null;
    this.loadProducts();
  }

  deleteProduct(id: number | undefined): void {
    if (id) {
      if (confirm('Are you sure you want to delete this product?')) {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            console.log('Product deleted successfully');
            this.loadProducts();
          },
          error: (error) => {
            console.error('Error deleting product:', error);
            alert('Failed to delete product. Please try again.');
          }
        });
      }
    }
  }

  importProducts(): void {
    this.productService.importCsv().subscribe({
      next: (response) => {
        console.log('Import successful:', response);
        alert('Products imported successfully!');
        this.loadProducts();
      },
      error: (error) => {
        console.error('Import failed:', error);
        alert('Failed to import products. Please try again.');
      }
    });
  }
}
