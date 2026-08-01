import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private http = inject(HttpClient);
  private router = inject(Router);

  email = '';
  fullName = '';
  password = '';
  errorMessage = signal('');

  onRegister() {
    this.errorMessage.set('');
    this.http
      .post('https://service-desk-api.fly.dev/register', {
        email: this.email,
        fullName: this.fullName,
        password: this.password,
      })
      .subscribe({
        next: () => {
          void this.router.navigate(['/login']);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 409) {
            this.errorMessage.set('That email is already registered.');
          } else if (err.status === 400) {
            this.errorMessage.set('Please check your input and try again.');
          } else {
            this.errorMessage.set('Something went wrong. Please try again.');
          }
        },
      });
  }
}
