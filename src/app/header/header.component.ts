import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../_services/user-auth.service';
import { Router } from '@angular/router';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
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

}
