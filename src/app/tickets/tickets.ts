import { Component, inject, OnInit} from '@angular/core';
import {HttpClient } from '@angular/common/http'

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  category: string;
}

@Component({
  selector: 'app-tickets',
  imports: [],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css',
})
export class Tickets implements OnInit {
  private http = inject(HttpClient);
  tickets: Ticket[] = [];

  ngOnInit() {
    const token = localStorage.getItem('token');

    this.http
      .get<Ticket[]>('https://service-desk-api.fly.dev/tickets', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe((response) => {
          this.tickets = response;
      });
  }
}
