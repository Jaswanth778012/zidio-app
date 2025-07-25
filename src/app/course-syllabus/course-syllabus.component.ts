import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-course-syllabus',
  templateUrl: './course-syllabus.component.html',
  styleUrl: './course-syllabus.component.css'
})
export class CourseSyllabusComponent {
@Input() syllabusList: any[] = [];
@Input() enrolled: boolean = false; 
expandedSyllabusId: number | null = null;
course: any = {};

toggleExpand(syllabusId: number): void{
  this.expandedSyllabusId = this.expandedSyllabusId === syllabusId ? null : syllabusId;
}

openVideo(url: string): void {
  if (this.enrolled && url) {
    window.open(url, '_blank');
  } else {
    alert('Please enroll in this course to access the video.');
  }
}
}
