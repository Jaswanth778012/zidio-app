import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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


} 

