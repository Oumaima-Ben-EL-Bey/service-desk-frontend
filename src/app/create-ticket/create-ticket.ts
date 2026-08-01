import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-ticket',
  imports: [FormsModule],
  templateUrl: './create-ticket.html',
  styleUrl: './create-ticket.css',
})
export class CreateTicket {
  title = '';
  description = '';
  category = '';

  categories = ['NETWORK', 'HARDWARE', 'ACCESS', 'SOFTWARE'];

  createTicket() {}
}
