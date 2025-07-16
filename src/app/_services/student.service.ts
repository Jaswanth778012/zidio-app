import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentProfile } from '../_model/student-profile.model';
import { Message, PaginatedMessageResponse, SendMessageRequest } from '../_model/message.model';
import { CourseReview } from '../_model/reviewes.model';
import { UserAuthService } from './user-auth.service';

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

}
