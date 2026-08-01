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
  private loggedIn = signal(this.getToken() !== null);
  private roles = signal<string[]>([]);
  private fullName = signal('');
  private http = inject(HttpClient);
  private meLoaded = signal(false);

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.loggedIn.set(true);
  }
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.loggedIn.set(false);
    this.meLoaded.set(false);
    this.roles.set([]);
    this.fullName.set('');
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.loggedIn();
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
      this.fullName.set(me.fullName);
      this.meLoaded.set(true);
    });
  }

  isAgent(): boolean {
    return this.roles().includes('AGENT');
  }

  isAdmin(): boolean {
    return this.roles().includes('ADMIN');
  }
  name(): string {
    return this.fullName();
  }
  role(): string {
    return this.roles()[0] ?? '';
  }
}
