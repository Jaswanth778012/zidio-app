import { Component } from '@angular/core';
import { SendMessageRequest } from '../../_model/message.model';
import { EmployerService } from '../../_services/employer.service';
import { UserAuthService } from '../../_services/user-auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrl: './compose.component.css'
})
export class ComposeComponent {
message: SendMessageRequest = {
    recipientUserName: '',
    subject: '',
    body: ''
  };
  
  constructor(private employerService: EmployerService, private userAuthService: UserAuthService,private snackBar: MatSnackBar ){}

  sendMessage(){
    const sender = this.userAuthService.getUsername();
    console.log('sendas: ',sender);

     this.employerService.sendMessage(this.message).subscribe({
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
