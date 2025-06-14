import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../_services/user.service';
import { UserAuthService } from '../_services/user-auth.service';
import { Router } from '@angular/router';
import { UserManagementComponent } from '../admin/user-management/user-management.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginError: string = '';
  isLoading: boolean = false;
  showPassword = false;
  constructor(public userService: UserService, private userAuthService: UserAuthService, private router: Router) { }

  ngOnInit(): void {
    // Initialization logic here
  }


       login(loginForm: NgForm) {
    if (!loginForm.valid) {
      this.loginError = 'Please fill in all required fields.';
      return;
    }

    this.isLoading = true;
    this.loginError = '';

    this.userService.login(loginForm.value).subscribe(
      (response: any) => {
        this.isLoading = false;
        console.log('Full login response:', JSON.stringify(response, null, 2));

        const rawRoles = response.role;
        const userName = response.userName;
        let roles = [];

        if (Array.isArray(rawRoles)) {
          roles = rawRoles;
        } else if (rawRoles && typeof rawRoles === 'object') {
          roles = [rawRoles];
        } else if (typeof rawRoles === 'string') {
          roles = [{ roleName: rawRoles }];
        }

        const token = response.jwtToken;
        if (!token) {
          this.loginError = 'Login failed: Missing token.';
          return;
        }

        
        this.userAuthService.setToken(token);
        this.userAuthService.setRoles(roles.map(role => role.roleName));
        this.userAuthService.setUsername(userName);

       
        const roleName = roles.length > 0 ? roles[0].roleName : null;

        switch (roleName) {
          case 'Admin':
            this.router.navigate(['/admin']);
            break;
          case 'Employer':
            this.router.navigate(['/employer']);
            break;
          case 'Student':
            this.router.navigate(['/student']);
            break;
          default:
            this.loginError = 'Login failed: Unknown role.';
            break;
        }
      },
      (error: any) => {
        this.isLoading = false;
        console.error('Login failed:', error);
        this.loginError = error?.error?.message || 'Invalid credentials. Please try again.';
      }
    );
  }
  toggleShowPassword(): void {
  this.showPassword = !this.showPassword;
}
}