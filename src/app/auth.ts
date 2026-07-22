import { Service } from '@angular/core';

@Service()
export class Auth {
  private tokenKey = 'token';

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  authHeaders() {
    return { Authorization: `Bearer ${this.getToken()}` };
  }
}
