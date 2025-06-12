import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Message, PaginatedMessageResponse } from '../_model/message.model';
import { SendMessageRequest } from '../_model/message.model';


@Injectable({
  providedIn: 'root'
})
export class EmployerService {

   private baseUrl = 'http://localhost:8080/employer';
    constructor(private http: HttpClient) {}

   createJob(job: any, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('job', new Blob([JSON.stringify(job)], { type: 'application/json' }));
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/jobs`, formData);
  }

  updateJob(id: number, job: any, file?: File): Observable<any> {
    const formData = new FormData();
    formData.append('job', new Blob([JSON.stringify(job)], { type: 'application/json' }));
    if (file) formData.append('file', file);
    return this.http.put(`${this.baseUrl}/jobs/${id}`, formData);
  }

  getAllJobs(): Observable<any> {
    return this.http.get(`${this.baseUrl}/jobs`);
  }

  deleteJob(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/jobs/${id}`);
  }

  flagJob(id: number, flagged: boolean): Observable<any> {
    return this.http.patch(`${this.baseUrl}/jobs/${id}/flag?flagged=${flagged}`, {});
  }

  getFilteredJobs(page: number, size: number, search: string): Observable<any> {
  return this.http.get(`${this.baseUrl}/jobs/paged`, {
    params: {
      page: page.toString(),
      size: size.toString(),
      search: search
    }
  });
}


  createInternship(internship: any, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('internship', new Blob([JSON.stringify(internship)], { type: 'application/json' }));
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/internships`, formData);
  }

  updateInternship(id: number, internship: any, file?: File): Observable<any> {
    const formData = new FormData();
    formData.append('internship', new Blob([JSON.stringify(internship)], { type: 'application/json' }));
    if (file) formData.append('file', file);
    return this.http.put(`${this.baseUrl}/internships/${id}`, formData);
  }

  getAllInternships(): Observable<any> {
    return this.http.get(`${this.baseUrl}/internships`);
  }

  deleteInternship(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/internships/${id}`);
  }

  flagInternship(id: number, flagged: boolean): Observable<any> {
    return this.http.patch(`${this.baseUrl}/internships/${id}/flag?flagged=${flagged}`, {});
  }

  updateInternshipStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/internships/${id}/status?status=${status}`, {});
  }

  getFilteredInternships(page: number, size: number, search: string): Observable<any> {
  return this.http.get(`${this.baseUrl}/internships/paged`, {
    params: {
      page: page.toString(),
      size: size.toString(),
      search: search
    }
  });
}

// Send message
  sendMessage(request: SendMessageRequest): Observable<Message> {
    return this.http.post<Message>(`${this.baseUrl}/messages`, request);
  }

  // Get all messages
  getAllMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/messages`);
  }

  // Get messages by recipient username
  getInboxMessages(userName: string, page: number, size: number): Observable<PaginatedMessageResponse> {
  return this.http.get<PaginatedMessageResponse>(`${this.baseUrl}/messages/recipient/${userName}?page=${page}&size=${size}`);
}


  // Get messages by sender username
  getMessagesFromSender(userName: string,page:number,size:number): Observable<PaginatedMessageResponse> {
    return this.http.get<PaginatedMessageResponse>(`${this.baseUrl}/messages/sender/${userName}?page=${page}&size=${size}`);
  }

  // Get message by ID
  getMessageById(id: number): Observable<Message> {
    return this.http.get<Message>(`${this.baseUrl}/messages/${id}`);
  }

  // Mark message as read by ID
  markAsRead(id: number): Observable<Message> {
    return this.http.put<Message>(`${this.baseUrl}/messages/${id}/read`, {});
  }

  // Delete message by ID
  deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/messages/${id}`);
  }

  deleteAllSentMessages(userName: string): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/messages/sender/${userName}/deleteAll`);
}

  deleteAllInboxMessages(userName: string) {
  return this.http.delete(`${this.baseUrl}/messages/recipient/${userName}/deleteAll`);
}

  // Mark all messages as read by recipient username
  markAllAsReadFromRecipient(userName: string): Observable<any> {
  return this.http.put<any>(`${this.baseUrl}/messages/recipient/${userName}/read`, {});
}
  markAllAsReadFromSender(userName: string): Observable<any> {
  return this.http.put<any>(`${this.baseUrl}/messages/sender/${userName}/read`, {});
}

} 

