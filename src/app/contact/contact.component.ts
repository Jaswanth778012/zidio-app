import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../_services/user.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  constructor(private userService: UserService, private snackBar: MatSnackBar) {}

  onSubmit(form: NgForm) {
  if (form.invalid) return;

  this.userService.sendContactMessage(this.formData).subscribe({
    next: (res) => {
      this.snackBar.open(res?.message || 'Message sent successfully!', 'Close', { duration: 3000 });
      form.resetForm();
      this.formData = { name: '', email: '', subject: '', message: '' }; // Clear formData explicitly
    },
    error: (err) => {
      this.snackBar.open('Failed to send message. Please try again.', 'Close', { duration: 3000 });
      console.error('Error:', err);
    }
  });
}

}
