import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private http = inject(HttpClient);
  private router = inject(Router);
  private auth = inject(Auth);

  email = '';
  password = '';
  errorMessage = signal('');

  onLogin() {
    this.errorMessage.set('');
    this.http
      .post<{ token: string }>('https://service-desk-api.fly.dev/login', {
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: (response) => {
          this.auth.saveToken(response.token);
          void this.router.navigate(['/tickets']);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.errorMessage.set('Incorrect email or password.');
          } else {
            this.errorMessage.set('Something went wrong. Please try again.');
          }
        },
      });
  }
}
