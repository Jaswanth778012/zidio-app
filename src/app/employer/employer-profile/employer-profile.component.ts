import { Component } from '@angular/core';
import { EmployerService } from '../../_services/employer.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Application } from '../../_model/Application.model';

@Component({
  selector: 'app-employer-profile',
  templateUrl: './employer-profile.component.html',
  styleUrl: './employer-profile.component.css'
})
export class EmployerProfileComponent {
  profileForm: FormGroup;
  profilePicturePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  //  applications: Application[] = [];
  // selectedStatus: string = 'PENDING';

  constructor(private employerService: EmployerService, private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      userFirstName: [''],
      userLastName: [''],
      email: [''],
      phone: [''],
      position: [''],
      companyName: [''],
      companyWebsiteURL: [''],
      industry: [''],
      companyType: ['']
    });
  }

  ngOnInit(): void {
    this.employerService.getProfile().subscribe(data => {
      this.profileForm.patchValue(data);
      if (data.profilePictureUrl) {
        const baseUrl = 'http://localhost:8080';
        this.profilePicturePreview = baseUrl + data.profilePictureUrl;
      }
    });
    // this.loadAll();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.profilePicturePreview = reader.result);
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('userFirstName', this.profileForm.value.userFirstName);
    formData.append('userLastName', this.profileForm.value.userLastName);
    formData.append('email', this.profileForm.value.email);
    if (this.profileForm.value.phone) formData.append('phone', this.profileForm.value.phone);
    formData.append('position', this.profileForm.value.position);
    formData.append('companyName', this.profileForm.value.companyName);
    if (this.profileForm.value.companyWebsiteURL) formData.append('companyWebsiteURL', this.profileForm.value.companyWebsiteURL);
    formData.append('industry', this.profileForm.value.industry);
    formData.append('companyType', this.profileForm.value.companyType);
    
    if (this.selectedFile) formData.append('profilePicture', this.selectedFile);

    this.employerService.updateProfile(formData).subscribe({
      next: (response) => {
        alert('Profile updated successfully!');
        this.profileForm.reset();
        this.profilePicturePreview = null; // Clear the image preview
        this.selectedFile = null; // Clear the selected file
        console.log(this.profileForm.value);
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
      }
    });
  }
  //  loadAll() {
  //   this.employerService.getAllApplications().subscribe(data => this.applications = data);
  // }

  // updateStatus(id: number) {
  //   this.employerService.updateApplicationStatus(id, this.selectedStatus).subscribe(() => this.loadAll());
  // }

  // deleteApplication(id: number) {
  //   if (confirm('Are you sure to delete this application?')) {
  //     this.employerService.deleteApplication(id).subscribe(() => this.loadAll());
  //   }
  // }

}
