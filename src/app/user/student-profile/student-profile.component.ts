import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StudentService } from '../../_services/student.service';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrl: './student-profile.component.css'
})
export class StudentProfileComponent {
  profileForm: FormGroup;
  profilePicturePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(private studentService: StudentService,private fb: FormBuilder) {this.profileForm = this.fb.group({
      userFirstName: [''],
      userLastName: [''],
      email: [''],
      phone: [''],
      college: [''],
      branch: [''],
      department: [''],
      graduationYear: [''],
      skills: [[]],
      resumeUrl: [''],
    });}
    ngOnInit(): void{
      this.studentService.getProfile().subscribe(data=>{
        this.profileForm.patchValue(data);
        if(data.profilePictureUrl){
          const baseUrl = 'http://localhost:8080';
          this.profilePicturePreview = baseUrl +data.profilePictureUrl;
        }
      });
    }

    onFileSelected(event: any): void{
      const file = event.target.files[0];
      if(file){
        this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = () => (this.profilePicturePreview = reader.result);
        reader.readAsDataURL(file);
      }
    }
      onSubmit(): void{
        const formData = new FormData();
        formData.append('userFirstName', this.profileForm.value.userFirstName);
        formData.append('userLastName', this.profileForm.value.userLastName);
        formData.append('email', this.profileForm.value.email);
        if (this.profileForm.value.phone) formData.append('phone', this.profileForm.value.phone);
        if (this.profileForm.value.college) formData.append('college', this.profileForm.value.college);
        if (this.profileForm.value.branch) formData.append('branch', this.profileForm.value.branch);
        if (this.profileForm.value.department) formData.append('department', this.profileForm.value.department);
        if (this.profileForm.value.graduationYear) formData.append('graduationYear', this.profileForm.value.graduationYear.toString());
        const skillsValue = this.profileForm.value.skills;
        if(skillsValue)
        {
          const skills = Array.isArray(skillsValue)? skillsValue.join(','): skillsValue;
          formData.append('skills', skills);
        }
        if (this.profileForm.value.resumeUrl) formData.append('resumeUrl', this.profileForm.value.resumeUrl);
        if (this.selectedFile) formData.append('profilePicture', this.selectedFile);

        this.studentService.updateProfile(formData).subscribe({
          next: (response) => {
            alert('Profile updated successfully!');
            // Reset the form to empty values:
            this.profileForm.reset();
            // Clear the image preview and selected file
            this.profilePicturePreview = null;
            this.selectedFile = null;
          },
          error: (error) => {
            console.error('Error updating profile:', error);
          }
        });
      }

    
}
