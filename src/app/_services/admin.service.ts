import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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


getAllCourses(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/courses`);
}

addCourse(name: string) {
  return this.http.post(`${this.baseUrl}/courses?courseName=${name}`, {});
}

updateCourse(id: number, name: string) {
  return this.http.put(`${this.baseUrl}/courses/${id}?courseName=${name}`, {});
}

deleteCourse(id: number) {
  return this.http.delete(`${this.baseUrl}/courses/${id}`);
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

}
