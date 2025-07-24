import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { StudentProfile } from '../_model/student-profile.model';
import { Message, PaginatedMessageResponse, SendMessageRequest } from '../_model/message.model';
import { CourseReview } from '../_model/reviewes.model';
import { UserAuthService } from './user-auth.service';
import { Application } from '../_model/Application.model';
import { ApplicationQuestion } from '../_model/applicationQuestion.model';
import { CourseEnrollment } from '../_model/courseEnrollment.model';
import { CalendarEvent } from '../_model/CalendarEvent.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
   private baseUrl = 'http://localhost:8080/student';
  
    constructor(private http: HttpClient, private userAuthService: UserAuthService) {}
  //profile for student
    getProfile(): Observable<StudentProfile> {
        return this.http.get<StudentProfile>(`${this.baseUrl}/profile`);
    }

    updateProfile(formData: FormData): Observable<StudentProfile>{
      const token = localStorage.getItem('token'); 
  const headers = {
    'Authorization': `Bearer ${token}`
  };
    return this.http.post<StudentProfile>(`${this.baseUrl}/profile`, formData, { headers });
    }

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
    getJobById(id: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/jobs/${id}`);
    }

    getInternshipById(id: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/internships/${id}`);
    }

     getEnrollmentForCourse(id: number): Observable<CourseEnrollment> {
    return this.http.get<CourseEnrollment>(`${this.baseUrl}/courseEnroll/${id}`);
  }
    markVideoWatched(videoId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/courseProgress/update/${videoId}`,{}  // body is empty—your endpoint reads only the path + principal
    );
  }

    getDashboardCounts(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/counts`);
  }




    //for courses
    getCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/courses`);
  }

  enrollInFreeCourse(courseId: number): Observable<string> {
    return this.http.post(`${this.baseUrl}/apply/course/${courseId}`, {}, { responseType: 'text' });
  }

  enrollInPaidCourse(courseId: number): Observable<string> {
    return this.http.post(`${this.baseUrl}/apply/course/paid/${courseId}`, {}, { responseType: 'text' });
  }

  verifyPayment(orderId: string, paymentId: string, signature: string) {
  const token = this.userAuthService.getToken();
  console.log('Token sent to backend:', token); // <-- Add this
  const params = { orderId, paymentId, signature };
  return this.http.post(`${this.baseUrl}/verify-payment`, null, {
    params,
    headers: {
      Authorization: `Bearer ${token}`
    },
    responseType: 'text'
  });
}


  //reviewsa
  submitReview(courseId: number, rating: number, comment: string): Observable<CourseReview> {
    const params = new HttpParams()
      .set('rating', rating)
      .set('comment', comment);
    return this.http.post<CourseReview>(`${this.baseUrl}/course/${courseId}`, null, { params });
  }

  //Apply
   applyForJob(jobId: number, formData: FormData): Observable<any> {
  return this.http.post(`${this.baseUrl}/apply/job/${jobId}`, formData,{ responseType: 'text' })
    .pipe(catchError(this.handleError));
}


  applyForInternship(internshipId: number, formData: FormData): Observable<any> {
  return this.http.post(`${this.baseUrl}/apply/internship/${internshipId}`, formData,{ responseType: 'text' })
    .pipe(catchError(this.handleError));
}

  private handleError(error: HttpErrorResponse): Observable<never> {
  let errorMsg: string;

  if (typeof error.error === 'string') {
    // Backend returned a plain text error message
    errorMsg = error.error;
  } else if (error.error instanceof ProgressEvent) {
    errorMsg = 'Network error';
  } else {
    errorMsg = error.error?.message || 'An unknown error occurred';
  }

  console.error('ApplicationService error', error);
  return throwError(() => errorMsg);
}

  getApplicationQuestionsByJobId(jobId: number) {
  return this.http.get<ApplicationQuestion[]>(`${this.baseUrl}/jobs/${jobId}/questions`);
  }

  getApplicationQuestionsByInternshipId(internshipId: number) {
    return this.http.get<ApplicationQuestion[]>(`${this.baseUrl}/internships/${internshipId}/questions`);
  }

   getMyCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/my-courses`);
  }

  getAppliedJobs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/applied-jobs`);
  }

  getAppliedInternships(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/applied-internships`);
  }

  getAllApplicationsForStudent() {
  return this.http.get<Application[]>(`${this.baseUrl}/application/all`);
  }


  //progress
  updateCourseProgress(videoId: number): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/courseProgress/update/${videoId}`, {});
  }

  //calendar events
   getEvents(): Observable<CalendarEvent[]> {
        return this.http.get<CalendarEvent[]>(`${this.baseUrl}/s/calendar/events`);
      }
    
      getEvent(id: number): Observable<CalendarEvent> {
        return this.http.get<CalendarEvent>(`${this.baseUrl}/s/calendar/event/${id}`);
      }
    
      createEvent(event: CalendarEvent): Observable<{ message: string, event: CalendarEvent }> {
        return this.http.post<{ message: string, event: CalendarEvent }>(`${this.baseUrl}/s/calendar/event`, event);
      }
    
      updateEvent(id: number, event: CalendarEvent): Observable<{ message: string, event: CalendarEvent }> {
        return this.http.put<{ message: string, event: CalendarEvent }>(`${this.baseUrl}/s/calendar/event/${id}`, event);
      }
    
      deleteEvent(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/s/calendar/event/${id}`);
      }
    
      getUpcomingEvents(): Observable<CalendarEvent[]> {
        return this.http.get<CalendarEvent[]>(`${this.baseUrl}/s/calendar/upcoming`);
      }

}
