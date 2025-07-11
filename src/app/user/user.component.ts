import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { UserAuthService } from '../_services/user-auth.service';
import { Router } from '@angular/router';
import { StudentService } from '../_services/student.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {

  message: any;
  role: any;
  userName!: string | null;
  profilePictureUrl: string = 'assets/admin.png'; // Default image URL
  constructor(private userService: UserService,private userAuthService: UserAuthService, private router : Router,private studentService: StudentService) { }

  ngOnInit(): void {
    // Initialization logic can go here
    this.userName = this.userAuthService.getUsername();
    this.forUser();

    this.studentService.getProfile().subscribe(profile =>{
      if(profile.profilePictureUrl){
        this.profilePictureUrl = profile.profilePictureUrl;
      }
    })
  }
  async ngAfterViewInit() {
    const Dropdown = (await import('bootstrap/js/dist/dropdown')).default;

    const dropdownToggle = document.getElementById('dropdownMenuButton');
    if (dropdownToggle) {
      new Dropdown(dropdownToggle);
    }
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
