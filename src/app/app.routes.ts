import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Tickets } from './tickets/tickets';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'tickets', component: Tickets },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
