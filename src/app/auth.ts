import { Service, inject } from '@angular/core';
import {HttpClient} from '@angular/common/http';


interface CurrentUser {
  id: number;
  fullName: string;
  roles: string[];
}

@Service()
export class Auth {
  private tokenKey = 'token';
  private http = inject(HttpClient);

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  authHeaders() {
    return { Authorization: `Bearer ${this.getToken()}` };
  }
  getMe() {
    return this.http.get<CurrentUser>('https://service-desk-api.fly.dev/me', {
      headers: this.authHeaders(),
    });
  }
}
