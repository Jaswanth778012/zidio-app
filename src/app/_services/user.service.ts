import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAuthService } from './user-auth.service';
import { Observable } from 'rxjs';
import { CourseReview } from '../_model/reviewes.model';


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
    return this.httpClient.post(this.PATH_VARIABLE_API + '/registerNewUser', userData, { headers: this.requestHeader, params });
  }

  // REGISTER - for Employer role
  public registerEmployer(userData: any) {
    const params = new HttpParams().set('roleName', 'Employer');
    return this.httpClient.post(this.PATH_VARIABLE_API + '/registerNewUser', userData, { headers: this.requestHeader, params });
  }

  // public registerAdmin(userData: any) {
  //   const params = new HttpParams().set('roleName', 'Admin');
  //   return this.httpClient.post(this.PATH_VARIABLE_API + '/registerNewUser', userData, { headers: this.requestHeader, params });
  // }

  public updatePassword(data: any) {
  return this.httpClient.put(this.PATH_VARIABLE_API+'/updatePassword', data, {
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

}

