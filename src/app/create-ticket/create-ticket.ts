import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Auth } from '../auth';

@Component({
  selector: 'app-create-ticket',
  imports: [FormsModule],
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

  categories = ['NETWORK', 'HARDWARE', 'ACCESS', 'SOFTWARE'];

  createTicket() {
    this.http
      .post(
        'https://service-desk-api.fly.dev/tickets',
        { title: this.title, description: this.description, category: this.category },
        { headers: this.auth.authHeaders() },
      )
      .subscribe(() => {
        void this.router.navigate(['/tickets']);
      });
  }
}
