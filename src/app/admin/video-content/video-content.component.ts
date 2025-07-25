import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { VideoContent } from '../../_model/video-content.model';
import { AdminService } from '../../_services/admin.service';

@Component({
  selector: 'app-video-content',
  templateUrl: './video-content.component.html',
  styleUrl: './video-content.component.css'
})
export class VideoContentComponent implements OnChanges{
   @Input() syllabus?: { id: number; title: string };
  videos: VideoContent[] = [];

  title = '';
  description = '';
  videoUrl = '';
  duration?: number;
  file?: File;
  editingVideoId?: number;


  constructor(private adminService: AdminService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['syllabus'] && this.syllabus) {
      this.loadVideos();
    }
  }

  loadVideos() {
    if (!this.syllabus) return;
    this.adminService.getVideoBySyllabusId(this.syllabus.id).subscribe(data => this.videos = data);
    console.log('Videos loaded for syllabus:', this.syllabus);
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  addVideo() {
    if (!this.syllabus || !this.title || !this.description) {
      alert('Please fill in title and description.');
      return;
    }

    if (!this.file && !this.videoUrl) {
      alert('Please provide a video file or video URL.');
      return;
    }

    if (this.videoUrl && (!this.duration || this.duration <= 0)) {
      alert('Duration must be provided and positive when using a video URL.');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);

    if (this.file) {
      formData.append('file', this.file);
    } else {
      formData.append('videoUrl', this.videoUrl);
      formData.append('duration', this.duration!.toString());
    }

    this.adminService.addVideoContent(this.syllabus.id, formData).subscribe(() => {
      this.title = '';
      this.description = '';
      this.videoUrl = '';
      this.duration = undefined;
      this.file = undefined;
      this.loadVideos();
    }, err => {
      alert('Error uploading video');
      console.error(err);
    });
  }

  editVideo(video: VideoContent) {
  this.editingVideoId = video.id;
  this.title = video.title;
  this.description = video.description;
  this.videoUrl = video.videoUrl || '';
  this.duration = video.duration || undefined;
  this.file = undefined; // Optional: Reset if editing existing video
}
  updateVideo() {
  if (!this.editingVideoId) {
    alert("No video selected for update.");
    return;
  }

  const formData = new FormData();
  formData.append('title', this.title);
  formData.append('description', this.description);

  if (this.file) {
    formData.append('file', this.file);
  } else if (this.videoUrl) {
    if (!this.duration || this.duration <= 0) {
      alert('Duration must be provided and positive for URL.');
      return;
    }
    formData.append('videoUrl', this.videoUrl);
    formData.append('duration', this.duration.toString());
  } else {
    alert('Provide either a video file or video URL.');
    return;
  }

  this.adminService.updateVideo(this.editingVideoId, formData).subscribe(() => {
    this.resetForm();
    this.loadVideos();
  }, err => {
    alert('Update failed');
    console.error(err);
  });
}
  deleteVideo(id: number) {
  if (confirm("Are you sure you want to delete this video?")) {
    this.adminService.deleteVideo(id).subscribe(() => {
      this.loadVideos();
    }, err => {
      alert('Delete failed');
      console.error(err);
    });
  }
}
  resetForm() {
  this.title = '';
  this.description = '';
  this.videoUrl = '';
  this.duration = undefined;
  this.file = undefined;
  this.editingVideoId = undefined;
}


}
