import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { UserAuthService } from '../_services/user-auth.service';
import { EmployerService } from '../_services/employer.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employer',
  templateUrl: './employer.component.html',
  styleUrl: './employer.component.css'
})
export class EmployerComponent implements OnInit {

  message: any;
  role: any;
  userName!: string | null;
   jobForm!: FormGroup;
  internshipForm!: FormGroup;
  selectedJobFile: File | null = null;
  selectedInternshipFile: File | null = null;
  jobs: any[] = [];
  currentPage: number = 1;
pageSize: number = 3;
totalJobs: number = 0;
  internships: any[] = [];
  currentInternshipPage: number = 1;
internshipPageSize: number = 3;
totalInternships: number = 0;
  editJob: any = null;
  editInternship: any = null;


  constructor(private userService : UserService, private authService:UserAuthService, private employerService: EmployerService,private fb: FormBuilder,private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    // Initialization logic can go here
    this.userName = this.authService.getUsername();
    this.role = this.authService.getRoles();
    this.forEmployer();
  this.initializeForms();
    this.loadJobs();
    this.loadInternships();
  }
  

  forEmployer(){
    this.userService.forEmployer().subscribe(
      (response: any) => {
        console.log(response);
        this.message = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  // Add any additional methods or properties needed for the EmployerComponent

}

initializeForms() {
    this.jobForm = this.fb.group({
      title: [''], description: [''], location: [''], skillsRequired: [''],
      salary: [''], startDate: [''], applicationDeadline: [''], companyName: [''],
      aboutCompany: [''], numberOfOpenings: [''], eligibility: [''], perks: ['']
    });

    this.internshipForm = this.fb.group({
      title: [''], description: [''], location: [''], duration: [''], stipend: [''],
      applicationDeadline: [''], startDate: [''], companyName: [''], aboutCompany: [''],
      numberOfOpenings: [''], eligibility: [''], perks: ['']
    });
  }

  onJobFileChange(event: any) {
    this.selectedJobFile = event.target.files[0];
  }

  onInternshipFileChange(event: any) {
    this.selectedInternshipFile = event.target.files[0];
  }

  createJob() {
    if (this.selectedJobFile) {
      this.employerService.createJob(this.jobForm.value, this.selectedJobFile).subscribe(() => {
        this.loadJobs();
        this.jobForm.reset();
        this.selectedJobFile = undefined!;
      });
    } else {
      // Optionally, show an error or handle the case where no file is selected
      alert('Please select a file before creating a job.');
    }
  }

  updateJob(id: number) {
    this.employerService.updateJob(
      id,
      this.jobForm.value,
      this.selectedJobFile === null ? undefined : this.selectedJobFile
    ).subscribe(() => {
      this.loadJobs();
      this.jobForm.reset();
      this.selectedJobFile = undefined!;
      this.editJob = null;
    });
  }

  editJobForm(job: any) {
    this.editJob = job;
    this.jobForm.patchValue(job);
  }

  createInternship() {
    if(this.selectedInternshipFile){
    this.employerService.createInternship(this.internshipForm.value, this.selectedInternshipFile).subscribe(() => {
      this.loadInternships();
      this.internshipForm.reset();
      this.selectedInternshipFile = undefined!;
    });
  }
  else{
    alert('Please select a file before creating a internship.');

  }
  }

  updateInternship(id: number) {
    this.employerService.updateInternship(
      id,
      this.internshipForm.value,
      this.selectedInternshipFile === null ? undefined : this.selectedInternshipFile
    ).subscribe(() => {
      this.loadInternships();
      this.internshipForm.reset();
      this.selectedInternshipFile = undefined!;
      this.editInternship = null;
    });
  }

  editInternshipForm(internship: any) {
    this.editInternship = internship;
    this.internshipForm.patchValue(internship);
  }


  loadJobs(page: number = 1): void {
  this.currentPage = page;
  this.employerService.getJobsPaged(this.currentPage - 1, this.pageSize).subscribe(response => {
    this.jobs = response.content;
    this.totalJobs = response.totalElements;
    console.log('Loaded paginated jobs:', this.jobs);
  });
}

goToPage(page: number): void {
  if (page < 1 || page > this.totalPages()) return;
  this.loadJobs(page);
}

totalPages(): number {
  return Math.ceil(this.totalJobs / this.pageSize);
}


 loadInternships(page: number = 1): void {
  this.currentInternshipPage = page;
  this.employerService.getInternshipsPaged(this.currentInternshipPage - 1, this.internshipPageSize).subscribe(response => {
    this.internships = response.content;
    this.totalInternships = response.totalElements;
    console.log('Loaded paginated internships:', this.internships);
  });
}
 goToInternshipPage(page: number): void {
  if (page < 1 || page > this.totalInternshipPages()) return;
  this.loadInternships(page);
}

totalInternshipPages(): number {
  return Math.ceil(this.totalInternships / this.internshipPageSize);
}

  deleteJob(id: number) {
    const confirmed = window.confirm('Are you sure you want to delete this job?');

  if (confirmed) {
    this.employerService.deleteJob(id).subscribe(() => {
      this.loadJobs();
      this.snackBar.open('Job deleted successfully', 'Close', { duration: 3000 });
    });
  }
  }

  deleteInternship(id: number) {
    this.employerService.deleteInternship(id).subscribe(() => this.loadInternships());
  }
}


