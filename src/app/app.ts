import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Auth } from './auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected auth = inject(Auth);
  private router = inject(Router);
  protected readonly title = signal('service-desk-frontend');

  logout() {
    this.auth.clearToken();
    void this.router.navigate(['/login']);
  }
}
