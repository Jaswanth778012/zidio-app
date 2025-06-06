import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmployerService } from '../../_services/employer.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-internship-management',
  templateUrl: './internship-management.component.html',
  styleUrl: './internship-management.component.css'
})
export class InternshipManagementComponent implements OnInit{
  
    internshipForm!: FormGroup;
    selectedInternshipFile: File | null = null;
    internships: any[] = [];
    currentInternshipPage: number = 1;
internshipPageSize: number = 3;
totalInternships: number = 0;
internshipSearchTerm: string = '';
    editInternship: any = null;
  
  constructor(private fb: FormBuilder, private employerService: EmployerService, private snackBar: MatSnackBar) { }
  ngOnInit(): void {
    // Initialization logic can go here
     this.initializeForms();
    this.loadInternships();

  }

  initializeForms() {

    this.internshipForm = this.fb.group({
      title: [''], description: [''], location: [''], duration: [''], stipend: [''],
      applicationDeadline: [''], startDate: [''], companyName: [''], aboutCompany: [''],
      numberOfOpenings: [''], eligibility: [''], perks: ['']
    });
  }

  onInternshipFileChange(event: any) {
    this.selectedInternshipFile = event.target.files[0];
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

  loadInternships(page: number = 1) {
  this.currentInternshipPage = page;
  this.employerService.getFilteredInternships(this.currentInternshipPage - 1, this.internshipPageSize, this.internshipSearchTerm)
    .subscribe(response => {
      this.internships = response.content;
      this.totalInternships = response.totalElements;
      console.log('Loaded paginated internships:', this.internships);
    });
}
onInternshipSearchChange() {
  this.loadInternships(1);
}
  goToInternshipPage(page: number): void {
  if (page < 1 || page > this.totalInternshipPages()) return;
  this.loadInternships(page);
}

totalInternshipPages(): number {
  return Math.ceil(this.totalInternships / this.internshipPageSize);
}

  deleteInternship(id: number) {
    const confirmed = window.confirm('Are you sure you want to delete this job?');

  if (confirmed) {
    this.employerService.deleteInternship(id).subscribe(() => {
      this.loadInternships();
      this.snackBar.open('Job deleted successfully', 'Close', { duration: 3000 });
    });
  }
  }

}
