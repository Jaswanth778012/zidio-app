import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployerService } from '../../_services/employer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Interview } from '../../_model/Interview.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-interview-update',
  templateUrl: './interview-update.component.html',
  styleUrl: './interview-update.component.css'
})
export class InterviewUpdateComponent implements OnInit{
   interviewForm!: FormGroup;
  interviewId!: number;
  submitted = false;
  generatedMeetingLink: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private employerService: EmployerService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

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

    this.route.params.subscribe(params => {
      this.interviewId = +params['id'];
      this.loadInterview();
    });
  }

  loadInterview(): void {
    this.employerService.getInterviewById(this.interviewId).subscribe((interview: Interview) => {
      this.interviewForm.patchValue({
        studentUserName: interview.student?.userName,
        jobId: interview.job?.id,
        internshipId: interview.internship?.id,
        interviewDate: interview.interviewDate,
        startTime: interview.startTime,
        endTime: interview.endTime,
        mode: interview.mode,
        location: interview.location,
        notes: interview.notes
      });
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

    this.employerService.updateInterview(this.interviewId, interview).subscribe({
      next: (res) => {
         alert('Interview rescheduled successfully');
        this.generatedMeetingLink = res.meetingLink || null;
        this.router.navigate(['/employer']);
      },
      error: () => {
        this.snackBar.open('Failed to update interview', 'Close', { duration: 3000 });
      }
    });
  }
  
}
