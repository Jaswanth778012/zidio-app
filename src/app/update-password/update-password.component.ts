import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../_services/user.service';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent {
  forgotPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService, private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      userName: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const formData = this.forgotPasswordForm.value;

      this.userService.updatePassword(formData).subscribe({
        next: () => {
          alert('Password updated successfully!');
          this.forgotPasswordForm.reset();
          this.router.navigate(['/login']);
        },
        error: (err: any) => {
          console.error(err);
          alert('Error updating password!');
        }
      });
    }
  }
}
