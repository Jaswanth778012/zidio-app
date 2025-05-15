import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectChange } from '@angular/material/select';


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  newPassword: string = '';

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (data) => this.users = data,
      error: () => this.snackBar.open("Failed to load users", 'Close', { duration: 3000 })
    });
  }

 updateStatus(userName: string, event: MatSelectChange) {
  const status = event.value; // extract value from event
  this.adminService.updateUserStatus(userName, status).subscribe(() => {
    this.snackBar.open(`User ${userName} status set to ${status}`, 'Close', { duration: 3000 });
    this.loadUsers();
  });
}


  resetPassword(userName: string) {
    if (!this.newPassword) return;
    this.adminService.resetUserPassword(userName, this.newPassword).subscribe(() => {
      this.snackBar.open(`Password reset for ${userName}`, 'Close', { duration: 3000 });
      this.newPassword = '';
    });
  }
}
