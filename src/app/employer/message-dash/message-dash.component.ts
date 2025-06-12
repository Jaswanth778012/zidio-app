import { Component, OnInit } from '@angular/core';
import { Message } from '../../_model/message.model';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { EmployerService } from '../../_services/employer.service';
import { SendMessageRequest } from '../../_model/message.model';
import { UserAuthService } from '../../_services/user-auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageDialogComponent } from '../../message-dialog/message-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-message-dash',
  templateUrl: './message-dash.component.html',
  styleUrl: './message-dash.component.css'
})
export class MessageDashComponent implements OnInit {
 messages: any[] = [];
  userName: string = '';
  page = 0;
   pageSize = 3;
  totalPages = 0;

  constructor(private employerService: EmployerService,private userAuthService: UserAuthService,private snackBar: MatSnackBar,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.userName = this.userAuthService.getUsername()|| '';
    this.loadInboxMessages();
  }

  loadInboxMessages(): void {
    this.employerService.getInboxMessages(this.userName, this.page, this.pageSize).subscribe(
      response => {
        this.messages = response.content;
        this.totalPages = response.totalPages;
        console.log('Sent Messages:', this.messages);
      },
      error => {
        console.error('Failed to fetch messages:', error);
      }
    );
  }

  goToPage(pageNumber: number): void {
    this.page = pageNumber;
    this.loadInboxMessages();
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadInboxMessages();
    }
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadInboxMessages();
    }
  }

  deleteAllSentMessages(): void {
  const confirmed = window.confirm('Are you sure you want to delete all sent messages?');
  
  if (confirmed) {
    const userName = this.userAuthService.getUsername();

    this.employerService.deleteAllInboxMessages(this.userName).subscribe({
      next: () => {
        this.messages = []; // Clear UI list
        this.snackBar.open('All Inbox messages deleted', 'Close', { duration: 3000 });
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Failed to delete sent messages', 'Close', { duration: 3000 });
      }
    });
  }
}
deleteMessage(id: number): void {
    if (confirm('Delete this message?')) {
      this.employerService.deleteMessage(id).subscribe(() => this.loadInboxMessages());
    }
  }
  markAllInboxAsRead(): void {
  const userName = this.userAuthService.getUsername();
  this.employerService.markAllAsReadFromRecipient(this.userName).subscribe({
    next: (messages) => {
      this.messages = messages;
      this.snackBar.open('✅ All Inbox messages marked as read', 'Close', { duration: 3000 });
    },
    error: (err) => {
      console.error(err);
      this.snackBar.open('Failed to mark sent messages as read', 'Close', { duration: 3000 });
    }
  });
}

markAsRead(msg: Message): void {
  this.employerService.markAsRead(msg.id!).subscribe(() => {
    msg.isRead = true;
  });
}

  openMessage(messages: Message) {
    this.dialog.open(MessageDialogComponent, {
      width: '600px',
      data: messages
    });
  }

}
