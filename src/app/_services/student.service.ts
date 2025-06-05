import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
   private baseUrl = 'http://localhost:8080/student';
  
    constructor(private http: HttpClient) {}
}
