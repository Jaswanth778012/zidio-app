import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../../_services/student.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApplicationQuestion } from '../../_model/applicationQuestion.model';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrl: './application.component.css'
})
export class ApplicationComponent {
  id!: number;
  job: any;
  applicationForm!: FormGroup;
  resumeFile!: File;
  constructor(private route: ActivatedRoute, private studentService: StudentService,private fb: FormBuilder,private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchJob();
    this.initForm();
    this.loadJobQuestions();
  }

  fetchJob(): void {
    this.studentService.getJobById(this.id).subscribe({
      next: data => {
        this.job = data;
        console.log('Job fetched successfully', data);
      },
      error: err => console.error('Failed to load job', err)
    });
  }

  initForm(): void {
    this.applicationForm = this.fb.group({
      userFirstName: [''],
      userLastName: [''],
      gender: [''],
      dateOfBirth: [''],
      email: [''],
      countryCode: ['+91'],
      phone: [''],
      aadharNumber: [''],
      currentAddressSameAsPermanent: [false],
      currentAddress: this.fb.group({
        line1: [''],
        line2: [''],
        country: [''],
        state: [''],
        city: [''],
        zipCode: ['']
      }),
      permanentAddress: this.fb.group({
        line1: [''],
        line2: [''],
        country: [''],
        state: [''],
        city: [''],
        zipCode: ['']
      }),
      educationHistory: this.fb.array([]),
      workExperiences: this.fb.array([]),
      certifications: this.fb.array([]),
      skills: this.fb.array([]),
      languages: this.fb.array([]),
      applicationQuestions: this.fb.array([]),
      eSignature: ['']
    });
  }
  loadJobQuestions(): void {
    this.studentService.getApplicationQuestionsByJobId(this.id).subscribe({
      next: questions => {
        console.log('Job questions loaded successfully', questions);
        const questionArray = this.applicationForm.get('applicationQuestions') as FormArray;
        questions.forEach(q => {
          questionArray.push(this.fb.group({
            questionId: [q.id],
            questionText: [q.questionText],
            questionType: [q.questionType],
            options: [q.options || []],
            answer: ['']
          }));
        });
      },
      error: err => console.error('Failed to load job questions', err)
    });
  }

  onResumeFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.resumeFile = event.target.files[0];
    }
  }

 onSubmit(): void {
  if (!this.resumeFile) {
    this.snackBar.open('Please upload your resume.', 'Close', { duration: 3000 });
    return;
  }

  const formValue = this.applicationForm.value;

  // Transform applicationQuestions → applicationQuestionAnswers
  const applicationQuestionAnswers = formValue.applicationQuestions.map((q: any) => ({
    applicationQuestion: { id: q.questionId },
    answer: q.answer
  }));

  // Remove the old field
  delete formValue.applicationQuestions;

  // Add the transformed field
  formValue.applicationQuestionAnswers = applicationQuestionAnswers;

  // Prepare FormData
  const formData = new FormData();
  formData.append('application', new Blob([JSON.stringify(formValue)], { type: 'application/json' }));
  formData.append('resume', this.resumeFile);

  // Submit
  this.studentService.applyForJob(this.id, formData).subscribe({
    next: (response) => {
      console.log('Application submitted successfully:', response);
      this.snackBar.open('Application submitted successfully!', 'Close', { duration: 3000 });
    },
    error: (err) => {
  const errorMessage = typeof err === 'string' ? err : 'Failed to submit application.';

  if (errorMessage.includes('already applied')) {
    this.snackBar.open('You have already applied for this role.', 'Close', { duration: 5000 });
  } else {
    this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
  }
   }
  });
}



  get educationHistory(): FormArray {
    return this.applicationForm.get('educationHistory') as FormArray;
  }

  get workExperiences(): FormArray {
    return this.applicationForm.get('workExperiences') as FormArray;
  }

  get certifications(): FormArray {
    return this.applicationForm.get('certifications') as FormArray;
  }

  get skills(): FormArray {
    return this.applicationForm.get('skills') as FormArray;
  }

  get languages(): FormArray {
    return this.applicationForm.get('languages') as FormArray;
  }

  get applicationQuestions(): FormArray {
  return this.applicationForm.get('applicationQuestions') as FormArray;
}


  addEducation(): void {
  this.educationHistory.push(this.fb.group({
    degree: [''],
    fieldOfSpecialization: [''],
    courseType: [''],
    gpaorPercentage: [''],
    UniversityName: [''],
    startDate: [''],
    endDate: [''],
    country: [''],
    city: ['']
  }));
}

removeEducation(index: number): void {
  this.educationHistory.removeAt(index);
}


addExperience(): void {
  this.workExperiences.push(this.fb.group({
    employerName: [''],
    jobTitle: [''],
    startDate: [''],  // Format: YYYY-MM-DD
    endDate: [''],
    employerCountry: [''],
    employerCity: [''],
    responsibilities: ['']
  }));
}

removeExperience(index: number): void {
  this.workExperiences.removeAt(index);
}


addCertification(): void {
  this.certifications.push(this.fb.group({
    certificationName: [''],
    issuingOrganization: [''],
    issueDate: [''],
    fileUrl: ['']  // optional if uploading separately
  }));
}

  removeCertification(index: number): void {
  this.certifications.removeAt(index);
}


  addSkill(): void {
    this.skills.push(this.fb.control(''));
  }

  removeSkill(index: number): void {
  this.skills.removeAt(index);
  }


  addLanguage(): void {
    this.languages.push(this.fb.control(''));
  }

  removeLanguage(index: number): void {
  this.languages.removeAt(index);
}

  calculateDaysAgo(postedAt: string): number {
    const postedDate = new Date(postedAt);
    const today = new Date();
    const diff = Math.floor((today.getTime() - postedDate.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  }
}
