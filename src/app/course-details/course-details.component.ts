import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../_services/admin.service';
import { UserService } from '../_services/user.service';
import { CourseReview } from '../_model/reviewes.model';
import { Syllabus } from '../_model/syllabus.model';
import { StudentService } from '../_services/student.service';
import { UserAuthService } from '../_services/user-auth.service';
declare var Razorpay: any;
@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css'
})
export class CourseDetailsComponent implements OnInit {
  id!: number;
  course: any = {};
  loading = true;
  syllabusWithVideos: any[] = [];
  enrolled: boolean = false;
enrollmentStatus: string = '';
  constructor(private route: ActivatedRoute, private userService: UserService,private studentService: StudentService, private authService: UserAuthService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchcourse();
    if (this.authService.getToken() && this.authService.getRole() === 'Student') {
    this.checkEnrollment();
  }
  }

  fetchcourse(): void {
    this.userService.getCourseById(this.id).subscribe((data) => {
      setTimeout(() => {
        this.course = data;
        this.loading = false;
      }, 1000);
    },
    (error) => {
      console.error('Error fetching course details:', error);
      this.loading = false;
    });
  }

  getTotalVideos(): number {
    if (!this.course || !this.course.syllabus || !Array.isArray(this.course.syllabus)) {
      return 0;
    }

    return this.course.syllabus.reduce((total: number, syllabus: Syllabus) => {
      if (syllabus && syllabus.video && Array.isArray(syllabus.video)) {
        return total + syllabus.video.length;
      }
      return total;
    }, 0);
  }

  getAverageRating(): number {
    if (!this.course || !this.course.reviews || !Array.isArray(this.course.reviews) || this.course.reviews.length === 0) {
      return 0;
    }
    
    const sum = this.course.reviews.reduce((total: number, review: CourseReview) => total + review.rating, 0);
    return sum / this.course.reviews.length;
  }

  checkEnrollment(): void {
  this.studentService.getEnrollmentForCourse(this.id).subscribe({
    next: (res) => {
       if (res && res.enrollmentStatus) {
        this.enrollmentStatus = res.enrollmentStatus;
        this.enrolled = res.enrollmentStatus === 'ENROLLED';
        console.log('Enrollment status:', this.enrollmentStatus);
      } else {
        this.enrolled = false;
        this.enrollmentStatus = 'NOTENROLLED';
        console.log('Enrollment status:', this.enrollmentStatus);
      }
    },
    error: (err) => {
      console.error('Error checking enrollment:', err);
      this.enrolled = false;
      this.enrollmentStatus = 'NOT_ENROLLED';
    }
  });
}

  getReviewCount(): number {
    if (!this.course || !this.course.reviews || !Array.isArray(this.course.reviews)) {
      return 0;
    }
    return this.course.reviews.length;
  }

  getCourseImageUrl(): string {
    if (this.course && this.course.courseImages && this.course.courseImages.length > 0) {
      return this.course.courseImages[0].url;
    }
    return 'assets/default-course-image.jpg'; // Provide a default image path
  }

  enrollFree(courseId: number) {
    this.studentService.enrollInFreeCourse(courseId).subscribe(res => {
      alert(res);
      this.checkEnrollment();
    });
  }

  enrollPaid(courseId: number, price: number) {
  this.studentService.enrollInPaidCourse(courseId).subscribe(response => {
    if (response.startsWith('order exists')) {
      console.log('Reusing existing order.');
    } else if (response.startsWith('order created')) {
      console.log('Created new order.');
    } else {
      alert(response); // any other response (e.g. "already enrolled")
      return;
    }

    const orderIdMatch = response.match(/Order ID:\s*([a-zA-Z0-9_]+)/);
    const orderId = orderIdMatch ? orderIdMatch[1] : null;

    if (!orderId) {
      alert('Could not find order ID in response');
      return;
    }

    const options = {
      key: 'rzp_test_FH6mXCqMFtQUZa',
      amount: price * 100,
      currency: 'INR',
      name: 'Course Enrollment',
      description: 'Online Course Purchase',
      order_id: orderId,
      handler: (res: any) => {
        this.verifyPayment(orderId, res.razorpay_payment_id, res.razorpay_signature);
      },
      prefill: {
        name: '',
        email: ''
      },
      theme: {
        color: '#0d6efd'
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  });
}
  verifyPayment(orderId: string, paymentId: string, signature: string) {
    console.log('Verifying payment:', { orderId, paymentId, signature });
    this.studentService.verifyPayment(orderId, paymentId, signature).subscribe(result => {
      alert(result);
      this.checkEnrollment();
    });
  }



}
