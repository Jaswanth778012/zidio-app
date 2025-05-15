import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-course-management',
  templateUrl: './course-management.component.html',
  styleUrl: './course-management.component.css'
})
export class CourseManagementComponent implements OnInit {
  courses: any[] = [];
  newCourseName = '';
  selectedCourseId: number | null = null;
  updatedCourseName = '';
  assignUserName = '';

  constructor(private adminService: AdminService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.adminService.getAllCourses().subscribe({
      next: data => this.courses = data,
      error: err => this.snackBar.open('❌ Failed to load courses', 'Close', { duration: 3000 })
    });
  }

  addCourse() {
    if (!this.newCourseName.trim()) return;
    this.adminService.addCourse(this.newCourseName).subscribe({
      next: () => {
        this.snackBar.open('✅ Course added', 'Close', { duration: 3000 });
        this.newCourseName = '';
        this.loadCourses();
      }
    });
  }

  updateCourse(courseId: number) {
    if (!this.updatedCourseName.trim()) return;
    this.adminService.updateCourse(courseId, this.updatedCourseName).subscribe({
      next: () => {
        this.snackBar.open('✏️ Course updated', 'Close', { duration: 3000 });
        this.updatedCourseName = '';
        this.selectedCourseId = null;
        this.loadCourses();
      }
    });
  }

  deleteCourse(courseId: number) {
    this.adminService.deleteCourse(courseId).subscribe({
      next: () => {
        this.snackBar.open('🗑️ Course deleted', 'Close', { duration: 3000 });
        this.loadCourses();
      }
    });
  }

  assignFaculty(courseId: number) {
    if (!this.assignUserName.trim()) return;
    this.adminService.assignFaculty(courseId, this.assignUserName).subscribe({
      next: () => {
        this.snackBar.open('👨‍🏫 Faculty assigned', 'Close', { duration: 3000 });
        this.assignUserName = '';
        this.loadCourses();
      }
    });
  }
}
