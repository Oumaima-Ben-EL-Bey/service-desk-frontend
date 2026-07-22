import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Auth } from '../auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private http = inject(HttpClient);
  private router = inject(Router);
  private auth = inject(Auth);


  email = '';
  password = '';

  onLogin() {

    this.http
      .post<{ token: string }>('https://service-desk-api.fly.dev/login', {
        email: this.email,
        password: this.password,
      })
      .subscribe((response) => {
        this.auth.saveToken(response.token);
        void this.router.navigate(['/tickets']);
      });
  }
}
