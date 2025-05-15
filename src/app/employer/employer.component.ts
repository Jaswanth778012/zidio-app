import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { UserAuthService } from '../_services/user-auth.service';

@Component({
  selector: 'app-employer',
  templateUrl: './employer.component.html',
  styleUrl: './employer.component.css'
})
export class EmployerComponent implements OnInit {

  message: any;
  role: any;
  userName!: string | null;

  constructor(private userService : UserService, private authService:UserAuthService) { }

  ngOnInit(): void {
    // Initialization logic can go here
    this.userName = this.authService.getUsername();
    this.role = this.authService.getRoles();
    this.forEmployer();
  }

  forEmployer(){
    this.userService.forEmployer().subscribe(
      (response: any) => {
        console.log(response);
        this.message = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  // Add any additional methods or properties needed for the EmployerComponent

}
}
