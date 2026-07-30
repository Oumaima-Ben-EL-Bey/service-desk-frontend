import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '../auth';
import { FormsModule } from '@angular/forms';

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  category: string;
  requesterId: number;
}

interface Comment {
  id: number;
  body: string;
  authorId: number;
  createdAt: string;
}

@Component({
  selector: 'app-ticket-detail',
  imports: [FormsModule],
  templateUrl: './ticket-detail.html',
  styleUrl: './ticket-detail.css',
})
export class TicketDetail implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private route = inject(ActivatedRoute);

  ticket = signal<Ticket | null>(null);
  comments = signal<Comment[]>([]);
  ticketId: string | null = null;
  newComment = '';

  ngOnInit() {
    this.ticketId = this.route.snapshot.paramMap.get('id');

    this.http
      .get<Ticket>(`https://service-desk-api.fly.dev/tickets/${this.ticketId}`, {
        headers: this.auth.authHeaders(),
      })
      .subscribe((response) => {
        this.ticket.set(response);
      });
    this.http
      .get<Comment[]>(`https://service-desk-api.fly.dev/tickets/${this.ticketId}/comments`, {
        headers: this.auth.authHeaders(),
      })
      .subscribe((response) => {
        this.comments.set(response);
      });
  }

  addComment() {
    this.http
      .post<Comment>(
        `https://service-desk-api.fly.dev/tickets/${this.ticketId}/comments`,
        { body: this.newComment },
        { headers: this.auth.authHeaders() },
      )
      .subscribe((created) => {
        this.comments.update((list) => [...list, created]);
        this.newComment = '';
      });
  }
}
