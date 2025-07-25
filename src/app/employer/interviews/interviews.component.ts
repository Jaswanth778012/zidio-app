import { Component, OnInit } from '@angular/core';
import { EmployerService } from '../../_services/employer.service';
import { Interview } from '../../_model/Interview.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Application, ApplicationStage } from '../../_model/Application.model';

@Component({
  selector: 'app-interviews',
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.css']
})
export class InterviewsComponent implements OnInit {
  interviews: Interview[] = [];
  filteredInterviews: Interview[] = [];
  selectedInterview?: Interview;
   applications: Application[] = [];
    jobApplications: Application[] = [];
  internshipApplications: Application[] = [];
  Math = Math;
  // Filter properties
  searchTerm: string = '';
  statusFilter: string = '';
  dateFilter: string = '';
  
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
    this.loadAllInterviews();
  }

  loadAllInterviews(): void {
    this.employerService.getAllInterviews().subscribe(data => {
      this.interviews = data.sort((a, b) => {
        const dateA = new Date(a.interviewDate).getTime();
        const dateB = new Date(b.interviewDate).getTime();
        return dateA - dateB; // Sort by date ascending (upcoming first)
      });
      this.filteredInterviews = [...this.interviews];
      this.calculateTotalPages();
    });
  }

  filterInterviews(): void {
    this.filteredInterviews = this.interviews.filter(interview => {
      // Search term filter
      const searchMatch = !this.searchTerm || 
        interview.student?.userName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        interview.job?.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        interview.internship?.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        interview.notes?.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Status filter (you can add status field to Interview model if needed)
      const statusMatch = !this.statusFilter || interview.status === this.statusFilter;

      // Date filter
      let dateMatch = true;
      if (this.dateFilter) {
        const today = new Date();
        const interviewDate = new Date(interview.interviewDate);
        
        switch (this.dateFilter) {
          case 'today':
            dateMatch = interviewDate.toDateString() === today.toDateString();
            break;
          case 'week':
            const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            dateMatch = interviewDate >= today && interviewDate <= weekFromNow;
            break;
          case 'month':
            const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
            dateMatch = interviewDate >= today && interviewDate <= monthFromNow;
            break;
          case 'past':
            dateMatch = interviewDate < today;
            break;
        }
      }

      return searchMatch && statusMatch && dateMatch;
    });

    this.currentPage = 1; // Reset to first page
    this.calculateTotalPages();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.dateFilter = '';
    this.filterInterviews();
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredInterviews.length / this.pageSize);
  }

  getPaginatedInterviews(): Interview[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredInterviews.slice(startIndex, startIndex + this.pageSize);
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

  getInterviewById(id: number): void {
    if (this.selectedInterview?.id === id) {
      this.selectedInterview = undefined; // Close if already open
    } else {
      this.employerService.getInterviewById(id).subscribe(data => this.selectedInterview = data);
    }
  }

  deleteInterview(id: number): void {
    if (confirm('Are you sure you want to delete this interview?')) {
      this.employerService.deleteInterview(id).subscribe({
        next: () => {
          this.loadAllInterviews();
          this.snackBar.open('Interview deleted successfully!', 'Close', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error deleting interview:', error);
          this.snackBar.open('Failed to delete interview', 'Close', {
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
    
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    if (diff === -1) return 'Yesterday';
    if (diff > 0) return `${diff} days ago`;
    return `In ${Math.abs(diff)} days`;
  }

  isUpcoming(dateStr: string): boolean {
    const date = new Date(dateStr);
    const now = new Date();
    return date >= now;
  }

   isPast(dateStr: string, endTimeStr: string): boolean {
  if (!dateStr || !endTimeStr) return false;

  const [hours, minutes] = endTimeStr.split(':').map(Number);
  const endDateTime = new Date(dateStr);
  endDateTime.setHours(hours, minutes, 0, 0);

  const now = new Date();
  return endDateTime < now;
}

}

