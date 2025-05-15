import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-job-moderation',
  templateUrl: './job-moderation.component.html',
  styleUrl: './job-moderation.component.css'
})
export class JobModerationComponent implements OnInit {
  jobs: any[] = [];
  displayedColumns = ['title', 'flagged', 'status', 'actions'];

  constructor(private adminService: AdminService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs() {
    this.adminService.getAllJobs().subscribe({
      next: data => this.jobs = data,
      error: () => this.snackBar.open('Failed to load jobs', 'Close', { duration: 3000 })
    });
  }

  updateStatus(id: number, status: string) {
    this.adminService.updateJobStatus(id, status).subscribe(() => {
      this.snackBar.open('Status updated', 'Close', { duration: 3000 });
      this.loadJobs();
    });
  }

  deleteJob(id: number) {
    this.adminService.deleteJob(id).subscribe(() => {
      this.snackBar.open('Job deleted', 'Close', { duration: 3000 });
      this.loadJobs();
    });
  }
}