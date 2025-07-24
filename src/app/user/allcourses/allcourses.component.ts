import { Component } from '@angular/core';
import { Course } from '../../_model/course.model';
import { StudentService } from '../../_services/student.service';

@Component({
  selector: 'app-allcourses',
  templateUrl: './allcourses.component.html',
  styleUrl: './allcourses.component.css'
})
export class AllcoursesComponent {
mycourses: Course[] = [];
  filteredCourses: Course[] = [];
  activeTab: string = 'all';
  searchQuery: string = '';
  selectedType: string = 'all';
  courseTypes: string[] = ['video', 'text', 'interactive'];
  currentPage: number = 1;
itemsPerPage: number = 19;
  constructor(private studentService: StudentService) {
  }

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses(): void{
    this.studentService.getMyCourses().subscribe({
      next: (courses) => {
        this.mycourses = courses.map(course => ({
        ...course,
        progressPercentage: course.progressPercentage ?? 0
      }));
        this.applyFilters();
        console.log('Courses fetched successfully', this.mycourses);
      },
      error: (err) => {
        console.error('Failed to load courses', err);
      }
    });
  }

   setTab(tab: string): void {
    this.activeTab = tab;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onTypeChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredCourses = this.mycourses.filter(course => {
      const matchesTab =
        this.activeTab === 'all' ||
        (this.activeTab === 'free' && course.price === 0) ||
        (this.activeTab === 'paid' && course.price > 0);

      const matchesSearch =
        !this.searchQuery ||
        course.courseName.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesType =
        this.selectedType === 'all' ||
        course.contentType?.toLowerCase() === this.selectedType.toLowerCase();

      return matchesTab && matchesSearch && matchesType;
    });
     this.currentPage = 1;
  }

  get paginatedCourses(): Course[] {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  return this.filteredCourses.slice(start, end);
}

get totalPages(): number {
  return Math.ceil(this.filteredCourses.length / this.itemsPerPage);
}

goToPage(page: number): void {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
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



}
