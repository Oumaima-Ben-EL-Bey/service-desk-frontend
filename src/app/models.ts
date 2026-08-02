export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  category: string;
  requesterId: number;
  assigneeId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  body: string;
  authorId: number;
  createdAt: string;
}
