import { HttpClient, HttpHeaders } from '@angular/common/http';
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
