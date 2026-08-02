import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Auth } from '../auth';
import { FormsModule } from '@angular/forms';
import { Users } from '../users';
import { Ticket, Comment } from '../models';
import { StatusLabelPipe } from '../status-label-pipe';

const STATUS_TRANSITIONS: Record<string, string[]> = {
  NEW: ['IN_PROGRESS', 'RESOLVED', 'CLOSED'],
  IN_PROGRESS: ['RESOLVED', 'CLOSED'],
  RESOLVED: ['IN_PROGRESS', 'CLOSED'],
  CLOSED: [],
};

@Component({
  selector: 'app-ticket-detail',
  imports: [FormsModule, RouterLink, DatePipe, StatusLabelPipe],
  templateUrl: './ticket-detail.html',
  styleUrl: './ticket-detail.css',
})
export class TicketDetail implements OnInit {
  private http = inject(HttpClient);
  protected auth = inject(Auth);
  private route = inject(ActivatedRoute);
  protected users = inject(Users);

  ticket = signal<Ticket | null>(null);
  comments = signal<Comment[]>([]);
  ticketId: string | null = null;
  newComment = '';
  selectedAgentId: number | null = null;
  errorMessage = signal('');
  loading = signal(true);
  loadFailed = signal(false);

  ngOnInit() {
    this.ticketId = this.route.snapshot.paramMap.get('id');

    this.http
      .get<Ticket>(`https://service-desk-api.fly.dev/tickets/${this.ticketId}`, {
        headers: this.auth.authHeaders(),
      })
      .subscribe({
        next: (response) => {
          this.ticket.set(response);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.loadFailed.set(true);
        },
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
    this.errorMessage.set('');
    this.http
      .post<Comment>(
        `https://service-desk-api.fly.dev/tickets/${this.ticketId}/comments`,
        { body: this.newComment },
        { headers: this.auth.authHeaders() },
      )
      .subscribe({
        next: (created) => {
          this.comments.update((list) => [...list, created]);
          this.newComment = '';
        },
        error: (err) => this.showError(err),
      });
  }

  claim() {
    this.errorMessage.set('');
    this.http
      .post<Ticket>(`https://service-desk-api.fly.dev/tickets/${this.ticketId}/claim`, null, {
        headers: this.auth.authHeaders(),
      })
      .subscribe({
        next: (updated) => this.ticket.set(updated),
        error: (err) => this.showError(err),
      });
  }

  changeStatus(target: string) {
    this.errorMessage.set('');
    this.http
      .patch<Ticket>(
        `https://service-desk-api.fly.dev/tickets/${this.ticketId}/status`,
        {
          status: target,
        },
        { headers: this.auth.authHeaders() },
      )
      .subscribe({
        next: (statusUpdated) => this.ticket.set(statusUpdated),
        error: (err) => this.showError(err),
      });
  }

  allowedStatuses(): string[] {
    const current = this.ticket()?.status;
    return current ? STATUS_TRANSITIONS[current] : [];
  }

  assign() {
    this.errorMessage.set('');
    this.http
      .patch<Ticket>(
        `https://service-desk-api.fly.dev/tickets/${this.ticketId}/assignee`,
        { assigneeId: this.selectedAgentId },
        { headers: this.auth.authHeaders() },
      )
      .subscribe({
        next: (updated) => this.ticket.set(updated),
        error: (err) => this.showError(err),
      });
  }

  private showError(err: HttpErrorResponse) {
    if (err.status === 400) {
      this.errorMessage.set('Please check your input and try again.');
    } else if (err.status === 403) {
      this.errorMessage.set("You don't have permission to do that.");
    } else if (err.status === 404) {
      this.errorMessage.set('That item no longer exists.');
    } else if (err.status === 409) {
      this.errorMessage.set("That action isn't allowed right now.");
    } else {
      this.errorMessage.set('Something went wrong. Please try again.');
    }
  }
}
