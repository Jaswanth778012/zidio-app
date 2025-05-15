import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor() { }

  public isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  public setRoles(roles: any[])
  {
    if (this.isBrowser()) {
      localStorage.setItem("roles", JSON.stringify(roles));
    }
  }

  public getRoles() : string[]
  {
   
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
    if (this.isBrowser()) {
      localStorage.setItem("jwtToken", jwtToken);
    }
  }

  public getToken() : string | null
  {
    if (this.isBrowser()) {
      return localStorage.getItem("jwtToken");
    }
    return null;
  }

  public setUsername(userName: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('username', userName);
    }
  }

  public getUsername(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('username');
    }
    return null;
  }

  public clear(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('roles');
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('username');
    }
  }

  public isLoggedIn(): boolean
  {
    const token = this.getToken();
    return token !== null && token.trim() !== '';
  }

  }

