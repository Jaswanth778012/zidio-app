import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor() { }

  public setRoles(roles: any[])
  {
    localStorage.setItem("roles", JSON.stringify(roles));
  }

  public getRoles() : string[]
  {
    return JSON.parse(localStorage.getItem("roles") || '[]');
  }

  public setToken(jwtToken: string)
  {
    localStorage.setItem("jwtToken", jwtToken);
  }

  public getToken() : string | null
  {
    return localStorage.getItem("jwtToken");
  }

  public clear()
  {
    localStorage.clear();
  }

  public isLoggedIn(): boolean
  {
    const token = this.getToken();
    return token !== null && token.trim() !== '';
  }

  }

