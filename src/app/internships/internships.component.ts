import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from '@angular/animations';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-internships',
  templateUrl: './internships.component.html',
  styleUrls: ['./internships.component.css'],
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
export class InternshipsComponent{
internships: any[] = [];
  filteredInternships: any[] = [];
  paginatedInternships: any[] = [];

  searchTerm = '';
  selectedType = '';
  selectedMode = '';
  stipendMin: number | null = null;
  stipendMax: number | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  constructor(public userService: UserService) {}

  ngOnInit(): void {
    this.loadInternships();
  }

  loadInternships() {
    this.userService.getAllInternships().subscribe({
      next: (res) => {
        this.internships = res;
        console.log('Internships loaded:', this.internships);
        this.applyFilters();
      },
      error: (err) => console.error('Failed to load internships:', err)
    });
  }

  applyFilters() {
    this.filteredInternships = this.internships.filter(internship => {
      const titleMatch = internship.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) || '';
      const companyMatch = internship.companyName?.toLowerCase().includes(this.searchTerm.toLowerCase()) || '';
      const locationMatch = internship.location?.toLowerCase().includes(this.searchTerm.toLowerCase()) || '';
      const matchesSearch = titleMatch || companyMatch || locationMatch;

      const matchesType = !this.selectedType || internship.internshipType === this.selectedType;
      const matchesMode = !this.selectedMode || internship.internshipMode === this.selectedMode;

      const stipend = parseInt(internship.stipend?.replace(/\D/g, '')) || 0;
      const matchesStipend =
        (!this.stipendMin || stipend >= this.stipendMin) &&
        (!this.stipendMax || stipend <= this.stipendMax);

      return matchesSearch && matchesType && matchesMode && matchesStipend;
    });

    this.totalPages = Math.ceil(this.filteredInternships.length / this.pageSize);
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedInternships = this.filteredInternships.slice(start, start + this.pageSize);
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
