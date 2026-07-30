import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../auth';
import { RouterLink } from '@angular/router';

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
  imports: [RouterLink],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css',
})
export class Tickets implements OnInit {
  private http = inject(HttpClient);
  protected auth = inject(Auth);

  tickets = signal<Ticket[]>([]);
  users = signal<User[]>([]);
  statusFilters = ['ALL', 'NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  sortDirection = signal<'asc' | 'desc'>('asc');
  selectedStatus = signal<string>('ALL');

  visibleTickets = computed(() => {
    const status = this.selectedStatus();
    if (status === 'ALL') {
      return this.tickets();
    }
    return this.tickets().filter((ticket) => ticket.status === status);
  });

  sortedTickets = computed(() => {
    const direction = this.sortDirection();
    const list = [...this.visibleTickets()];
    return list.sort((a, b) => {
      const comparison = a.title.localeCompare(b.title);
      return direction === 'asc' ? comparison : -comparison;
    });
  });
  userName(id: number): string {
    const user = this.users().find((u) => u.id === id);
    return user ? user.fullName : '';
  }

  countFor(status: string): number {
    if (status === 'ALL') {
      return this.tickets().length;
    }
    return this.tickets().filter((ticket) => ticket.status === status).length;
  }

  statusColor(status: string): string {
    switch (status) {
      case 'NEW':
        return 'var(--color-status-new)';
      case 'IN_PROGRESS':
        return 'var(--color-status-progress)';
      case 'RESOLVED':
        return 'var(--color-status-resolved)';
      case 'CLOSED':
        return 'var(--color-status-closed)';
      default:
        return 'var(--color-ink)';
    }
  }

  statusIcon(status: string): string {
    return `/status/dot-${status.toLowerCase().replace('_', '-')}.svg`;
  }
  categoryIcon(category: string): string {
    return `/icons/icon-${category.toLowerCase()}.svg`;
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

    this.auth.loadMe();
  }
}
