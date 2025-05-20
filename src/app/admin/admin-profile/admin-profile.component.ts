import { Component, OnInit } from '@angular/core';
import { AdminProfile } from '../../_model/admin-profile.model';
import { AdminService } from '../../_services/admin.service';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent implements OnInit{
   profile: AdminProfile = {
    userFirstName: '',
    userLastName: '',
    username: '',
    email: '',
    phone: ''
  };
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private adminService: AdminService) {}
  ngOnInit(): void {
    this.adminService.getProfile().subscribe({
      next: profile => {
        this.profile = profile;
        this.imagePreview = profile.profilePictureUrl
          ? `http://localhost:8080${profile.profilePictureUrl}`
          : null;
      },
      error: () => {
        console.warn('No profile found for current user');
      }
    });
  }

  onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => (this.imagePreview = reader.result);
    reader.readAsDataURL(file); // ✅ file is definitely not null here
  }
}


   onSubmit(): void {
    const formData = new FormData();
    formData.append('userFirstName', this.profile.userFirstName);
    formData.append('userLastName', this.profile.userLastName);
    formData.append('email', this.profile.email);
    if (this.profile.phone) formData.append('phone', this.profile.phone);
    if (this.selectedFile) formData.append('profilePicture', this.selectedFile);

    this.adminService.updateProfile(formData).subscribe({
      next: response => {
        alert('Profile updated successfully!');
        this.imagePreview = response.profilePictureUrl
          ? `http://localhost:8080${response.profilePictureUrl}`
          : null;
      },
      error: () => {
        alert('Failed to update profile');
      }
    });
  }


}
