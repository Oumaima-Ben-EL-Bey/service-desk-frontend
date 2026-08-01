import { Service, inject, signal } from '@angular/core';
import {HttpClient} from '@angular/common/http';

interface CurrentUser {
  id: number;
  fullName: string;
  roles: string[];
}

@Service()
export class Auth {
  private tokenKey = 'token';
  private roles = signal<string[]>([]);
  private http = inject(HttpClient);
  private meLoaded = signal(false);

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

  loadMe() {
    if (this.meLoaded()) {
      return;
    }
    this.getMe().subscribe((me) => {
      this.roles.set(me.roles);
      this.meLoaded.set(true);
    });
  }

  isAgent(): boolean {
    return this.roles().includes('AGENT');
  }

  isAdmin(): boolean {
    return this.roles().includes('ADMIN');
  }
}
