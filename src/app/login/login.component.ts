import { Component, NgZone, OnInit } from '@angular/core';
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

  private clientId = '181632395519-odqfq1ej324o6knjpms32sug8mlm2tcg.apps.googleusercontent.com';

  constructor(public userService: UserService, private userAuthService: UserAuthService, private router: Router,private ngZone: NgZone) { }

  ngOnInit(): void {
    // Initialization logic here
    // this.initializeGoogleSignIn();
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

// initializeGoogleSignIn() {
//     // Wait for the Google API to load
//     window.onload = () => {
//       // @ts-ignore
//       google.accounts.id.initialize({
//         client_id: this.clientId,
//         callback: (response: any) => this.handleCredentialResponse(response),
//       });

//       // Render the Google Sign-In button
//       // @ts-ignore
//       google.accounts.id.renderButton(
//         document.getElementById('google-signin-button'),
//         { theme: 'outline', size: 'large' }  // customization
//       );

//       // Optionally prompt the user to select account
//       // @ts-ignore
//       google.accounts.id.prompt();
//     };
//   }

//   handleCredentialResponse(response: any) {
//     // This function is called after the user signs in successfully
//     // response.credential is the JWT token you can send to your backend
//     this.ngZone.run(() => {
//       console.log('Encoded JWT ID token: ' + response.credential);

//       // Decode token or send it to backend for verification and user login
//       // Example: send token to your API
//       this.router.navigate(['/student'])
//     });
//   }
}