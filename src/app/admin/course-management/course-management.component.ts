import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserAuthService } from '../../_services/user-auth.service';
import { TagContentType } from '@angular/compiler';

@Component({
  selector: 'app-course-management',
  templateUrl: './course-management.component.html',
  styleUrl: './course-management.component.css'
})
export class CourseManagementComponent implements OnInit {
  courses: any[] = [];
  filteredCourses: any[] = [];
  categories: any[] = [];
  flaggedReviews: any[] = [];
  selectedCourseReviews: any[] = [];
  auditLogs: any[] = [];


  filterForm!: FormGroup;
  courseForm!: FormGroup;

  searchTerm: string = '';
  selectedCourseId: number | null = null;
  editCourse: any = null;
  assignUserName = '';
  selectedCategory: any = { name: '' };


  newCourseName: string = '';
  updatedCourseName = '';
  adminuserName = 'admin123' // This should be fetched from the auth service
  reviews: any[] = [];
  selectedCategoryId: number = 1;

  constructor(private adminService: AdminService, private snackBar: MatSnackBar,private fb: FormBuilder,private userAuthService: UserAuthService) {}

  ngOnInit(): void {
    this.initForms();
    this.loadCourses();
    this.loadCategories();
    this.loadFlaggedReviews();
    
  }

  initForms(): void
  {
    this.filterForm = this.fb.group({
      categoryId: [''],
      status: [''],
      active: ['']
    });
    this.courseForm = this.fb.group({
    courseName: ['', Validators.required],
    description: ['', Validators.required],
    tags: [[]],
    contentType: ['video'],
    previewUrl: [''],
    prerequisites: [[]],
    certificate: [false],
    certificateLink: [''],  
    selfPaced: [false],
    startDate: [''],
    endDate: [''],
    creatorUsername: [''],
    categoryId: [1, Validators.required]
    

    // Add other controls as needed
  });
  }

  loadCourses() {
  this.adminService.getAllCourses().subscribe({
    next: (res) => {
      console.log('Courses loaded:', res); // 🔍 Debug this
      this.courses = res;
      this.filteredCourses = res;
    },
    error: (err) => {
      console.error('Error loading courses:', err);
    }
  });
}

  loadCategories(): void {
  this.adminService.getAllCategories().subscribe({
    next: (data) => {
      this.categories = data;
      if (data.length > 0 && this.courseForm.get('categoryId')?.value == null) {
        this.courseForm.patchValue({ categoryId: data[0].id });
      }
    },
    error: (err) => {
      console.error('ERROR loading categories:', err);
    }
  });
}


  addCourse() {
  if (this.courseForm.invalid) {
    this.snackBar.open('❌ Please fill all required fields', 'Close', { duration: 3000 });
    return;
  }

  console.log('Form Values:', this.courseForm.value);

  const startDateValue = this.courseForm.value.startDate;
  const endDateValue = this.courseForm.value.endDate;

  const payload = {
    courseName: this.courseForm.value.courseName,
    description: this.courseForm.value.description,
    tags: typeof this.courseForm.value.tags === 'string' 
      ? this.courseForm.value.tags.split(',').map((tag: string) => tag.trim()) 
      : [],
    contentType: this.courseForm.value.contentType || 'video',
    previewUrl: this.courseForm.value.previewUrl || '',
    prerequisites: typeof this.courseForm.value.prerequisites === 'string' 
      ? this.courseForm.value.prerequisites.split(',').map((prereq: string) => prereq.trim()) 
      : [],
    certificate: this.courseForm.value.certificate || false,
    selfPaced: this.courseForm.value.selfPaced || false,
    startDate: startDateValue ? new Date(startDateValue).toISOString() : null,
    endDate: endDateValue ? new Date(endDateValue).toISOString() : null,
    creatorUsername: this.userAuthService.getUsername() || this.adminuserName,
    categoryId: this.courseForm.value.categoryId,
    categories: this.courseForm.value.categories || []
  };

  console.log('Course Payload:', payload);

  this.adminService.addCourse(payload).subscribe({
  next: (response) => {
    console.log('Backend Response:', response);
    if (response.status === 'success') {
      this.snackBar.open('✅ ' + response.message, 'Close', { duration: 3000 });
      this.courseForm.reset({ contentType: 'video', certificate: false, selfPaced: false });
      this.loadCourses();
    } else {
      this.snackBar.open('❌ Failed to add course', 'Close', { duration: 3000 });
    }
  },
  error: (err) => {
    console.error('Error adding course:', err);
    const errorMessage = err.error?.message || 'Something went wrong';
    this.snackBar.open(`❌ ${errorMessage}`, 'Close', { duration: 3000 });
  }
});


  
}


 startEdit(course: any): void {
    this.editCourse = { ...course };
    this.courseForm.patchValue({
      ...course
    });
    this.selectedCourseId = course.id;
  }


  updateCourse(courseId: number) {
  const payload = {
    courseName: this.courseForm.value.courseName,
    description: this.courseForm.value.description,
    tags: this.courseForm.value.tags,
    contentType: this.courseForm.value.contentType,
    previewUrl: this.courseForm.value.previewUrl,
    prerequisites: this.courseForm.value.prerequisites,
    certificate: this.courseForm.value.certificate,
    selfPaced: this.courseForm.value.selfPaced,
    startDate: this.courseForm.value.startDate,
    endDate: this.courseForm.value.endDate,
    creatorUsername: this.userAuthService.getUsername() || this.adminuserName,
    categoryId: this.courseForm.value.categoryId
  };

  this.adminService.updateCourse(courseId, payload).subscribe({
    next: () => {
      this.snackBar.open('✅ Course updated successfully', 'Close', { duration: 3000 });
      this.loadCourses();
    },
    error: (err) => {
      console.error('Error updating course:', err);
      this.snackBar.open('❌ Error updating course', 'Close', { duration: 3000 });
    }
  });
}


 deleteCourse(courseId: number) {
  this.adminService.deleteCourse(courseId).subscribe({
    next: () => {
      this.snackBar.open('🗑️ Course deleted', 'Close', { duration: 3000 });
      this.loadCourses();
    },
    error: (err) => {
      console.error('Error deleting course:', err);
      this.snackBar.open(`❌ Error deleting course (${err.status}): ${err.error}`, 'Close', { duration: 3000 });
    }
  });
}


  archiveCourse(CourseId: number): void {
  this.adminService.archiveCourse(CourseId).subscribe({
    next: () => {
      this.loadCourses();
      this.snackBar.open('✅ Course archived', 'Close', { duration: 3000 });
    },
    error: (err) => {
      console.error('Error archiving course:', err);

      const message = err?.error?.error || '❌ Error archiving course';
      this.snackBar.open(message, 'Close', { duration: 3000 });
    }
  });
}



  toggleVisibility(id: number, active: boolean): void {
    this.adminService.toggleCourseVisibility(id, !active).subscribe(() => this.loadCourses());
  }

  changeStatus(id: number, status: string): void {
  this.adminService.updateCourseStatus(id, status).subscribe({
    next: () => {
      this.snackBar.open('✅ Status updated successfully', 'Close', { duration: 3000 });
      this.loadCourses();
    },
    error: (err) => {
      console.error('Error updating status:', err);
      this.snackBar.open('❌ Error updating status', 'Close', { duration: 3000 });
    }
  });
}



  assignFaculty(courseId: number): void {
    if (!this.assignUserName?.trim()) return;
    this.adminService.assignFaculty(courseId, this.assignUserName).subscribe({
      next: () => {
        this.snackBar.open('👨‍🏫 Faculty assigned', 'Close', { duration: 3000 });
        this.assignUserName = '';
        this.loadCourses();
      }
    });
  }

  filterCourses(): void {
    const params = this.filterForm.value;
    this.adminService.filterCourses(params).subscribe(data => {
  this.courses = data;
  this.filteredCourses = data;
});
  }

  getAuditLogs(courseId: number): void {
    this.selectedCourseId = courseId;
    this.adminService.getCourseAuditLogs(courseId).subscribe(logs => this.auditLogs = logs);
  }

  getCourseReviews(courseId: number): void {
     this.selectedCourseId = courseId;
    this.adminService.getCourseReviews(courseId).subscribe(reviews => this.selectedCourseReviews = reviews);
  }

  loadFlaggedReviews(): void {
    this.adminService.getFlaggedReviews().subscribe(data => this.flaggedReviews = data);
  }

  flagReview(id: number): void {
    this.adminService.flagReview(id).subscribe(() => {
      this.loadFlaggedReviews();
      if (this.selectedCourseId) this.getCourseReviews(this.selectedCourseId);
    });
  }

  deleteReview(id: number): void {
   
    this.adminService.deleteReview(id).subscribe(() => this.loadFlaggedReviews());
  }

  // Category management
  createCategory(): void {
    if (!this.selectedCategory.name.trim()) return;
    this.adminService.createCategory(this.selectedCategory).subscribe(() => {
      this.loadCategories();
      this.selectedCategory = { name: '' };
    });
  }

  updateCategory(category: any): void {
    this.adminService.updateCategory(category.id, category).subscribe(() => this.loadCategories());
  }

  deleteCategory(id: number): void {
    this.adminService.deleteCategory(id).subscribe(() => this.loadCategories());
  }

  onSearchChange(): void {
  const term = this.searchTerm.toLowerCase();
  this.filteredCourses = this.courses.filter(course =>
    course.name.toLowerCase().includes(term)
  );
}
}

