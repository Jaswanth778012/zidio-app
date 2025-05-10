import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  message: any;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    // Initialization logic can go here
    this.forAdmin();
  }

  forAdmin(){
    this.userService.forAdmin().subscribe(
      (response: any) => {
        console.log(response);
        this.message = response;
      },
      (error: any) => {
        console.log(error);
      }
    );

  // Add any additional methods or properties needed for the AdminComponent

}
}
