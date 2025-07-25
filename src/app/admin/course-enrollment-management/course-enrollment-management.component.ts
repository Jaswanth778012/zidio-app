import { Component } from '@angular/core';
import { CourseEnrollment } from '../../_model/courseEnrollment.model';
import { AdminService } from '../../_services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-enrollment-management',
  templateUrl: './course-enrollment-management.component.html',
  styleUrl: './course-enrollment-management.component.css'
})
export class CourseEnrollmentManagementComponent {
  allEnrollments: CourseEnrollment[] = [];
  filteredEnrollments: CourseEnrollment[] = [];
  Math = Math;

  searchTerm: string = '';
  filterCourseId: number | null = null;
  filterUsername: string = '';

  pageSize: number = 10;
  currentPage: number = 1;

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadAllEnrollments();
  }

  loadAllEnrollments(): void {
    this.adminService.getAllEnrollments().subscribe({
      next: (data) => {
        this.allEnrollments = data;
        this.filterEnrollments();
      },
      error: (err) => console.error('Error loading enrollments:', err)
    });
  }

  loadByCourseId(): void {
    if (!this.filterCourseId) return;
    this.adminService.getEnrollmentsByCourseId(this.filterCourseId).subscribe({
      next: (data) => {
        this.allEnrollments = data;
        this.filterEnrollments();
      },
      error: (err) => console.error(err)
    });
  }

  loadByUsername(): void {
    if (!this.filterUsername.trim()) return;
    this.adminService.getEnrollmentsByStudentUsername(this.filterUsername.trim()).subscribe({
      next: (data) => {
        this.allEnrollments = data;
        this.filterEnrollments();
      },
      error: (err) => console.error(err)
    });
  }

  filterEnrollments(): void {
    this.filteredEnrollments = this.allEnrollments.filter(enr =>
      JSON.stringify(enr).toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterCourseId = null;
    this.filterUsername = '';
    this.loadAllEnrollments();
  }

  getPaginatedEnrollments(): CourseEnrollment[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredEnrollments.slice(startIndex, startIndex + this.pageSize);
  }

  totalPages(): number {
    return Math.ceil(this.filteredEnrollments.length / this.pageSize);
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) this.currentPage++;
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  goBack() : void{
    this.router.navigate(['/admin']);
  }
}
