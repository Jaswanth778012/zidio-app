import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmployerService } from '../../_services/employer.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-job-management',
  templateUrl: './job-management.component.html',
  styleUrl: './job-management.component.css'
})
export class JobManagementComponent implements OnInit {
  jobForm!: FormGroup;
    selectedJobFile: File | null = null;
    jobs: any[] = [];
    currentPage: number = 1;
pageSize: number = 3;
totalJobs: number = 0;
searchTerm: string='';
    editJob: any = null;
  constructor(private fb: FormBuilder, private employerService: EmployerService, private snackBar: MatSnackBar) { }
  ngOnInit(): void {

    this.initializeForms();
    this.loadJobs();
  }

  initializeForms() {
    this.jobForm = this.fb.group({
      title: [''], description: [''], location: [''], skillsRequired: [''],
      salary: [''], startDate: [''], applicationDeadline: [''], companyName: [''],
      aboutCompany: [''], numberOfOpenings: [''], eligibility: [''], perks: ['']
    });
  }

  onJobFileChange(event: any) {
    this.selectedJobFile = event.target.files[0];
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
  loadJobs(page: number = 1) {
  this.currentPage = page;
  this.employerService.getFilteredJobs(this.currentPage - 1, this.pageSize, this.searchTerm)
    .subscribe(response => {
      this.jobs = response.content;
      this.totalJobs = response.totalElements;
    });
}

onSearchChange() {
  this.loadJobs(1);
}
  goToPage(page: number): void {
  if (page < 1 || page > this.totalPages()) return;
  this.loadJobs(page);
}

totalPages(): number {
  return Math.ceil(this.totalJobs / this.pageSize);
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

}
