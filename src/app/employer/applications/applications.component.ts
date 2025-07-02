import { Component, OnInit } from '@angular/core';
import { EmployerService } from '../../_services/employer.service';
import { Application } from '../../_model/Application.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  selectedStatuses: { [applicationId: number]: string } = {};
   Math = Math
  // Filter properties
  searchTerm: string = '';
  statusFilter: string = '';
  typeFilter: string = '';
  modeFilter: string = '';
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;

  constructor(
    private employerService: EmployerService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAllApplications();
  }

  loadAllApplications(): void {
    this.employerService.getAllApplications().subscribe(data => {
      this.applications = data.sort((a, b) => b.id - a.id); // Sort by ID descending
      this.filteredApplications = [...this.applications];
      this.setDefaultStatuses();
      this.calculateTotalPages();
    });
  }

  setDefaultStatuses(): void {
    this.applications.forEach(app => {
      this.selectedStatuses[app.id] = app.status || 'PENDING';
    });
  }

  filterApplications(): void {
    this.filteredApplications = this.applications.filter(app => {
      // Search term filter
      const searchMatch = !this.searchTerm || 
        app.student?.userFirstName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        app.student?.userLastName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        app.student?.userName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        app.job?.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        app.internship?.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        app.job?.companyName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        app.internship?.companyName?.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Status filter
      const statusMatch = !this.statusFilter || app.status === this.statusFilter;

      // Type filter
      const typeMatch = !this.typeFilter || 
        (this.typeFilter === 'job' && app.job) ||
        (this.typeFilter === 'internship' && app.internship);

      //Type Mode
     const modeMatch = !this.modeFilter || 
      app.job?.jobMode === this.modeFilter || 
      app.internship?.internshipMode === this.modeFilter;
      return searchMatch && statusMatch && typeMatch && modeMatch;
    });

    this.currentPage = 1; // Reset to first page
    this.calculateTotalPages();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.typeFilter = '';
    this.filterApplications();
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredApplications.length / this.pageSize);
  }

  getPaginatedApplications(): Application[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredApplications.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  updateStatus(id: number): void {
    const newStatus = this.selectedStatuses[id];
    if (!newStatus) return;
    
    this.employerService.updateApplicationStatus(id, newStatus).subscribe({
      next: () => {
        // Update the application status in the local array
        const appIndex = this.applications.findIndex(app => app.id === id);
        if (appIndex !== -1) {
          this.applications[appIndex].status = newStatus;
        }
        
        const filteredIndex = this.filteredApplications.findIndex(app => app.id === id);
        if (filteredIndex !== -1) {
          this.filteredApplications[filteredIndex].status = newStatus;
        }
        
        this.snackBar.open(`Application ${newStatus.toLowerCase()} successfully!`, 'Close', {
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Error updating application status:', error);
        this.snackBar.open('Failed to update application status', 'Close', {
          duration: 3000
        });
      }
    });
  }

  downloadResume(id: number): void {
    this.employerService.downloadResume(id).subscribe({
      next: (blob) => {
        const fileName = `resume_${id}.pdf`;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Failed to download resume:', error);
        this.snackBar.open('Failed to download resume', 'Close', {
          duration: 3000
        });
      }
    });
  }

  deleteApplication(id: number): void {
    if (confirm('Are you sure you want to delete this application?')) {
      this.employerService.deleteApplication(id).subscribe({
        next: () => {
          this.loadAllApplications();
          this.snackBar.open('Application deleted successfully!', 'Close', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error deleting application:', error);
          this.snackBar.open('Failed to delete application', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/employer']);
  }

  getRelativeDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'today';
    if (diff === 1) return '1 day ago';
    return `${diff} days ago`;
  }
}

