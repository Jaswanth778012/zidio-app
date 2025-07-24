import { Component } from '@angular/core';
import { StudentService } from '../_services/student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../_services/user.service';


@Component({
  selector: 'app-internship-details',
  templateUrl: './internship-details.component.html',
  styleUrl: './internship-details.component.css'
})
export class InternshipDetailsComponent {
id!: number;
internship: any;
loading = true;
constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) {}

ngOnInit(): void {
  this.id = Number(this.route.snapshot.paramMap.get('id'));
  this.fetchInternship();
}
fetchInternship(): void {
  this.userService.getInternshipById(this.id).subscribe(
    (data) => {
      setTimeout(() => {
        this.internship = data;
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
    this.router.navigate(['internshipsapply', this.internship.id]);
  }
}
