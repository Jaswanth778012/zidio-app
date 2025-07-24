import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../../_services/student.service';

@Component({
  selector: 'app-learning-detail',
  templateUrl: './learning-detail.component.html',
  styleUrl: './learning-detail.component.css'
})
export class LearningDetailComponent implements OnInit {
id!: number;
enrollment: any;
  course: any;
  student: any;
  progress: any;
  selectedVideo: any;
   watchedVideoIds: number[] = [];



  constructor(private route: ActivatedRoute, private studentService: StudentService) {}

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    // Now you can use this.id to load course data
    this.loadEnrollment();
  }

   loadEnrollment(): void {
    this.studentService.getEnrollmentForCourse(this.id).subscribe(enrollment => {
      this.enrollment = enrollment;
      this.course = enrollment.course;
      this.student = enrollment.student;
      this.progress = this.course.progress?.find(
        (p: any) => p.student.userName === this.student.userName
      );

      if (this.progress && this.progress.video) {
        this.watchedVideoIds = [this.progress.video.id];
      }

      // Set selected video
      if (this.progress?.video) {
        this.selectedVideo = this.progress.video;
      } else if (
        this.course.syllabus?.length > 0 &&
        this.course.syllabus[0].videos?.length > 0
      ) {
        this.selectedVideo = this.course.syllabus[0].videos[0];
      }
    });
  }

  playVideo(video: any): void {
    this.selectedVideo = video;

    this.studentService.markVideoWatched(video.id).subscribe(updatedProgress => {
      this.progress = updatedProgress;
      if (!this.watchedVideoIds.includes(video.id)) {
        this.watchedVideoIds.push(video.id);
      }
    }, err => {
      console.error('Progress update failed', err);
    });
  }

  isWatched(videoId: number): boolean {
    return this.watchedVideoIds.includes(videoId);
  }

  
}
