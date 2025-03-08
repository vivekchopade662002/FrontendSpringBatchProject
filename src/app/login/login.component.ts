import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private router: Router) {}

  onLogin(): void {
    if (this.username === 'user' && this.password === 'user') {
      localStorage.setItem('isLoggedIn', 'true');
      this.router.navigate(['/welcome']);
    } else {
      this.error = 'Invalid username or password';
    }
  }
} 