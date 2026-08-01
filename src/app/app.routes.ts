import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Tickets } from './tickets/tickets';
import { TicketDetail } from './ticket-detail/ticket-detail';
import { CreateTicket } from './create-ticket/create-ticket';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'tickets', component: Tickets, canActivate: [authGuard] },
  { path: 'tickets/new', component: CreateTicket, canActivate: [authGuard] },
  { path: 'tickets/:id', component: TicketDetail, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
