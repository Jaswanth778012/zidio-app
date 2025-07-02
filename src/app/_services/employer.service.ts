import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Message, PaginatedMessageResponse } from '../_model/message.model';
import { SendMessageRequest } from '../_model/message.model';
import { EmployerProfile } from '../_model/employer-profile.model';
import { Application } from '../_model/Application.model';
import { Interview } from '../_model/Interview.model';


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
//profile for employer
getProfile(): Observable<EmployerProfile>{
  return this.http.get<EmployerProfile>(`${this.baseUrl}/profile`);
}
updateProfile(formData: FormData): Observable<EmployerProfile> {
  const token = localStorage.getItem('token'); 
  const headers = {
    'Authorization': `Bearer ${token}`
  };
  return this.http.post<EmployerProfile>(`${this.baseUrl}/profile`, formData, { headers });
}

//Applications
getAllApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.baseUrl}/All`);
  }

  getRecentApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.baseUrl}/recent`);
  }

  getApplicationsByJob(jobId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.baseUrl}/job/${jobId}`);
  }

  getApplicationsByInternship(internshipId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.baseUrl}/internship/${internshipId}`);
  }

  getApplicationsByStudent(username: string): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.baseUrl}/student/${username}`);
  }

  updateApplicationStatus(id: number, status: string): Observable<any> {
    const params = new HttpParams().set('status', status);
    return this.http.put(`${this.baseUrl}/${id}/status`, {}, { params });
  }

  deleteApplication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  downloadResume(id: number) {
    return this.http.get(`${this.baseUrl}/resume/${id}`, {
      responseType: 'blob' 
    });
  }
  //Interviews Schedule
   createInterview(interview: Interview): Observable<Interview> {
    return this.http.post<Interview>(`${this.baseUrl}/interviews`, interview);
  }

  getAllInterviews(): Observable<Interview[]> {
    return this.http.get<Interview[]>(`${this.baseUrl}/interviews`);
  }

  getInterviewsByEmployer(): Observable<Interview[]> {
    return this.http.get<Interview[]>(`${this.baseUrl}/interviews/employer`);
  }

  getInterviewById(id: number): Observable<Interview> {
    return this.http.get<Interview>(`${this.baseUrl}/interviews/${id}`);
  }

  updateInterview(id: number, interview: Interview): Observable<Interview> {
    return this.http.put<Interview>(`${this.baseUrl}/interviews/${id}`, interview);
  }

  deleteInterview(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/interviews/${id}`, { responseType: 'text' });
  }

} 

