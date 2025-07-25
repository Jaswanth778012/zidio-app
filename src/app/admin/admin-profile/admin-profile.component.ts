import { Component, OnInit } from '@angular/core';
import { AdminProfile } from '../../_model/admin-profile.model';
import { AdminService } from '../../_services/admin.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent implements OnInit{
  profileForm: FormGroup;
  profilePicturePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(private adminService: AdminService,private fb: FormBuilder,private router: Router) {this.profileForm = this.fb.group({
      userFirstName: [''],
      userLastName: [''],
      email: [''],
      phone: ['']
    });}
  ngOnInit(): void {
    this.adminService.getProfile().subscribe(data =>{
      this.profileForm.patchValue(data);
      if ( data.profilePictureUrl) {
        this.profilePicturePreview =  data.profilePictureUrl;
      }
    });
  }

  onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => (this.profilePicturePreview = reader.result);
    reader.readAsDataURL(file); // ✅ file is definitely not null here
  }
}


  onSubmit(): void {
  const formData = new FormData();
  formData.append('userFirstName', this.profileForm.value.userFirstName);
  formData.append('userLastName', this.profileForm.value.userLastName);
  formData.append('email', this.profileForm.value.email);
  if (this.profileForm.value.phone) formData.append('phone', this.profileForm.value.phone);
  if (this.selectedFile) formData.append('profilePicture', this.selectedFile);

  this.adminService.updateProfile(formData).subscribe({
    next: (response) => {
      alert('Profile updated successfully!');
       
      // Reset the form to empty values:
      this.profileForm.reset();
      this.profilePicturePreview = null; // Clear the image preview
      this.selectedFile = null;
      this.router.navigate(['/admin']); // Navigate to the profile page
    },
    error: (error) => {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  });
}




    // this.adminService.updateProfile(formData).subscribe({
    //   next: response => {
    //     alert('Profile updated successfully!');
    //     this.imagePreview = response.profilePictureUrl
    //       ? `http://localhost:8080${response.profilePictureUrl}`
    //       : null;
    //   },
    //   error: () => {
    //     alert('Failed to update profile');
    //   }
    // });
  }



