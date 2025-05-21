import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { UserAuthService } from '../_services/user-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {

  message: any;
  role: any;
  userName!: string | null;
  constructor(private userService: UserService,private userAuthService: UserAuthService, private router : Router) { }

  ngOnInit(): void {
    // Initialization logic can go here
    this.userName = this.userAuthService.getUsername();
    this.forUser();
  }

  // Add any additional methods or properties needed for the UserComponent

  // Example method
  forUser(){
    this.userService.forStudent().subscribe(
      (response: any) => {
        console.log(response);
        this.message = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

   public logout()
  {
    this.userAuthService.clear();
    this.router.navigate(['/']);
  }
}
