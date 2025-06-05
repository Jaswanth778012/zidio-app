import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminProfile } from '../_model/admin-profile.model';
import { AdminNotification } from '../_model/admin-notification.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:8080/admin';

  constructor(private http: HttpClient) {}

  getAllUsers() {
    return this.http.get<any[]>(`${this.baseUrl}/users`);
  }

  updateUserStatus(userName: string, status: string) {
    return this.http.put(`${this.baseUrl}/users/${userName}/status?status=${status}`, {},{responseType: 'text'});
  }

  resetUserPassword(userName: string, newPassword: string) {
    return this.http.put(`${this.baseUrl}/users/${userName}/reset-password?newPassword=${newPassword}`, {});
  }

  getAllEmployers() {
  return this.http.get<any[]>(`${this.baseUrl}/employers`);
}

updateEmployerStatus(username: string, status: string) {
  return this.http.put(`${this.baseUrl}/employers/${username}/status?status=${status}`, {},{responseType: 'text'});
}
resetEmployerPassword(userName: string, newPassword: string) {
    return this.http.put(`${this.baseUrl}/employers/${userName}/reset-password?newPassword=${newPassword}`, {});
  }

  getAllStudents() {
  return this.http.get<any[]>(`${this.baseUrl}/students`);
}

updateStudentStatus(userName: string, status: string) {
  return this.http.put(`${this.baseUrl}/students/${userName}/status?userStatus=${status}`, {},{responseType: 'text'});
}

resetStudentPassword(userName: string, newPassword: string) {
  return this.http.put(`${this.baseUrl}/students/${userName}/reset-password?newPassword=${newPassword}`, {});
}

//courses
getAllCourses(): Observable<any[]> {
  const token = localStorage.getItem('token');
const headers = new HttpHeaders({
  'Authorization': `Bearer ${token}`
});
return this.http.get<any[]>(`${this.baseUrl}/courses`, { headers });
}

addCourse(courseRequest: any, imageFiles: File[]): Observable<any> {
  const formData = new FormData();
  formData.append('course', new Blob([JSON.stringify(courseRequest)], { type: 'application/json' }));
  imageFiles.forEach(file => {
    formData.append('imageFile', file);
  });

  return this.http.post(`${this.baseUrl}/courses`, formData);
}

updateCourse(id: number, courseUpdateRequest: any, imageFiles: File[]): Observable<any> {
  const token = localStorage.getItem('token'); // Or from AuthService
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  const formData = new FormData();
  formData.append('course', new Blob([JSON.stringify(courseUpdateRequest)], { type: 'application/json' }));

  // Append files if provided
  // if (imageFiles && imageFiles.length > 0) {
  //   for (let i = 0; i < imageFiles.length; i++) {
  //     formData.append('imageFile', imageFiles[i]);
  //   }
  // }
  imageFiles.forEach(file => {
    formData.append('imageFile', file);
  });

  return this.http.put(`${this.baseUrl}/courses/${id}`, formData, { headers });
}

updateCourseStatus(id: number, status: string): Observable<any> {
  return this.http.put(`${this.baseUrl}/courses/${id}/status?status=${status}`, {});
}

toggleCourseVisibility(id: number, active: boolean): Observable<any> {
  return this.http.put(`${this.baseUrl}/courses/${id}/visibility?active=${active}`, {});
}

archiveCourse(id: number): Observable<any> {
  return this.http.put(`${this.baseUrl}/courses/${id}/archive`,{},{ responseType: 'text' });
}
unarchiveCourse(id: number): Observable<any> {
  return this.http.put(`${this.baseUrl}/courses/${id}/unarchive`, {});
}
filterCourses(params: any): Observable<any> {
  return this.http.get(`${this.baseUrl}/courses/filter`, { params });
}

getCourseAuditLogs(id: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/courses/${id}/audit`);
}


getFlaggedReviews(): Observable<any[]> {
  const token = localStorage.getItem('token');  // Or wherever you store the token
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.get<any[]>(`${this.baseUrl}/reviews/flagged`, { headers });
}


getCourseReviews(courseId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/courses/${courseId}/reviews`);
}

deleteReview(id: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/reviews/${id}`);
}

flagReview(id: number): Observable<any> {
  return this.http.put(`${this.baseUrl}/reviews/${id}/flag`, {});
}

// Categories
getAllCategories(): Observable<any[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.get<any[]>(`${this.baseUrl}/categories`, { headers });
}


createCategory(category: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/categories`, category);
}

updateCategory(id: number, category: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/categories/${id}`, category);
}

deleteCategory(id: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/categories/${id}`);
}

deleteCourse(id: number) {
  return this.http.delete(`${this.baseUrl}/courses/${id}/delete`,{ responseType: 'text' });
}

assignFaculty(courseId: number, userName: string) {
  return this.http.put(`${this.baseUrl}/courses/${courseId}/assign?userName=${userName}`, {});
}
// Internships
getAllInternships(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/internships`);
}

getFlaggedInternships(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/internships/flagged`);
}

updateInternshipStatus(id: number, status: string): Observable<any> {
  return this.http.put(`${this.baseUrl}/internships/${id}/status?status=${status}`, {});
}

deleteInternship(id: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/internships/${id}`,{ responseType: 'text' as 'json' });
}

// Jobs
getAllJobs(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/jobs`);
}

getFlaggedJobs(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/jobs/flagged`);
}

updateJobStatus(id: number, status: string): Observable<any> {
  return this.http.put(`${this.baseUrl}/jobs/${id}/status?status=${status}`, {});
}

deleteJob(id: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/jobs/${id}`,{ responseType: 'text' as 'json' });
}
//Analytics
getAnalyticsDashboard(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/analytics`);
  }

  //reports
  getReports() {
  return this.http.get<any[]>(`${this.baseUrl}/reports`);
}

resolveReport(id: number) {
  return this.http.put(`${this.baseUrl}/reports/${id}/resolve`, {});
}

submitReport(report: { reportedBy: string, reason: string }) {
  return this.http.post(`${this.baseUrl}/report`, report);
}
//notifications
getAllNotifications(page: number, size: number): Observable<{content: AdminNotification[], totalPages: number }> {
    return this.http.get<{ content: AdminNotification[], totalPages: number }>(`${this.baseUrl}/notifications?page=${page}&size=${size}`);
  }
 getUnreadNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/notifications/unread`);
  }
   getUnresolvedNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/notifications/unresolved`);
  }
  getByPriority(priority: string): Observable<AdminNotification[]> {
    return this.http.get<AdminNotification[]>(`${this.baseUrl}/notifications/priority/${priority}`);
  }

  getByType(type: string): Observable<AdminNotification[]> {
    return this.http.get<AdminNotification[]>(`${this.baseUrl}/notifications/type/${type}`);
  }

  markNotificationAsRead(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/notifications/${id}/read`, {});
  }
  markAllNotificationAsRead() {
    return this.http.put(`${this.baseUrl}/notifications/read-all`, {});
  }
  resolveNotification(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/notifications/${id}/resolve`, {});
  }


   createNotification(notification: {
    type: string,
    title: string,
    message: string,
    priority: string,
    referenceId: number
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/notifications`, notification);
  }

  deleteNotification(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/notifications/${id}`, { responseType: 'text' });
  }

 deleteAllNotifications(): Observable<any> {
  return this.http.delete(`${this.baseUrl}/notifications/deleteAll`);
}

resolveAllNotifications(): Observable<any> {
  return this.http.put(`${this.baseUrl}/notifications/resolve-all`, {});
}
 
  //profile service for admin
  getProfile(): Observable<AdminProfile> {
    return this.http.get<AdminProfile>(`${this.baseUrl}/profile`);
  }

  updateProfile(formData: FormData): Observable<AdminProfile> {
  const token = localStorage.getItem('token'); 
  const headers = {
    'Authorization': `Bearer ${token}`
  };
  return this.http.post<AdminProfile>(`${this.baseUrl}/profile`, formData, { headers });
}

}

