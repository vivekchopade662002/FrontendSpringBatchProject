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
  // Data properties
  products: Product[] = [];
  loading = false;
  error: string | null = null;

  // Search properties
  searchId: number | null = null;
  isSearchActive = false;

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  pages: number[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if there's a search ID in the URL
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.searchById(Number(params['id']));
      } else {
        this.loadProducts();
      }
    });
  }

  // Load all products with pagination
  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe(data => {
      this.totalItems = data.length;
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      this.products = data.slice(start, end);
      this.updatePagination();
      this.loading = false;
      this.isSearchActive = false;
    });
  }

  // Update pagination numbers
  updatePagination(): void {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Handle page changes
  changePage(page: number): void {
    if (page >= 1 && page <= Math.ceil(this.totalItems / this.itemsPerPage)) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  // Search product by ID
  searchById(id: number): void {
    this.loading = true;
    this.productService.getProduct(id).subscribe(product => {
      this.products = product ? [product] : [];
      this.totalItems = this.products.length;
      this.currentPage = 1;
      this.updatePagination();
      this.loading = false;
      this.isSearchActive = true;
    });
  }

  // Clear search and show all products
  clearSearch(): void {
    this.searchId = null;
    this.loadProducts();
  }

  // Delete a product
  deleteProduct(id: number | undefined): void {
    if (id && confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  // Import products from CSV
  importProducts(): void {
    this.productService.importCsv().subscribe(() => {
      alert('Products imported successfully!');
      this.loadProducts();
    });
  }
}
