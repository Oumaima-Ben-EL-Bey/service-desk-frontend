import { Service, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from './auth';

interface User {
  id: number;
  fullName: string;
  roles: string[];
  team: string | null;
}

@Service()
export class Users {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private users = signal<User[]>([]);

  loadUsers() {
    this.http
      .get<User[]>('https://service-desk-api.fly.dev/users', {
        headers: this.auth.authHeaders(),
      })
      .subscribe((response) => {
        this.users.set(response);
      });
  }

  nameFor(id: number | null): string {
    if (id === null) {
      return 'Unassigned';
    }
    const user = this.users().find((u) => u.id === id);
    return user ? user.fullName : 'Unassigned';
  }
}
