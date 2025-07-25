import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAuthService } from './user-auth.service';
import { Observable } from 'rxjs';
import { CourseReview } from '../_model/reviewes.model';
import { VideoContent } from '../_model/video-content.model';
import { Syllabus } from '../_model/syllabus.model';
import { CourseEnrollment } from '../_model/courseEnrollment.model';
import { CalendarEvent } from '../_model/CalendarEvent.model';
import { Contact } from '../_model/Contact.model';
import { TeamMember } from '../_model/TeamMember.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  PATH_VARIABLE_API = 'http://localhost:8080';

  requestHeader = new HttpHeaders({ 'No-Auth': 'True' }); //dont require any authentication

  constructor(private httpClient: HttpClient, private userAuthService: UserAuthService) { }

  public login(loginData: any) { //fetch the data from the login form
    return this.httpClient.post(this.PATH_VARIABLE_API+'/authenticate', loginData, { headers: this.requestHeader });
  }

 // REGISTER - for Student role
  public registerUser(userData: any) {
    const params = new HttpParams().set('roleName', 'Student');
    return this.httpClient.post(this.PATH_VARIABLE_API + '/auth/registerNewUser', userData, { headers: this.requestHeader, params });
  }

  // REGISTER - for Employer role
  public registerEmployer(userData: any) {
    const params = new HttpParams().set('roleName', 'Employer');
    return this.httpClient.post(this.PATH_VARIABLE_API + '/auth/registerNewUser', userData, { headers: this.requestHeader, params });
  }

  // public registerAdmin(userData: any) {
  //   const params = new HttpParams().set('roleName', 'Admin');
  //   return this.httpClient.post(this.PATH_VARIABLE_API + '/registerNewUser', userData, { headers: this.requestHeader, params });
  // }

  public updatePassword(data: any) {
  return this.httpClient.put(this.PATH_VARIABLE_API+'/auth/updatePassword', data, {
    responseType: 'text',
    headers: new HttpHeaders({ 'No-Auth': 'True' }) // Assuming this endpoint does not require login
  });
}

  getCourses(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.PATH_VARIABLE_API}/auth/courses`);
  }


  public forStudent(){
    return this.httpClient.get(this.PATH_VARIABLE_API+'/forStudent', {
      responseType: 'text',
    });
  }
  public forAdmin(){
    return this.httpClient.get(this.PATH_VARIABLE_API+'/forAdmin', {
      responseType: 'text',
    });
  }
  public forEmployer(){
    return this.httpClient.get(this.PATH_VARIABLE_API+'/forEmployer', {
      responseType: 'text',
    });
  }
   public roleMatch(allowedRoles: string[]): boolean {
    const userRoles: string[] = this.userAuthService.getRoles(); // Returns ["Admin"], ["Employer"], etc.

    if (!userRoles || userRoles.length === 0) {
      return false;
    }

    return allowedRoles.some(role => userRoles.includes(role));
  }

  getCourseReviews(id: number): Observable<CourseReview[]> {
    return this.httpClient.get<CourseReview[]>(`${this.PATH_VARIABLE_API}/auth/${id}`);
  }

  getAverageRating(id: number): Observable<number> {
    return this.httpClient.get<number>(`${this.PATH_VARIABLE_API}/auth/${id}/averageRating`);
  }

  getCourseById(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.PATH_VARIABLE_API}/auth/courses/${id}`);
  }

  //internships
  getAllInternships(): Observable<any[]> {
  return this.httpClient.get<any[]>(`${this.PATH_VARIABLE_API}/auth/internships`);
  }

  getAllJobs(): Observable<any[]> {
  return this.httpClient.get<any[]>(`${this.PATH_VARIABLE_API}/auth/jobs`);
  }

  getJobById(id: number): Observable<any> {
  return this.httpClient.get<any>(`${this.PATH_VARIABLE_API}/auth/jobs/${id}`);
    }

    getInternshipById(id: number): Observable<any> {
  return this.httpClient.get<any>(`${this.PATH_VARIABLE_API}/auth/internships/${id}`);
}

  //video-content
  getVideoBySyllabusId(syllabusId: number): Observable<VideoContent[]> {
      return this.httpClient.get<VideoContent[]>(`${this.PATH_VARIABLE_API}/auth/video-content/${syllabusId}`);
    }

  getSyllabusByCourseId(courseId: number): Observable<Syllabus[]> {
        return this.httpClient.get<Syllabus[]>(`${this.PATH_VARIABLE_API}/auth/course/${courseId}`);
  }

  getEnrollmentForCourse(id: number): Observable<CourseEnrollment> {
      return this.httpClient.get<CourseEnrollment>(`${this.PATH_VARIABLE_API}/auth/courseEnroll/${id}`);
    }

  //Calendar Events
  getEvents(): Observable<CalendarEvent[]> {
      return this.httpClient.get<CalendarEvent[]>(`${this.PATH_VARIABLE_API}/s/calendar/events`);
    }
  
    getEvent(id: number): Observable<CalendarEvent> {
      return this.httpClient.get<CalendarEvent>(`${this.PATH_VARIABLE_API}/s/calendar/event/${id}`);
    }
  
    createEvent(event: CalendarEvent): Observable<{ message: string, event: CalendarEvent }> {
      return this.httpClient.post<{ message: string, event: CalendarEvent }>(`${this.PATH_VARIABLE_API}/s/calendar/event`, event);
    }
  
    updateEvent(id: number, event: CalendarEvent): Observable<{ message: string, event: CalendarEvent }> {
      return this.httpClient.put<{ message: string, event: CalendarEvent }>(`${this.PATH_VARIABLE_API}/s/calendar/event/${id}`, event);
    }
  
    deleteEvent(id: number): Observable<void> {
      return this.httpClient.delete<void>(`${this.PATH_VARIABLE_API}/s/calendar/event/${id}`);
    }
  
    getUpcomingEvents(): Observable<CalendarEvent[]> {
      return this.httpClient.get<CalendarEvent[]>(`${this.PATH_VARIABLE_API}/s/calendar/upcoming`);
    }

    //contact
    sendContactMessage(contact: Contact): Observable<any> {
    return this.httpClient.post(`${this.PATH_VARIABLE_API}/auth/contact`, contact);
  }

  getTeam(): Observable<TeamMember[]> {
    return this.httpClient.get<TeamMember[]>(`${this.PATH_VARIABLE_API}/auth/teamMembers`);
  }

}

