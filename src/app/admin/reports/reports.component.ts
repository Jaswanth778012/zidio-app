import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  reports: any[] = [];
   reportedBy = '';
  reason = '';

  constructor(private adminService: AdminService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports() {
    this.adminService.getReports().subscribe({
      next: (data) => this.reports = data,
      error: () => this.snackBar.open('Failed to load reports', 'Close', { duration: 3000 })
    });
  }

  resolve(id: number) {
    this.adminService.resolveReport(id).subscribe({
      next: () => {
        this.snackBar.open('✅ Report resolved', 'Close', { duration: 3000 });
        this.loadReports();
      }
    });
  }

}
