import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Tickets } from './tickets/tickets';
import { TicketDetail } from './ticket-detail/ticket-detail';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'tickets', component: Tickets },
  { path: 'tickets/:id', component: TicketDetail },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
