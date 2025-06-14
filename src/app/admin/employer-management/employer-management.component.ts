import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-employer-management',
  templateUrl: './employer-management.component.html',
  styleUrl: './employer-management.component.css'
})
export class EmployerManagementComponent implements OnInit {
  employers: any[] = [];
  newPassword = '';

  constructor(private adminService: AdminService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadEmployers();
  }

  loadEmployers() {
  this.adminService.getAllEmployers().subscribe({
    next: data => {
      this.employers = data;
      console.log("Loaded employers:", data);
    },
    error: err => {
      console.error("Failed to load employers:", err);
      this.snackBar.open('❌ Failed to load employers', 'Close', { duration: 3000 });
    }
  });
}

  updateStatus(userName: string, event: MatSelectChange) {
    const status = event.value;
    this.adminService.updateEmployerStatus(userName, status).subscribe(() => {
      this.snackBar.open(`Employer ${userName} status updated to ${status}`, 'Close', { duration: 3000 });
      this.loadEmployers();
    });
  }

  resetPassword(userName: string) {
    if (!this.newPassword) return;
    this.adminService.resetEmployerPassword(userName, this.newPassword).subscribe(() => {
      this.snackBar.open(`Password reset for ${userName}`, 'Close', { duration: 3000 });
      this.newPassword = '';
    });
  }

  deleteUser(userName: string) {
  if (!confirm(`Are you sure you want to delete user '${userName}'?`)) return;

  this.adminService.deleteUser(userName).subscribe({
    next: () => {
      this.snackBar.open(`✅ User ${userName} deleted successfully`, 'Close', { duration: 3000 });
      this.loadEmployers(); // Refresh user list
    },
    error: () => {
      this.snackBar.open(`❌Failed to delete ${userName}`, 'Close', { duration: 3000 });
    }
  });
  }
}
