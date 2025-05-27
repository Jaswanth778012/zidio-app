import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { AdminNotification } from '../../_model/admin-notification.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit {
  notifications: AdminNotification[] = [];
  filter: 'all' | 'unread' | 'unresolved' = 'all';
  // unreadCount: number = 0;
  page: number = 0;
  size: number = 10;
  totalPages: number = 0;
    unreadCount: number = 0;
  loading: boolean = false;
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadNotifications();
    // this.loadUnreadCount();
  }

  loadNotifications(): void {
    this.loading = true;
    switch (this.filter) {
      case 'unread':
        this.adminService.getUnreadNotifications().subscribe(data =>{ this.notifications = data; this.loading = false});
        break;
      case 'unresolved':
        this.adminService.getUnresolvedNotifications().subscribe(data => {this.notifications = data; this.loading = false});
        break;
      default:
        this.adminService.getAllNotifications(this.page,this.size).subscribe(data => {this.notifications = data.content;this.totalPages = data.totalPages; this.loading = false});
    }
  }

  
loadUnreadCount(): void {
  this.adminService.getUnreadNotifications().subscribe(data => {
    this.unreadCount = data.length;
  });
}
  markAsRead(id: number): void {
    this.adminService.markNotificationAsRead(id).subscribe(() => this.loadNotifications());
  }
  markAllAsRead(): void {
    this.adminService.markAllNotificationAsRead().subscribe(() => this.loadNotifications());
  }

  getByPriority(priority: string) {
    this.adminService.getByPriority(priority).subscribe(data => this.notifications = data);
  }

  getByType(type: string) {
    this.adminService.getByType(type).subscribe(data => this.notifications = data);
  }

  resolve(id: number): void {
    this.adminService.resolveNotification(id).subscribe(() => this.loadNotifications());
  }

//   goToNotifications(): void {
//   // Optional: Scroll or route to the notifications section
//   window.scrollTo({ top: 0, behavior: 'smooth' });
// }
onDeleteNotification(id: number): void {
    if (confirm('Are you sure you want to delete this notification?')) {
      this.adminService.deleteNotification(id).subscribe({
        next: (response) => {
          console.log(response);
          this.notifications = this.notifications.filter(n => n.id !== id);
          alert('Notification deleted successfully');
        },
        error: (err) => {
          console.error(err);
          alert('Failed to delete notification');
        }
      });
    }
  }
  deleteAll(): void {
  if (confirm('Are you sure you want to delete all notifications?')) {
    this.adminService.deleteAllNotifications().subscribe({
       next: (res) => {
        console.log(res.message); // Optional: log success message
        this.notifications = [];
        alert('All notifications deleted successfully');
      },
      error: err => {
        console.error('Error deleting all notifications:', err);
      }
    });
  }
}

resolveAll(): void {
  if (confirm('Are you sure you want to mark all notifications as resolved?')) {
    this.adminService.resolveAllNotifications().subscribe({
      next: (res) => {
        console.log(res.message);
        alert('All notifications marked as resolved successfully');
        this.notifications = this.notifications.map(n => ({ ...n, resolved: true }));
      },
      error: err => {
        console.error('Error resolving all notifications:', err);
      }
    });
  }
}

nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadNotifications();
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.loadNotifications();
    }
  }
}
