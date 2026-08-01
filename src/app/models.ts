export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  category: string;
  requesterId: number;
  assigneeId: number | null;
}

export interface Comment {
  id: number;
  body: string;
  authorId: number;
  createdAt: string;
}
