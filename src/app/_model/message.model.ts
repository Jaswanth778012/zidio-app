export interface User {
  userName: string;
}

export interface Message {
  id: number;
  sender: User;
  recipient: User;
  subject: string;
  body: string;
  isRead?: boolean;        // maps to backend field isRead
  createdAt?: string;    // ISO string from backend
}

export interface PaginatedMessageResponse {
  content: Message[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface SendMessageRequest {
  recipientUserName: string;
  subject: string;
  body: string;
}
