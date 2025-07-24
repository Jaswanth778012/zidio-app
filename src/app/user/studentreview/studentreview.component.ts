import { Component, Input, SimpleChanges } from '@angular/core';
import { CourseReview } from '../../_model/reviewes.model';
import { UserService } from '../../_services/user.service';
import { StudentService } from '../../_services/student.service';
import { UserAuthService } from '../../_services/user-auth.service';

@Component({
  selector: 'app-studentreview',
  templateUrl: './studentreview.component.html',
  styleUrl: './studentreview.component.css'
})
export class StudentreviewComponent {
   @Input() id!: number;

  reviews: CourseReview[] = [];
  newRating: number = 5;
  newComment: string = '';

  constructor(public userService: UserService, private studentService: StudentService,private userAuthService: UserAuthService) {}

  ngOnInit(): void {
    if (this.id) {
      this.loadReviews();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && changes['id'].currentValue) {
      this.loadReviews();
    }
  }

  isStudent(): boolean {
  return this.userAuthService.isLoggedIn() && 
         this.userAuthService.getRoles() && 
         this.userAuthService.getRoles().includes('Student'); 
}

  loadReviews(): void {
    this.userService.getCourseReviews(this.id).subscribe({
      next: (data) => (this.reviews = data),
      error: (err) => console.error('Error fetching reviews', err),
    });
  }

  submitReview(): void {
    if (!this.newComment || !this.newRating) return;

    this.studentService.submitReview(this.id, this.newRating, this.newComment).subscribe({
      next: (res) => {
        this.newComment = '';
        this.newRating = 5;
        this.loadReviews();
      },
      error: (err) => console.error('Error submitting review', err),
    });
  }
}
