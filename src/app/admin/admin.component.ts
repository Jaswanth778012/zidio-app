import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { UserAuthService } from '../_services/user-auth.service';
import { AdminService } from '../_services/admin.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  
})
export class AdminComponent implements OnInit{
  message: any;
  role: any;
  userName!: string | null;
 unreadCount: number = 0;



  constructor(private userService: UserService, private userAuthService: UserAuthService, private adminService: AdminService, private router: Router) { }
  

  ngOnInit(): void {
    // Initialization logic can go here
    this.forAdmin();
    this.userName = this.userAuthService.getUsername();
  this.role = this.userAuthService.getRoles();
  this.loadUnreadCount();
  }

  async ngAfterViewInit() {
    const Dropdown = (await import('bootstrap/js/dist/dropdown')).default;

    const dropdownToggle = document.getElementById('dropdownMenuButton');
    if (dropdownToggle) {
      new Dropdown(dropdownToggle);
    }
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

 public logout()
  {
    this.userAuthService.clear();
    this.router.navigate(['/']);
  }

  
}