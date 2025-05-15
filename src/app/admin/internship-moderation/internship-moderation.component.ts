import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-internship-moderation',
  templateUrl: './internship-moderation.component.html',
  styleUrl: './internship-moderation.component.css'
})
export class InternshipModerationComponent implements OnInit {
  internships: any[] = [];
  displayedColumns = ['title', 'flagged', 'status', 'actions'];

  constructor(private adminService: AdminService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadInternships();
  }

  loadInternships() {
    this.adminService.getAllInternships().subscribe({
      next: data => this.internships = data,
      error: () => this.snackBar.open('Failed to load internships', 'Close', { duration: 3000 })
    });
  }

  updateStatus(id: number, status: string) {
    this.adminService.updateInternshipStatus(id, status).subscribe(() => {
      this.snackBar.open('Status updated', 'Close', { duration: 3000 });
      this.loadInternships();
    });
  }

  deleteInternship(id: number) {
    this.adminService.deleteInternship(id).subscribe(() => {
      this.snackBar.open('Internship deleted', 'Close', { duration: 3000 });
      this.loadInternships();
    });
  }
}
