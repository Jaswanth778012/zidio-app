import { Component } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { UserAuthService } from '../../_services/user-auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Message } from '../../_model/message.model';
import { MessageDialogComponent } from '../../message-dialog/message-dialog.component';

@Component({
  selector: 'app-adminsent',
  templateUrl: './adminsent.component.html',
  styleUrl: './adminsent.component.css'
})
export class AdminsentComponent {
messages: any[] = [];
  userName: string = '';
  page = 0;
   pageSize = 3;
  totalPages = 0;

  constructor(private adminService: AdminService,private userAuthService: UserAuthService,private snackBar: MatSnackBar,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.userName = this.userAuthService.getUsername()|| '';
    this.loadSentMessages();
  }

  loadSentMessages(): void {
    this.adminService.getMessagesFromSender(this.userName, this.page, this.pageSize).subscribe(
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
    this.loadSentMessages();
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadSentMessages();
    }
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadSentMessages();
    }
  }

  deleteAllSentMessages(): void {
  const confirmed = window.confirm('Are you sure you want to delete all sent messages?');
  
  if (confirmed) {
    const userName = this.userAuthService.getUsername();

    this.adminService.deleteAllSentMessages(this.userName).subscribe({
      next: () => {
        this.messages = []; // Clear UI list
        this.snackBar.open('All Sent messages deleted', 'Close', { duration: 3000 });
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
      this.adminService.deleteMessage(id).subscribe(() => this.loadSentMessages());
    }
  }
  markAllSentAsRead(): void {
  const userName = this.userAuthService.getUsername();
  this.adminService.markAllAsReadFromSender(this.userName).subscribe({
    next: (messages) => {
      this.messages = messages;
      this.snackBar.open('✅ All Sent messages marked as read', 'Close', { duration: 3000 });
    },
    error: (err) => {
      console.error(err);
      this.snackBar.open('Failed to mark sent messages as read', 'Close', { duration: 3000 });
    }
  });
}

markAsRead(msg: Message): void {
  this.adminService.markAsRead(msg.id!).subscribe(() => {
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
