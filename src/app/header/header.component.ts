import { Component,HostListener, OnInit } from '@angular/core';
import { UserAuthService } from '../_services/user-auth.service';
import { Router } from '@angular/router';
import { UserService } from '../_services/user.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  animations: [
      trigger('sidebarState', [
        state('open', style({ transform: 'translateX(0%)' })),
        state('closed', style({ transform: 'translateX(-100%)' })),
        transition('open <=> closed', animate('300ms ease-in-out'))
      ])
    ]
})
export class HeaderComponent implements OnInit {
  sidebarOpen = false;
  isDesktop = true;
   unreadCount: number = 0;
  
    @HostListener('window:resize', [])
    onResize() {
      this.isDesktop = window.innerWidth > 768;
      if (!this.isDesktop) {
        this.sidebarOpen = false;
      }
    }
  constructor(private userAuthService: UserAuthService, private router: Router,public userService: UserService) { }

  ngOnInit(): void {
    // Initialization logic here
  }

  // Add any methods or properties needed for the header component
  public isLoggedIn() {
    return this.userAuthService.isLoggedIn();
  }

  public logout()
  {
    this.userAuthService.clear();
    this.router.navigate(['/']);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

}
