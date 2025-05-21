import { Component,HostListener, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { UserAuthService } from '../_services/user-auth.service';
import { AdminService } from '../_services/admin.service';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  animations: [
    trigger('sidebarState', [
      state('open', style({ transform: 'translateX(0%)' })),
      state('closed', style({ transform: 'translateX(-100%)' })),
      transition('open <=> closed', animate('300ms ease-in-out'))
    ])
  ]
  
})
export class AdminComponent implements OnInit{
  message: any;
  role: any;
  userName!: string | null;
 unreadCount: number = 0;
  profilePictureUrl: string = 'assets/admin.png'; 


  constructor(private userService: UserService, private userAuthService: UserAuthService, private adminService: AdminService, private router: Router) { }
  

  ngOnInit(): void {
    // Initialization logic can go here
    this.forAdmin();
    this.userName = this.userAuthService.getUsername();
  this.role = this.userAuthService.getRoles();
  this.loadUnreadCount();
  this.onResize();

  this.adminService.getProfile().subscribe(profile => {
    console.log('Profile:', profile);
    if (profile.profilePictureUrl) {
      this.profilePictureUrl = `http://localhost:8080${profile.profilePictureUrl}`;
    }
  });
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

  sidebarOpen = true;
  isDesktop = true;

  @HostListener('window:resize', [])
  onResize() {
    this.isDesktop = window.innerWidth > 768;
    if (!this.isDesktop) {
      this.sidebarOpen = false;
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
  
