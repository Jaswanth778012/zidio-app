import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  filter: 'all' | 'unread' | 'unresolved' = 'all';
  unreadCount: number = 0;
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadNotifications();
    // this.loadUnreadCount();
  }

  loadNotifications(): void {
    switch (this.filter) {
      case 'unread':
        this.adminService.getUnreadNotifications().subscribe(data => this.notifications = data);
        break;
      case 'unresolved':
        this.adminService.getUnresolvedNotifications().subscribe(data => this.notifications = data);
        break;
      default:
        this.adminService.getAllNotifications().subscribe(data => this.notifications = data);
    }
  }

//   loadUnreadCount(): void {
//   this.adminService.getUnreadNotifications().subscribe(data => {
//     this.unreadCount = data.length;
//   });
// }
  markAsRead(id: number): void {
    this.adminService.markNotificationAsRead(id).subscribe(() => this.loadNotifications());
  }

  resolve(id: number): void {
    this.adminService.resolveNotification(id).subscribe(() => this.loadNotifications());
  }

//   goToNotifications(): void {
//   // Optional: Scroll or route to the notifications section
//   window.scrollTo({ top: 0, behavior: 'smooth' });
// }
}
