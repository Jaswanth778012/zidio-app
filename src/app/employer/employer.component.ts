import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { UserAuthService } from '../_services/user-auth.service';
import { EmployerService } from '../_services/employer.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Application } from '../_model/Application.model';
import { Interview } from '../_model/Interview.model';

@Component({
  selector: 'app-employer',
  templateUrl: './employer.component.html',
  styleUrl: './employer.component.css'
})
export class EmployerComponent implements OnInit {
  Math = Math
  message: any;
  role: any;
  userName!: string | null;
  profilePictureUrl: string = 'assets/admin.png'; // Default image URL
  applications: Application[] = [];
  jobApplications: Application[] = [];
internshipApplications: Application[] = [];
  pageSize: number = 5;
currentPage: number = 1;

  groupedApplications: { [jobId: number]:{ applications:Application[], currentPage:number,pageSize: number }} = {};
  groupedJobIds: number[] = [];
  expandedJobId: number | null = null;

  selectedStatus: string = 'PENDING';
  selectedStatuses: { [applicationId: number]: string } = {};

  groupedInternshipApplications: { [internshipId: number]: {applications:Application[], currentPage:number, pageSize:number }} = {};
  groupedInternshipIds: number[] = [];
  expandedinternshipId: number | null = null;

  interviews: Interview[] = [];
  selectedinterview?: Interview;

  constructor(private userService : UserService, private userAuthService:UserAuthService, private employerService: EmployerService,private fb: FormBuilder,private snackBar: MatSnackBar,private router: Router) { }
  get totalPages(): number {
  return Math.ceil(this.groupedJobIds.length / this.pageSize);
}
  ngOnInit(): void {
    this.userName = this.userAuthService.getUsername();
    this.role = this.userAuthService.getRoles();
    this.forEmployer();
    this.employerService.getProfile().subscribe(profile=>{
      console.log('Profile:', profile);
      if (profile.profilePictureUrl) {
        this.profilePictureUrl = profile.profilePictureUrl;
      }
    })
    this.loadAll();
    this.updatePaginatedJobIds();
    this.updatePaginatedInternshipIds();
    this.fetchAllInterviews();
  }

  async ngAfterViewInit() {
    const Dropdown = (await import('bootstrap/js/dist/dropdown')).default;

    const dropdownToggle = document.getElementById('dropdownMenuButton');
    if (dropdownToggle) {
      new Dropdown(dropdownToggle);
    }
  }
  

  forEmployer(){
    this.userService.forEmployer().subscribe(
      (response: any) => {
        console.log(response);
        this.message = response;
      },
      (error: any) => {
        console.log(error);
      }
    );

}
loadAll() {
    this.employerService.getAllApplications().subscribe(data =>{ this.applications = data;this.jobApplications = data.filter(app => app.job);
    this.internshipApplications = data.filter(app => app.internship);this.setDefaultStatuses();this.groupApplicationsByJobId();this.groupInternshipApplicationsByInternshipId()
      
});
  }

//   downloadResume(id: number) {
//   this.employerService.downloadResume(id).subscribe(
//     (blob) => {
//       const fileName = `resume_${id}.pdf`; // Or use a better name if you can get from headers
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = fileName;
//       a.click();
//       window.URL.revokeObjectURL(url);
//     },
//     (error) => {
//       console.error('Failed to download resume:', error);
//       this.snackBar.open('Failed to download resume', 'Close', {
//         duration: 3000
//       });
//     }
//   );
// }
downloadResume(id: number) {
  this.employerService.downloadResume(id, { observe: 'response', responseType: 'blob' as 'json' }).subscribe({
    next: (response: any) => {
      const blob = new Blob([response.body], { type: response.headers.get('Content-Type') || 'application/octet-stream' });

      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = `resume_${id}.pdf`;
      if (contentDisposition) {
        const matches = /filename="(.+)"/.exec(contentDisposition);
        if (matches && matches[1]) {
          fileName = matches[1];
        }
      }

      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    error: (error) => {
      console.error('Failed to download resume:', error);
      this.snackBar.open('Failed to download resume', 'Close', { duration: 3000 });
    }
  });
}

setDefaultStatuses(): void {
    this.applications.forEach(app => {
      // Set to current status if exists, otherwise default to 'PENDING'
      this.selectedStatus = app.status || 'PENDING';
    });
  }

  groupApplicationsByJobId() {
    this.groupedApplications = {};
    this.groupedJobIds = [];

    for (const app of this.jobApplications) {
      const jobId = app.job?.id;
      if (!this.groupedApplications[jobId]) {
        this.groupedApplications[jobId] ={applications: [],currentPage:1,pageSize:3
        }
        this.groupedJobIds.push(jobId);
      }
      this.groupedApplications[jobId].applications.push(app);
      this.selectedStatus = app.status || 'PENDING'; // Initialize status
    }
  }
  updatePaginatedJobIds(): void {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.groupedJobIds = this.groupedJobIds.slice(startIndex, endIndex);
}

nextPage(): void {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.updatePaginatedJobIds();
  }
}

prevPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.updatePaginatedJobIds();
  }
}

   getPaginatedApplications(jobId: number): Application[] {
    const group = this.groupedApplications[jobId];
    const start = (group.currentPage - 1) * group.pageSize;
    return group.applications.slice(start, start + group.pageSize);
  }

  changePage(jobId: number, delta: number) {
    const group = this.groupedApplications[jobId];
    const maxPage = Math.ceil(group.applications.length / group.pageSize);
    group.currentPage = Math.max(1, Math.min(group.currentPage + delta, maxPage));
  }


  groupInternshipApplicationsByInternshipId(){
    this.groupedInternshipApplications={};
    this.groupedInternshipIds = [];

    for(const app of this.internshipApplications)
    {
      const internshipId = app.internship?.id;
      if(!this.groupedInternshipApplications[internshipId]){
        this.groupedInternshipApplications[internshipId] = {applications:[], currentPage:1,pageSize:3
        }
        this.groupedInternshipIds.push(internshipId);
      }
      
      this.groupedInternshipApplications[internshipId].applications.push(app);
      this.selectedStatuses[app.id] = app.status || 'PENDING'; // Initialize status
    }
  }
   updatePaginatedInternshipIds(): void {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.groupedInternshipIds = this.groupedInternshipIds.slice(startIndex, endIndex);
}

nextPage1(): void {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.updatePaginatedInternshipIds();
  }
}

prevPage1(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.updatePaginatedInternshipIds();
  }
}

   getPaginatedApplicationsi(internshipId: number): Application[] {
    const group = this.groupedInternshipApplications[internshipId];
    const start = (group.currentPage - 1) * group.pageSize;
    return group.applications.slice(start, start + group.pageSize);
  }

  changePagei(internshipId: number, delta: number) {
    const group = this.groupedInternshipApplications[internshipId];
    const maxPage = Math.ceil(group.applications.length / group.pageSize);
    group.currentPage = Math.max(1, Math.min(group.currentPage + delta, maxPage));
  }

  toggleJobApplications(jobId: number) {
    this.expandedJobId = this.expandedJobId === jobId ? null : jobId;
  }

  toggleInternshipApplications(internshipId: number) {
    this.expandedinternshipId = this.expandedinternshipId === internshipId ? null : internshipId;
  }


  updateStatus(id: number) {
    const newStatus = this.selectedStatuses[id];
    if(!newStatus) return;
    this.employerService.updateApplicationStatus(id, newStatus).subscribe(() => this.loadAll());
  }

//   getRecentApplications(): any[] {
//   if (!this.applications || this.applications.length === 0) {
//     return [];
//   }
//   const sortedApplications = [...this.applications].sort((a, b) => {
//       const dateA = new Date(a.appliedDate || a.timestamp || 0).getTime();
//       const dateB = new Date(b.appliedDate || b.timestamp || 0).getTime();
//       return dateB - dateA; // Descending order (newest first)
//     });
    
//     return sortedApplications.slice(0, 5);

// }
// Updated method to get recent applications sorted by ID (most recent first)
// getRecentApplications(): any[] {
//   if (!this.applications || this.applications.length === 0) {
//     return [];
//   }
  
//   // Since all applications have the same date, sort by ID (higher ID = more recent)
//   const sortedApplications = [...this.applications].sort((a, b) => {
//     // First try to sort by date if they're different
//     const dateA = new Date(a.appliedDate).getTime();
//     const dateB = new Date(b.appliedDate).getTime();
    
//     // If dates are the same, sort by ID (higher ID = more recent)
//     if (dateA === dateB) {
//       return b.id - a.id; // Descending order by ID
//     }
    
//     // If dates are different, sort by date (more recent first)
//     return dateB - dateA;
//   });
  
//   console.log('Applications sorted by ID (most recent first):', sortedApplications.map(app => ({
//     id: app.id,
//     appliedDate: app.appliedDate,
//     studentName: app.student?.userFirstName + ' ' + app.student?.userLastName
//   })));
  
//   // Return only the first 5 most recent applications
//   return sortedApplications.slice(0, 5);
// }
getRecentApplications(): any[] {
    if (!this.applications || this.applications.length === 0) {
      return [];
    }
    const sortedApplications = [...this.applications].sort((a, b) => b.id - a.id);
    
    console.log('Applications sorted by ID (most recent first):', sortedApplications.map(app => ({
      id: app.id,
      appliedDate: app.appliedDate,
      studentName: app.student?.userFirstName + ' ' + app.student?.userLastName
    })));
        return sortedApplications.slice(0, 5);
  }



// Method to shortlist an application
shortlistApplication(id: number): void {
  this.selectedStatuses[id] = 'SHORTLISTED';
  this.updateStatus(id);
}


rejectApplication(id: number): void {
  this.selectedStatuses[id] = 'REJECTED';
  this.updateStatus(id);
}

  deleteApplication(id: number) {
    if (confirm('Are you sure to delete this application?')) {
      this.employerService.deleteApplication(id).subscribe(() => this.loadAll());
    }
  }

  public logout()
  {
    this.userAuthService.clear();
    this.router.navigate(['/']);
  }

  //Interviews Schedule
  
  fetchAllInterviews(): void {
    this.employerService.getAllInterviews().subscribe(data => this.interviews = data);
  }

  getInterviewById(id: number): void {
  if (this.selectedinterview?.id === id) {
    this.selectedinterview = undefined; // Close if already open
  } else {
    this.employerService.getInterviewById(id).subscribe(data => this.selectedinterview = data);
  }
}


  deleteInterview(id: number): void {
    this.employerService.deleteInterview(id).subscribe(() => {
      this.interviews = this.interviews.filter(i => i.id !== id);
    });
  }
  // Method to get only the first 3 interviews (sorted by date)
getRecentInterviews(): Interview[] {
  if (!this.interviews || this.interviews.length === 0) {
    return [];
  }
  
  // Sort interviews by date (most recent/upcoming first)
  const sortedInterviews = [...this.interviews].sort((a, b) => {
    const dateA = new Date(a.interviewDate).getTime();
    const dateB = new Date(b.interviewDate).getTime();
    return dateA - dateB; // Ascending order (upcoming first)
  });
  
  // Return only the first 3 interviews
  return sortedInterviews.slice(0, 3);
}

// Method to navigate to all interviews page
viewAllInterviews(): void {
  this.router.navigate(['/employer/interviews']);
}


  viewAllApplications() {
  this.router.navigate(['/employer/applications']);
}

getRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'today';
  if (diff === 1) return '1 day ago';
  return `${diff} days ago`;

  
}

 isUpcoming(dateStr: string): boolean {
    const date = new Date(dateStr);
    const now = new Date();
    return date >= now;
  }

  isPast(dateStr: string): boolean {
    const date = new Date(dateStr);
    const now = new Date();
    return date < now;
  }
}


