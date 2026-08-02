import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../auth';
import { Ticket } from '../models';

@Component({
  selector: 'app-create-ticket',
  imports: [FormsModule, RouterLink],
  templateUrl: './create-ticket.html',
  styleUrl: './create-ticket.css',
})
export class CreateTicket {
  private http = inject(HttpClient);
  private router = inject(Router);
  private auth = inject(Auth);

  title = '';
  description = '';
  category = '';
  errorMessage = signal('');

  categories = ['NETWORK', 'HARDWARE', 'ACCESS', 'SOFTWARE'];

  createTicket() {
    this.errorMessage.set('');
    this.http
      .post<Ticket>(
        'https://service-desk-api.fly.dev/tickets',
        { title: this.title, description: this.description, category: this.category },
        { headers: this.auth.authHeaders() },
      )
      .subscribe({
        next: (created) => {
          void this.router.navigate(created?.id ? ['/tickets', created.id] : ['/tickets']);
        },
        error: (err) => {
          if (err.status === 400) {
            this.errorMessage.set('Please check your input and try again.');
          } else {
            this.errorMessage.set('Something went wrong. Please try again.');
          }
        },
      });
  }
}
