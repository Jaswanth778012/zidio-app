import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../_services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  
  ngOnInit(): void {
    // Initialization logic can go here
  }
  
  registerForm!: FormGroup;
  role: string = 'Student'; // Default role

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      userFirstName: ['', Validators.required],
      userLastName: ['', Validators.required],
      userPassword: ['', [Validators.required, Validators.minLength(6)]],
      role: ['Student'] // role selector
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const formValue = this.registerForm.value;
    const userPayload = {
      userName: formValue.userName,
      userFirstName: formValue.userFirstName,
      userLastName: formValue.userLastName,
      userPassword: formValue.userPassword
    };

    if (formValue.role === 'Student') {
      this.userService.registerUser(userPayload).subscribe({
        next: (res) => {
          alert('Student registered successfully!'),
          this.router.navigate(['/login']);
        },
        error: (err) => alert('Registration failed: ' + err.error.message)
      });
    } else if (formValue.role === 'Employer') {
      this.userService.registerEmployer(userPayload).subscribe({
        next: (res) => {
          alert('Employer registered successfully!'),
          this.router.navigate(['/login']);
        },
        error: (err) => alert('Registration failed: ' + err.error.message)
      });
    }
  }
}

