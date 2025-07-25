import { Component } from '@angular/core';
import { UserService } from '../_services/user.service';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from '@angular/animations';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query('.card', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})

export class JobsComponent {
   jobs: any[] = [];
  filteredJobs: any[] = [];
  paginatedJobs: any[] = [];

  searchTerm = '';
  selectedType = '';
  selectedMode = '';
  salaryMin: number | null = null;
  salaryMax: number | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;


  constructor(public userService: UserService) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs() {
    this.userService.getAllJobs().subscribe({
      next: (res) => {
        this.jobs = res;
        console.log('Jobs loaded:', this.jobs);
        this.applyFilters();
      },
      error: (err) => console.error('Failed to load jobs:', err)
    });
  }

  applyFilters() {
    this.filteredJobs = this.jobs.filter(job => {
      const titleMatch = job.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) || '';
      const companyMatch = job.companyName?.toLowerCase().includes(this.searchTerm.toLowerCase()) || '';
      const locationMatch = job.location?.toLowerCase().includes(this.searchTerm.toLowerCase()) || '';
      const matchesSearch = titleMatch || companyMatch || locationMatch;

      const matchesType = !this.selectedType || job.jobType === this.selectedType;
      const matchesMode = !this.selectedMode || job.jobMode === this.selectedMode;

      const salary = parseInt(job.salary?.replace(/\D/g, '')) || 0;
      const matchesSalary =
        (!this.salaryMin || salary >= this.salaryMin) &&
        (!this.salaryMax || salary <= this.salaryMax);

      return matchesSearch && matchesType && matchesMode && matchesSalary;
    });

    this.totalPages = Math.ceil(this.filteredJobs.length / this.pageSize);
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedJobs = this.filteredJobs.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  calculateDaysAgo(dateStr: string): number {
    const posted = new Date(dateStr);
    return Math.floor((Date.now() - posted.getTime()) / (1000 * 60 * 60 * 24));
  }

  calculatePostedLabel(postedAt: string): string {
  const daysAgo = this.calculateDaysAgo(postedAt);
  if (daysAgo === 0) return 'Few hours ago';
  if (daysAgo === 1) return '1 day ago';
  if (daysAgo < 7) return `${daysAgo} days ago`;
  const weeks = Math.floor(daysAgo / 7);
  return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
}

  
}
