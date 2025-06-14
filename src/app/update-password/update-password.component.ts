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
  showCurrentPassword = false;
showNewPassword = false;
showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService, private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      userName: ['', Validators.required],
      currentPassword:['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required, Validators.minLength(6)]]
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
  togglePasswordVisibility(field: 'current' | 'new' | 'confirm') {
  if (field === 'current') this.showCurrentPassword = !this.showCurrentPassword;
  if (field === 'new') this.showNewPassword = !this.showNewPassword;
  if (field === 'confirm') this.showConfirmPassword = !this.showConfirmPassword;
}

get passwordMismatch(): boolean {
  const newPass = this.forgotPasswordForm.get('newPassword')?.value;
  const confirmPass = this.forgotPasswordForm.get('confirmNewPassword')?.value;
  return newPass && confirmPass && newPass !== confirmPass;
}
}
