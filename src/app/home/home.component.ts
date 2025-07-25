import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StudentService } from '../_services/student.service';
declare var Razorpay: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  courses: any[] = [];
  courseRatings: { [key: number]: number } = {};
  internships: any[] = [];
  jobs: any[] = [];

  constructor(private userService: UserService, private studentService: StudentService
  ) {}

  ngOnInit(){
    this.loadCourses();
    this.loadInternships();
    this.loadJobs();
  }

  loadCourses(): void {
    this.userService.getCourses().subscribe({
      next: (courses) => {
         this.courses = courses;
         this.updateRatings();
         console.log('Courses fetched successfully', this.courses);
      },
      error: (err) => {
        console.error('Failed to load courses', err);
      }
    });
  }

  loadInternships(): void {
    this.userService.getAllInternships().subscribe({
      next: (internships) => {
        this.internships = internships;
        console.log('Internships fetched successfully', this.internships);
      },
      error: (err) => {
        console.error('Failed to load internships', err);
      }
    });
  }

  loadJobs(): void {
    this.userService.getAllJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;   
        console.log('Jobs fetched successfully', this.jobs);
      },
      error: (err) => {
        console.error('Failed to load jobs', err);
      }
    });
  }

  //courses
    enrollFree(courseId: number) {
    this.studentService.enrollInFreeCourse(courseId).subscribe(res => {
      alert(res);
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
    });
  }

  updateRatings(): void {
  this.courses.forEach(course => {
    this.userService.getAverageRating(course.id).subscribe({
      next: (rating: number) => {
        this.courseRatings[course.id] = rating;
      },
      error: (err) => {
        console.error(`Error fetching rating for course ${course.id}`, err);
        this.courseRatings[course.id] = 0; // default/fallback
      }
    });
  });
}

}
