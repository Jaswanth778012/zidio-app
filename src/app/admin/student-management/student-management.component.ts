import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-student-management',
  templateUrl: './student-management.component.html',
  styleUrl: './student-management.component.css'
})
export class StudentManagementComponent implements OnInit {
  students: any[] = [];
  newPassword = '';

  constructor(private adminService: AdminService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents() {
    this.adminService.getAllStudents().subscribe({
      next: data => {
        this.students = data;
        console.log("Loaded students:", data);
      },
      error: err => {
        console.error("Failed to load students:", err);
        this.snackBar.open('❌ Failed to load students', 'Close', { duration: 3000 });
      }
    });
  }

  updateStatus(userName: string, event: MatSelectChange) {
    const status = event.value;
    this.adminService.updateStudentStatus(userName, status).subscribe(() => {
      this.snackBar.open(`Student ${userName} status updated to ${status}`, 'Close', { duration: 3000 });
      this.loadStudents();
    });
  }

  resetPassword(userName: string) {
    if (!this.newPassword) return;
    this.adminService.resetStudentPassword(userName, this.newPassword).subscribe(() => {
      this.snackBar.open(`Password reset for ${userName}`, 'Close', { duration: 3000 });
      this.newPassword = '';
    });
  }

  deleteUser(userName: string) {
  if (!confirm(`Are you sure you want to delete user '${userName}'?`)) return;

  this.adminService.deleteUser(userName).subscribe({
    next: () => {
      this.snackBar.open(`✅ User ${userName} deleted successfully`, 'Close', { duration: 3000 });
      this.loadStudents(); // Refresh user list
    },
    error: () => {
      this.snackBar.open(`❌Failed to delete ${userName}`, 'Close', { duration: 3000 });
    }
  });
  }
}
