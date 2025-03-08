import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ProductService } from './services/product.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
  searchId: string = '';
  isSearchActive: boolean = false;

  constructor(
    public router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    // Initial check
    this.checkLoginStatus();
    
    // Only react to NavigationEnd events
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkLoginStatus();
      if (!this.isLoggedIn && !this.router.url.includes('login')) {
        this.router.navigate(['/login']);
      }
    });

    // Ensure we start at login if not logged in
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  private checkLoginStatus() {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  searchProduct() {
    if (this.searchId) {
      this.isSearchActive = true;
      this.router.navigate(['/products'], { 
        queryParams: { id: this.searchId }
      });
    }
  }

  clearSearch() {
    this.searchId = '';
    this.isSearchActive = false;
    this.router.navigate(['/products']);
  }

  importProducts(): void {
    this.productService.importCsv().subscribe({
      next: (response) => {
        console.log('Import successful:', response);
        alert('Products imported successfully!');
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Import failed:', error);
        alert('Failed to import products. Please try again.');
      }
    });
  }
}
