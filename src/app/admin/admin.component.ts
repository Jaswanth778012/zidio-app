import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { UserAuthService } from '../_services/user-auth.service';
import { AdminService } from '../_services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  message: any;
  role: any;
  userName!: string | null;
 unreadCount: number = 0;

  constructor(private userService: UserService, private authService: UserAuthService, private adminService: AdminService) { }
  

  ngOnInit(): void {
    // Initialization logic can go here
    this.forAdmin();
    this.userName = this.authService.getUsername();
  this.role = this.authService.getRoles();
  this.loadUnreadCount();
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
loadUnreadCount(): void {
  this.adminService.getUnreadNotifications().subscribe(data => {
    this.unreadCount = data.length;
  });
}
}