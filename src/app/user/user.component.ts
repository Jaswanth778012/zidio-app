import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {

  message: any;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    // Initialization logic can go here
    this.forUser();
  }

  // Add any additional methods or properties needed for the UserComponent

  // Example method
  forUser(){
    this.userService.forUser().subscribe(
      (response: any) => {
        console.log(response);
        this.message = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
