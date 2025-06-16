import { Component } from '@angular/core';
import { SendMessageRequest } from '../../_model/message.model';
import { StudentService } from '../../_services/student.service';
import { UserAuthService } from '../../_services/user-auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-studentcompose',
  templateUrl: './studentcompose.component.html',
  styleUrl: './studentcompose.component.css'
})
export class StudentcomposeComponent {
message: SendMessageRequest = {
    recipientUserName: '',
    subject: '',
    body: ''
  };

  constructor(private studentService: StudentService,private userAuthService: UserAuthService,private snackBar: MatSnackBar) {}

  sendMessage(){
    const sender = this.userAuthService.getUsername();
    console.log('sendas: ',sender);

     this.studentService.sendMessage(this.message).subscribe({
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
