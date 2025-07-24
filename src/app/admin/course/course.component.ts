import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { Course } from '../../_model/course.model';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  courses: Course[] = [];
  selectedCourse?: Course;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getAllCourses().subscribe(data => this.courses = data);
  }

  selectCourse(course: Course) {
    this.selectedCourse = course;
  }
}
