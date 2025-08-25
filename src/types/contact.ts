export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  createdAt: string;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
}
