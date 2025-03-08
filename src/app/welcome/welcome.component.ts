import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
  template: `
    <div class="welcome-container">
      <h1 class="welcome-title">Welcome to Product Management System</h1>
      <p class="welcome-subtitle">Made by Vivek</p>
    </div>
  `,
  styles: [`
    .welcome-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      text-align: center;
      padding: 20px;
    }
    .welcome-title {
      font-size: 3rem;
      color: #2a5298;
      margin-bottom: 20px;
      font-weight: bold;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    }
    .welcome-subtitle {
      font-size: 1.5rem;
      color: #666;
      font-style: italic;
    }
  `],
  standalone: false
})
export class WelcomeComponent {} 