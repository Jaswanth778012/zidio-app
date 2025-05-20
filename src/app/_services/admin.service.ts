import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminProfile } from '../_model/admin-profile.model';

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
    return this.http.put(`${this.baseUrl}/users/${userName}/status?status=${status}`, {});
  }

  resetUserPassword(userName: string, newPassword: string) {
    return this.http.put(`${this.baseUrl}/users/${userName}/reset-password?newPassword=${newPassword}`, {});
  }

  getAllEmployers() {
  return this.http.get<any[]>(`${this.baseUrl}/employers`);
}

updateEmployerStatus(username: string, status: string) {
  return this.http.put(`${this.baseUrl}/employers/${username}/status?status=${status}`, {});
}
resetEmployerPassword(userName: string, newPassword: string) {
    return this.http.put(`${this.baseUrl}/employers/${userName}/reset-password?newPassword=${newPassword}`, {});
  }

  getAllStudents() {
  return this.http.get<any[]>(`${this.baseUrl}/students`);
}

updateStudentStatus(userName: string, status: string) {
  return this.http.put(`${this.baseUrl}/students/${userName}/status?userStatus=${status}`, {});
}

resetStudentPassword(userName: string, newPassword: string) {
  return this.http.put(`${this.baseUrl}/students/${userName}/reset-password?newPassword=${newPassword}`, {});
}

//courses
getAllCourses(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/courses`);
}

addCourse(courseRequest :any): Observable<any> {
  return this.http.post(`${this.baseUrl}/courses`,courseRequest);
}

updateCourse(id: number, courseUpdateRequest: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/courses/${id}`,courseUpdateRequest);
}

updateCourseStatus(id: number, status: string): Observable<any> {
  return this.http.put(`${this.baseUrl}/courses/${id}/status?status=${status}`, {});
}

toggleCourseVisibility(id: number, active: boolean): Observable<any> {
  return this.http.put(`${this.baseUrl}/courses/${id}/visibility?active=${active}`, {});
}

archiveCourse(id: number): Observable<any> {
  return this.http.put(`${this.baseUrl}/courses/${id}/archive`,null);
}

filterCourses(params: any): Observable<any> {
  return this.http.get(`${this.baseUrl}/courses/filter`, { params });
}

getCourseAuditLogs(id: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/courses/${id}/audit`);
}

getFlaggedReviews(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/reviews/flagged`);
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
  return this.http.get<any[]>(`${this.baseUrl}/categories`);
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
  return this.http.delete(`${this.baseUrl}/internships/${id}`);
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
  return this.http.delete(`${this.baseUrl}/jobs/${id}`);
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
getAllNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/notifications`);
  }
 getUnreadNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/notifications/unread`);
  }
   getUnresolvedNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/notifications/unresolved`);
  }
  markNotificationAsRead(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/notifications/${id}/read`, {});
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

  //profile service for admin
  getProfile(): Observable<AdminProfile> {
    return this.http.get<AdminProfile>(`${this.baseUrl}`);
  }

  updateProfile(formData: FormData): Observable<AdminProfile> {
    return this.http.post<AdminProfile>(`${this.baseUrl}`, formData);
  }
}

