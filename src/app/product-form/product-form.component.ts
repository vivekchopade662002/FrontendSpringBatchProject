import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
  standalone: false
})
export class ProductFormComponent implements OnInit {
  // Form data
  product: Product = {
    name: '',
    description: '',
    price: 0,
    category: ''
  };

  // Component state
  isEditMode = false;
  loading = false;
  title = 'Add New Product';

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if we're editing an existing product
    const productId = this.route.snapshot.params['id'];
    if (productId) {
      this.isEditMode = true;
      this.title = 'Edit Product';
      this.loadProduct(productId);
    }
  }

  // Load product data for editing
  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProduct(id).subscribe(product => {
      this.product = product;
      this.loading = false;
    });
  }

  // Handle form submission
  onSubmit(): void {
    this.loading = true;

    if (this.isEditMode) {
      // Update existing product
      this.productService.updateProduct(this.product.id!, this.product)
        .subscribe(() => {
          this.router.navigate(['/products']);
        });
    } else {
      // Create new product
      this.productService.createProduct(this.product)
        .subscribe(() => {
          this.router.navigate(['/products']);
        });
    }
  }

  // Reset form to initial state
  resetForm(): void {
    if (confirm('Are you sure you want to reset the form?')) {
      if (this.isEditMode) {
        this.loadProduct(this.product.id!);
      } else {
        this.product = {
          name: '',
          description: '',
          price: 0,
          category: ''
        };
      }
    }
  }

  // Cancel and return to product list
  cancel(): void {
    this.router.navigate(['/products']);
  }
}
