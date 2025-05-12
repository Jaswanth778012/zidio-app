import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAuthService } from './user-auth.service';


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

 // REGISTER - for User role
  public registerUser(userData: any) {
    const params = new HttpParams().set('roleName', 'User');
    return this.httpClient.post(this.PATH_VARIABLE_API + '/registerNewUser', userData, { headers: this.requestHeader, params });
  }

  // REGISTER - for Employer role
  public registerEmployer(userData: any) {
    const params = new HttpParams().set('roleName', 'Employer');
    return this.httpClient.post(this.PATH_VARIABLE_API + '/registerNewUser', userData, { headers: this.requestHeader, params });
  }

  public updatePassword(data: any) {
  return this.httpClient.put(this.PATH_VARIABLE_API+'/updatePassword', data, {
    responseType: 'text',
    headers: new HttpHeaders({ 'No-Auth': 'True' }) // Assuming this endpoint does not require login
  });
}


  public forUser(){
    return this.httpClient.get(this.PATH_VARIABLE_API+'/forUser', {
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
  public roleMatch(allowedRoles: any): boolean {
    let isMatch = false;
    const userRoles: any = this.userAuthService.getRoles();
    if (userRoles != null && userRoles) {
      for (let i = 0; i < userRoles.length; i++) {
        for (let j = 0; j < allowedRoles.length; j++) {
          if (userRoles[i].roleName === allowedRoles[j]) {
            isMatch = true;
            return isMatch;
          }
        }
      }
    }
    return isMatch;
  }

}

