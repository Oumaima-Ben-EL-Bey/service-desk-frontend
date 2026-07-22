import { Component, inject, OnInit, signal} from '@angular/core';
import {HttpClient } from '@angular/common/http'
import { Auth } from '../auth';

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  category: string;
  requesterId: number;
}

interface User {
  id: number;
  fullName: string;
}

@Component({
  selector: 'app-tickets',
  imports: [],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css',
})
export class Tickets implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(Auth);

  tickets = signal<Ticket[]>([]);
  users = signal<User[]>([]);

  userName(id: number): string {
    const user = this.users().find((u) => u.id === id);
    return user ? user.fullName : '';
  }

  ngOnInit() {
    this.http
      .get<Ticket[]>('https://service-desk-api.fly.dev/tickets', {
        headers: this.auth.authHeaders(),
      })
      .subscribe((response) => {
        this.tickets.set(response);
      });

    this.http
      .get<User[]>('https://service-desk-api.fly.dev/users', {
        headers: this.auth.authHeaders(),
      })
      .subscribe((response) => {
        this.users.set(response);
      });
  }
}
