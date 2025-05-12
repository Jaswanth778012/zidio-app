import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { UserAuthService } from "../_services/user-auth.service";
import { Injectable } from '@angular/core';
import { Token } from "@angular/compiler";
import { Router } from "@angular/router";
@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    
    constructor(private userAutheService: UserAuthService,private router:Router) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(req.headers.get("No-Auth") === "True"){
            return next.handle(req);
        }
        const token = this.userAutheService.getToken();
        if (token) {
            req = this.addToken(req, token);
        } else {
            console.error("Token is null or undefined");
        }
        return next.handle(req).pipe(
            catchError(
                (err:HttpErrorResponse) => {
                console.log(err.status);
                if (err.status === 401) {
                    this.router.navigate(['/login']);
                }else if (err.status === 403) {
                    this.router.navigate(['/forbidden']);
                }
                return throwError("some thing is wrong");
            })
        );
    }
    
    private addToken(req: HttpRequest<any>, token: string) {
        return req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
}
}


