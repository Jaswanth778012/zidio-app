import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployerService } from '../../_services/employer.service';
import { Interview } from '../../_model/Interview.model';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrl: './interview.component.css'
})
export class InterviewComponent implements OnInit {

  interviewForm!: FormGroup;
  submitted = false;
  generatedMeetingLink: string | null = null;
  constructor(private fb: FormBuilder, private employerService: EmployerService){}

  ngOnInit(): void {
       this.interviewForm = this.fb.group({
      studentUserName: ['', Validators.required],
      jobId: [null],
      internshipId: [null],
      interviewDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      mode: ['ONLINE', Validators.required],
      location: ['', Validators.required],
      notes: ['']
    });
  }

  submitForm(): void {
    this.submitted = true;
    this.generatedMeetingLink = null;

    if (this.interviewForm.invalid) return;

    const formValue = this.interviewForm.value;

    const interview: Interview = {
      student: { userName: formValue.studentUserName },
      job: formValue.jobId ? { id: formValue.jobId } : null,
      internship: formValue.internshipId ? { id: formValue.internshipId } : null,
      interviewDate: formValue.interviewDate,
      startTime: formValue.startTime,
      endTime: formValue.endTime,
      mode: formValue.mode,
      location: formValue.location,
      notes: formValue.notes
    };

    this.employerService.createInterview(interview).subscribe({
      next: (res) => {
        alert('Interview created successfully');
        this.generatedMeetingLink = res.meetingLink || null;
        this.resetForm(false);
      },
      error: () => {
        alert('Failed to create interview');
      }
    });
  }

  

  resetForm(clearLink: boolean = true): void {
    this.interviewForm.reset();
    this.submitted = false;
    if (clearLink) this.generatedMeetingLink = null;
  }
}
