import { Component,HostListener, OnInit , ViewChild} from '@angular/core';
import { UserAuthService } from '../_services/user-auth.service';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { UserService } from '../_services/user.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AdminService } from '../_services/admin.service';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver,Breakpoints } from '@angular/cdk/layout';
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
  isSmallScreen: boolean = false;
  sidebarOpen = false;
  isDesktop = true;
   unreadCount: number = 0;
   loading = false;
     @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(private userAuthService: UserAuthService, private router: Router,public userService: UserService,private adminService: AdminService,private breakpointObserver: BreakpointObserver) {
    this.router.events.subscribe(event => {
    if (event instanceof NavigationStart) {
      this.loading = true;
    } else if (
      event instanceof NavigationEnd ||
      event instanceof NavigationCancel ||
      event instanceof NavigationError
    ) {
      setTimeout(() => this.loading = false, 300); // optional delay
    }
  });
   }

  ngOnInit(): void {
    // Initialization logic here
     this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
         this.isSmallScreen = result.matches;
      this.isDesktop = !result.matches;
      if (!this.isDesktop) {
        this.sidebarOpen = false;
      }
      });
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
