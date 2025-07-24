import { Component } from '@angular/core';
import { Application } from '../../_model/Application.model';
import { StudentService } from '../../_services/student.service';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from '@angular/animations';

@Component({
  selector: 'app-allapplications',
  templateUrl: './allapplications.component.html',
  styleUrls: ['./allapplications.component.css'],
  animations: [
    trigger('cardAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class AllapplicationsComponent {
allApplications: Application[] = [];
  filteredApplications: Application[] = [];

  searchQuery: string = '';
  selectedStatus: string = 'all';
  selectedType: string = 'all';

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.studentService.getAllApplicationsForStudent().subscribe({
      next: (data) => {
        this.allApplications = data;
        this.applyFilters();
      },
      error: (err) => console.error('Failed to fetch applications', err)
    });
  }
  
  getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'APPLICATIONS_RECEIVED':
      return 'bg-info text-dark';
    case 'RESUME_SCREENING':
      return 'bg-warning text-dark';
    case 'SHORTLISTED':
      return 'bg-primary';
    case 'TECHNICAL_ASSESSMENT':
      return 'bg-secondary';
    case 'FINAL_INTERVIEW':
      return 'bg-dark';
    case 'OFFER_EXTENDED':
      return 'bg-success';
    case 'REJECTED':
      return 'bg-danger';
    default:
      return 'bg-light text-dark';
  }
}

formatStatusLabel(status: string): string {
  return status
    .toLowerCase()
    .split('_')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}
  getJobTypeBadgeClass(app: Application): string {
  if (app.job) return 'bg-warning text-dark';
  if (app.internship) return 'bg-primary text-dark';
  return 'bg-light';
}

  applyFilters(): void {
    let filtered = this.allApplications;

    // Search
    if (this.searchQuery.trim()) {
      filtered = filtered.filter(app =>
        (app.job?.title || app.internship?.title || '').toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(app => app.status === this.selectedStatus);
    }

    // Type filter
    if (this.selectedType === 'job') {
      filtered = filtered.filter(app => !!app.job);
    } else if (this.selectedType === 'internship') {
      filtered = filtered.filter(app => !!app.internship);
    }

    this.filteredApplications = filtered;
    this.currentPage = 1;
  }

  get paginatedApplications(): Application[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredApplications.slice(start, start + this.itemsPerPage);
  }

  changePage(delta: number): void {
    const maxPage = Math.ceil(this.filteredApplications.length / this.itemsPerPage);
    const nextPage = this.currentPage + delta;
    if (nextPage >= 1 && nextPage <= maxPage) {
      this.currentPage = nextPage;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredApplications.length / this.itemsPerPage);
  }


}
