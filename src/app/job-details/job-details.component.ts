import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../_services/student.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnInit {
id!: number;
job: any;
loading = true;

constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) {}

ngOnInit(): void {
  this.id = Number(this.route.snapshot.paramMap.get('id'));
  this.fetchJob();
}

fetchJob(): void {
  this.userService.getJobById(this.id).subscribe(
    (data) => {
      setTimeout(() => {
        this.job = data;
        this.loading = false;
      }, 1000); // ✅ Artificial delay for testing
    },
    (error) => {
      this.loading = false;
      console.error('Error fetching job details:', error);
    }
  );
}


applyNow() {
    this.router.navigate(['jobsapply', this.job.id]);
  }
}