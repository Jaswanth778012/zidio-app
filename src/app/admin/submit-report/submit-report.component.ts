import { Component } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-submit-report',
  templateUrl: './submit-report.component.html',
  styleUrl: './submit-report.component.css'
})
export class SubmitReportComponent {
  reportedBy = '';
  reason = '';

  constructor(private adminService: AdminService, private snackBar: MatSnackBar) {}

  submit() {
    if (!this.reportedBy.trim() || !this.reason.trim()) {
      this.snackBar.open('Please fill out all fields.', 'Close', { duration: 3000 });
      return;
    }

    this.adminService.submitReport({ reportedBy: this.reportedBy, reason: this.reason }).subscribe({
      next: () => {
        this.snackBar.open('✅ Report submitted successfully!', 'Close', { duration: 3000 });
        this.reportedBy = '';
        this.reason = '';
      },
      error: () => this.snackBar.open('❌ Failed to submit report.', 'Close', { duration: 3000 })
    });
  }
}
