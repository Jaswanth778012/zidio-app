import { Component } from '@angular/core';
import { SendMessageRequest } from '../../_model/message.model';
import { AdminService } from '../../_services/admin.service';
import { UserAuthService } from '../../_services/user-auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admincompose',
  templateUrl: './admincompose.component.html',
  styleUrl: './admincompose.component.css'
})
export class AdmincomposeComponent {
message: SendMessageRequest = {
    recipientUserName: '',
    subject: '',
    body: ''
  };

  constructor(private adminService: AdminService, private userAuthService: UserAuthService,private snackBar: MatSnackBar ){}

  sendMessage(){
    const sender = this.userAuthService.getUsername();
    console.log('sendas: ',sender);

     this.adminService.sendMessage(this.message).subscribe({
      next: () => {
        this.snackBar.open('Message sent successfully!', 'Close', { duration: 3000 });
        this.message = { recipientUserName: '', subject: '', body: '' };
      },
      error: () => {
        this.snackBar.open('Failed to send message.', 'Close', { duration: 3000 });
      }
    });
  }
}
