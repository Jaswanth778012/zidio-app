import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { Syllabus } from '../../_model/syllabus.model';

@Component({
  selector: 'app-syllabus',
  templateUrl: './syllabus.component.html',
  styleUrl: './syllabus.component.css'
})
export class SyllabusComponent implements OnChanges {
   @Input() course?: { id: number; courseName: string };
  syllabuses: Syllabus[] = [];
  selectedSyllabus?: Syllabus;
  newSyllabus: Partial<Syllabus> = { title: '', description: '' };

  constructor(private adminService: AdminService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['course'] && this.course) {
      this.loadSyllabuses();
    }
  }

  loadSyllabuses() {
    if (!this.course) return;
    this.adminService.getByCourseId(this.course.id).subscribe(data => {
      this.syllabuses = data;
      console.log('Syllabuses loaded:', this.syllabuses);
      this.selectedSyllabus = undefined;
    });
  }

  selectSyllabus(syllabus: Syllabus) {
    this.selectedSyllabus = syllabus;
  }

 addSyllabus() {
    if (!this.course || !this.course.id || !this.newSyllabus.title) return;


    const syllabus = {// Assuming the backend will assign an ID
      title: this.newSyllabus.title,
      description: this.newSyllabus.description || '',
      course: { id: this.course.id }
    } as Syllabus;
    console.log('Creating syllabus:', syllabus);
    this.adminService.create(syllabus).subscribe(() => {
      this.newSyllabus = { title: '', description: '' };
      this.loadSyllabuses();
    });
  } 

  updateSyllabus() {
  if (!this.selectedSyllabus) return;

  if (!this.selectedSyllabus.title) {
    alert('Title is required to update syllabus');
    return;
  }

  // Ensure course is set (backend requires it)
  if (!this.selectedSyllabus.course && this.course) {
    this.selectedSyllabus.course = { id: this.course.id };
  }

  console.log('Updating syllabus:', this.selectedSyllabus);

  this.adminService.update(this.selectedSyllabus.id!, this.selectedSyllabus).subscribe(() => {
    alert('Syllabus updated successfully');
    this.selectedSyllabus = undefined;
    this.loadSyllabuses();
  }, error => {
    console.error('Error updating syllabus', error);
    alert('Failed to update syllabus');
  });
}

deleteSyllabus(id: number) {
  if (!id) return;

  if (!confirm('Are you sure you want to delete this syllabus?')) return;

  this.adminService.delete(id).subscribe(() => {
    alert('Syllabus deleted');
    if (this.selectedSyllabus && this.selectedSyllabus.id === id) {
      this.selectedSyllabus = undefined;
    }
    this.loadSyllabuses();
  }, error => {
    console.error('Error deleting syllabus', error);
    alert('Failed to delete syllabus');
  });
}


//   syllabuses: any[] = [];
//   syllabus: any = { title: '', description: '' };
//   fetchedSyllabus: any = null;
//   loading = true;

//   video: any = { title: '', description: '', videoUrl: '', duration: null, syllabusId: null };
//   file: File | null = null;
//   fetchedVideo: any = null;


//   constructor(private adminService: AdminService) { }

//   ngOnInit(): void {
//      this.loadAll();
//   }

//   loadAll(): void {
//     this.loading = true;
//     this.adminService.getAllSyllabus().subscribe(
//       (data) => {
//         this.syllabuses = data;
//         this.loading = false;
//       },
//       (error) => {
//         console.error('Error fetching syllabuses:', error);
//         this.loading = false;
//       }
//     );
//   }

//   save() {
//     if (this.syllabus.id) {
//       this.adminService.update(this.syllabus.id, this.syllabus).subscribe(() => this.loadAll());
//     } else {
//       this.adminService.create(this.syllabus).subscribe(() => this.loadAll());
//     }
//     this.syllabus = {};
//   }

//   getById(id: number) {
//     this.adminService.getById(id).subscribe(data => this.fetchedSyllabus = data);
//   }

//   edit(s: any) {
//     this.syllabus = { ...s };
//   }

//   delete(id: number) {
//     this.adminService.delete(id).subscribe(() => this.loadAll());
//   }

//   //for video management
//    onFileSelected(event: any) {
//     this.file = event.target.files[0];
//   }

//   saveVideoContent() {
//     const formData = new FormData();
//     formData.append('title', this.video.title);
//     formData.append('description', this.video.description);
//     formData.append('syllabusId', this.video.syllabusId);

//     if (this.file) {
//       formData.append('file', this.file);
//     } else if (this.video.videoUrl) {
//       formData.append('videoUrl', this.video.videoUrl);
//       formData.append('duration', this.video.duration);
//     } else {
//       alert("Provide either a video file or a video URL with duration.");
//       return;
//     }

//     this.adminService.createVideo(formData).subscribe(() => alert("Video uploaded"));
//   }

//   updateVideoContent() {
//   if (!this.video.id) {
//     alert("No video selected for update.");
//     return;
//   }

//   const formData = new FormData();
//   formData.append('title', this.video.title);
//   formData.append('description', this.video.description);
//   formData.append('syllabusId', this.video.syllabusId);

//   if (this.file) {
//     formData.append('file', this.file);
//   } else if (this.video.videoUrl) {
//     formData.append('videoUrl', this.video.videoUrl);
//     formData.append('duration', this.video.duration);
//   } else {
//     alert("Provide either a new video file or a video URL with duration.");
//     return;
//   }

//   this.adminService.updateVideo(this.video.id, formData).subscribe({
//     next: () => {
//       alert("Video updated successfully.");
//       this.video = { title: '', description: '', videoUrl: '', duration: null, syllabusId: null };
//       this.file = null;
//     },
//     error: (err) => {
//       console.error("Error updating video:", err);
//       alert("Video update failed.");
//     }
//   });
// }


//   getVideoById(id: number) {
//     this.adminService.getByVideoId(id).subscribe(data => this.fetchedVideo = data);
//   }

//   deleteVideo(id: number) {
//     this.adminService.deleteVideo(id).subscribe(() => alert("Video deleted"));
//   }
}
