import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StudentService } from '../_services/student.service';
declare var Razorpay: any;
@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit{
   courses: any[] = [];
   courseRatings: { [key: number]: number } = {};

  filteredCourses: any[] = [];
  paginatedCourses: any[] = [];

  currentPage = 1;
  pageSize = 20;
  totalPages = 1;

  filters = {
    search: '',
    priceMin: null,
    priceMax: null,
    durationMin: null,
    durationMax: null
  };

  constructor(public userService: UserService, private studentService: StudentService) {}

  ngOnInit(): void {
      this.loadCourses();
  }

 loadCourses(): void {
  this.userService.getCourses().subscribe({
    next: (data) => {
      this.courses = data.map(course => ({
        ...course,
        duration: this.calculateDuration(course.startDate, course.endDate)
      }));
      this.filteredCourses = [...this.courses];
      this.applyFilters();
      this.updateRatings();
    },
    error: (err) => console.error('Error loading courses:', err)
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


  applyFilters() {
    const search = this.filters.search.toLowerCase();

    this.filteredCourses = this.courses.filter(course => {
      const matchesSearch =
        course.courseName?.toLowerCase().includes(search) ||
        course.faculty?.userName?.toLowerCase().includes(search);

      const price = course.price || 0;
      const duration = course.duration || 0;

      const matchesPrice =
        (this.filters.priceMin == null || price >= this.filters.priceMin) &&
        (this.filters.priceMax == null || price <= this.filters.priceMax);

      const matchesDuration =
        (this.filters.durationMin == null || duration >= this.filters.durationMin) &&
        (this.filters.durationMax == null || duration <= this.filters.durationMax);

      return matchesSearch && matchesPrice && matchesDuration;
    });

    this.currentPage = 1;
    this.updatePagination();
  }

   updatePagination() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedCourses = this.filteredCourses.slice(startIndex, endIndex);
    this.totalPages = Math.max(1, Math.ceil(this.filteredCourses.length / this.pageSize));

    console.log('Pagination updated: page', this.currentPage, 'of', this.totalPages);
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

  calculateDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffInMs = end.getTime() - start.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
 return Math.ceil(diffInDays / 7);
 // Prevent negative durations
}

}
