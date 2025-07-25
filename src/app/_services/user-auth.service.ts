import {  Inject, Injectable, PLATFORM_ID  } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { co } from '@fullcalendar/core/internal-common';
@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private isBrowser: boolean;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  public setRoles(roles: any[])
  {
    if (this.isBrowser) {
      localStorage.setItem("roles", JSON.stringify(roles));
    }
  }

  public getRoles() : string[]
  {
   if (!this.isBrowser) {
      return [];
    }
  const storedRoles = localStorage.getItem('roles');

  // Reject literal string "undefined" or empty
  if (!storedRoles || storedRoles === 'undefined') {
    return [];
  }

  try {
    return JSON.parse(storedRoles);
  } catch (error) {
    console.error('Failed to parse roles from localStorage:', error);
    return [];
  }
  }

  public setToken(jwtToken: string)
  {
    if (this.isBrowser) {
      localStorage.setItem("jwtToken", jwtToken);
    }
  }

  public getToken() : string | null
  {
    if (this.isBrowser) {
       const token = localStorage.getItem("jwtToken");
      return token;
    }
    return null;
  }

  public setUsername(userName: string): void {
    if (this.isBrowser) {
      localStorage.setItem('username', userName);
    }
  }

  public getUsername(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('username');
    }
    return null;
  }

  public clear(): void {
    if (this.isBrowser) {
      localStorage.removeItem('roles');
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('username');
    }
  }

  public getRole(): string {
    const roles = this.getRoles();
    return roles.length > 0 ? roles[0] : '';
  }

  public isLoggedIn(): boolean
  {
    const token = this.getToken();
    return token !== null && token.trim() !== '';
  }


  }

