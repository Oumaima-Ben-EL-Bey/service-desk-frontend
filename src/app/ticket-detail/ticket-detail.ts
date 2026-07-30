import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '../auth';

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  category: string;
  requesterId: number;
}

@Component({
  selector: 'app-ticket-detail',
  imports: [],
  templateUrl: './ticket-detail.html',
  styleUrl: './ticket-detail.css',
})
export class TicketDetail implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private route = inject(ActivatedRoute);

  ticket = signal<Ticket | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.http
      .get<Ticket>(`https://service-desk-api.fly.dev/tickets/${id}`, {
        headers: this.auth.authHeaders(),
      })
      .subscribe((response) => {
        this.ticket.set(response);
      });
  }
}
