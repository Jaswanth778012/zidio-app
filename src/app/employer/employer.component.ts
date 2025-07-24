import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { UserAuthService } from '../_services/user-auth.service';
import { EmployerService } from '../_services/employer.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Application, ApplicationStage } from '../_model/Application.model';
import { Interview } from '../_model/Interview.model';
import { CalendarEvent } from '../_model/CalendarEvent.model';
import { RemainderSnackbarComponent } from '../remainder-snackbar/remainder-snackbar.component';

@Component({
  selector: 'app-employer',
  templateUrl: './employer.component.html',
  styleUrl: './employer.component.css'
})
export class EmployerComponent implements OnInit {
  public ApplicationStage = ApplicationStage;
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

  selectedStatus: ApplicationStage = ApplicationStage.APPLICATIONS_RECEIVED;
  selectedStatuses: { [applicationId: number]: ApplicationStage } = {};

  groupedInternshipApplications: { [internshipId: number]: {applications:Application[], currentPage:number, pageSize:number }} = {};
  groupedInternshipIds: number[] = [];
  expandedinternshipId: number | null = null;

  interviews: Interview[] = [];
  selectedinterview?: Interview;
  counts: { [stage in ApplicationStage]?: number } = {};
  totalApplicationsCount: number = this.applications.length;

  currentMonth: Date = new Date();
    weeks: (Date | null)[][] = [];
    events: CalendarEvent[] = [];
  
    selectedDateEvents: CalendarEvent[] = [];
    selectedDate: Date | null = null;
  
    showEventModal = false;
    eventForm: FormGroup;
    editingEvent: CalendarEvent | null = null;
    upcomingEvents: CalendarEvent[] = [];

      reminderCheckInterval: any;
 remindedEventIds = new Set<number>() ;
  remindersEnabled: boolean = true;
    
  constructor(private userService : UserService, private userAuthService:UserAuthService, private employerService: EmployerService,private fb: FormBuilder,private snackBar: MatSnackBar,private router: Router) { this.eventForm = this.fb.group({
      title: [''],
      description: [''],
      dateTime: ['']
    });}
  get totalPages(): number {
  return Math.ceil(this.groupedJobIds.length / this.pageSize);
}
  ngOnInit(): void {
    this.userName = this.userAuthService.getUsername();
    this.role = this.userAuthService.getRoles();
    this.forEmployer();
    this.employerService.getProfile().subscribe(profile=>{
      if (profile.profilePictureUrl) {
        this.profilePictureUrl = profile.profilePictureUrl;
      }
    })
    this.loadAll();
    this.updatePaginatedJobIds();
    this.updatePaginatedInternshipIds();
    this.fetchAllInterviews();
    this.generateCalendar(this.currentMonth);
    this.loadUpcomingEvents();
    this.loadEvents();
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
  this.employerService.getAllApplications().subscribe({
    next: (data) => {
      this.applications = data;
      this.jobApplications = data.filter(app => !!app.job);
      this.internshipApplications = data.filter(app => !!app.internship);
      this.setDefaultStatuses();
      this.groupApplicationsByJobId();
      this.groupInternshipApplicationsByInternshipId();
      this.getApplicationCounts();
    },
    error: (err) => {
      console.error('Failed to load applications', err);
    }
  });
}

loadUpcomingEvents(): void {
    this.employerService.getUpcomingEvents().subscribe(
      (events) => {
        this.upcomingEvents = events;
        this.loadEvents();
      },
      (error) => console.error('Failed to load upcoming events', error)
    );
    
  }

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
      this.selectedStatus = app.status ? app.status as ApplicationStage : ApplicationStage.APPLICATIONS_RECEIVED;
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
      this.selectedStatuses[app.id] = app.status ? app.status as ApplicationStage : ApplicationStage.APPLICATIONS_RECEIVED; // Initialize status
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
      this.selectedStatuses[app.id] = app.status ? app.status as ApplicationStage : ApplicationStage.APPLICATIONS_RECEIVED;
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
    
        return sortedApplications.slice(0, 5);
  }



// Method to shortlist an application
shortlistApplication(id: number): void {
  this.selectedStatuses[id] = ApplicationStage.SHORTLISTED;
  this.updateStatus(id);
}


rejectApplication(id: number): void {
  this.selectedStatuses[id] = ApplicationStage.REJECTED;
  this.updateStatus(id);
}

getApplicationCountByStage(stage: ApplicationStage): void {
    this.employerService.countApplicationsByStage(stage).subscribe(count => {
      console.log(`Count of applications in stage ${stage}:`, count);
      // You can store this count in a variable if needed for UI display
    });
  }

  getApplicationCounts(): void {
    const stages = Object.values(ApplicationStage);
    this.totalApplicationsCount = this.applications.length;
    stages.forEach(stage => {
      this.employerService.countApplicationsByStage(stage).subscribe(count => {
        this.counts[stage] = count;
        this.totalApplicationsCount += count;
      });
    });
  }

 getStagePercentage(stage: ApplicationStage): number {
  const count = this.counts[stage] || 0;
  const percentage = this.totalApplicationsCount > 0
    ? (count / this.totalApplicationsCount) * 100
    : 0;
  return Math.round(percentage * 100) / 100; // rounds to 2 decimal places
}



  // Get applications filtered by stage
  getApplicationsByStage(stage: ApplicationStage): void {
    this.employerService.getApplicationsByStage(stage).subscribe(apps => {
      this.applications = apps;
      this.jobApplications = apps.filter(app => !!app.job);
      this.internshipApplications = apps.filter(app => !!app.internship);
      this.setDefaultStatuses();
      this.groupApplicationsByJobId();
      this.groupInternshipApplicationsByInternshipId();
    });
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

  isPast(dateStr: string, endTimeStr: string): boolean {
  if (!dateStr || !endTimeStr) return false;

  const [hours, minutes] = endTimeStr.split(':').map(Number);
  const endDateTime = new Date(dateStr);
  endDateTime.setHours(hours, minutes, 0, 0);

  const now = new Date();
  return endDateTime < now;
}



  generateCalendar(date: Date) {
    this.weeks = [];
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    let day = start;
    let week: (Date | null)[] = [];

    for (let i = 0; i < day.getDay(); i++) {
      week.push(null);
    }

    while (day <= end) {
      week.push(new Date(day));
      if (week.length === 7) {
        this.weeks.push(week);
        week = [];
      }
      day = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
    }

    while (week.length < 7) {
      week.push(null);
    }
    this.weeks.push(week);
  }

  loadEvents() {
    this.employerService.getEvents().subscribe(events => {
      this.events = events;
      this.startReminderCheck();
    });
  }

  getEventsForDate(date: Date | null): CalendarEvent[] {
    if (!date) return [];
    return this.events.filter(ev => {
      const evDate = new Date(ev.dateTime);
      return evDate.getFullYear() === date.getFullYear() &&
        evDate.getMonth() === date.getMonth() &&
        evDate.getDate() === date.getDate();
    });
  }

  onDateClick(date: Date) {
    if (!date) return;
    this.selectedDate = date;
    this.selectedDateEvents = this.getEventsForDate(date);
    this.showEventModal = true;
    this.editingEvent = null;
    this.eventForm.reset({
      dateTime: date.toISOString().substring(0, 16)
    });
  }

  onEditEvent(event: CalendarEvent) {
    this.editingEvent = event;
    this.eventForm.setValue({
      title: event.title,
      description: event.description,
      dateTime: event.dateTime.substring(0, 16)
    });
  }

  onDeleteEvent(event: CalendarEvent) {
    if (!confirm('Are you sure you want to delete this event?')) return;

    this.employerService.deleteEvent(event.id!).subscribe({
      next: () => {
        this.snackBar.open('Event deleted successfully!', 'Close', {
          duration: 3000,
           horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['snack-success'],
        });

        this.events = this.events.filter(e => e.id !== event.id);
        this.selectedDateEvents = this.getEventsForDate(this.selectedDate);
      },
      error: () => {
        this.snackBar.open('Failed to delete event.', 'Close', {
          duration: 3000,
           horizontalPosition: 'right',
            verticalPosition: 'top',
          panelClass: ['snack-error'],
        });
      }
    });
  }

  onSaveEvent() {
    const formValue = this.eventForm.value;
    const formDateTime: string = formValue.dateTime;
    const dateTimeWithSeconds = formDateTime.length === 16 ? formDateTime + ":00" : formDateTime;

    const newEvent: CalendarEvent = {
      title: formValue.title,
      description: formValue.description,
      dateTime: dateTimeWithSeconds
    };

    if (this.editingEvent) {
      this.employerService.updateEvent(this.editingEvent.id!, newEvent).subscribe({
        next: () => {
          this.snackBar.open('Event updated successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',panelClass: ['snack-success'],

          });

          this.loadEvents();
          this.selectedDateEvents = this.getEventsForDate(this.selectedDate);
          this.editingEvent = null;
          this.eventForm.reset();
        },
        error: () => {
          this.snackBar.open('Failed to update event.', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['snack-error'],
          });
        }
      });
    } else {
      this.employerService.createEvent(newEvent).subscribe({
        next: () => {
          this.snackBar.open('Event created successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['snack-success'],
          });

          this.loadEvents();
          this.selectedDateEvents = this.getEventsForDate(this.selectedDate);
          this.eventForm.reset();
        },
        error: () => {
          this.snackBar.open('Failed to create event.', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['snack-error'],
          });
        }
      });
    }
  }

  closeModal() {
    this.showEventModal = false;
    this.selectedDate = null;
    this.selectedDateEvents = [];
    this.editingEvent = null;
    this.eventForm.reset();
  }

  prevMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.generateCalendar(this.currentMonth);
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.generateCalendar(this.currentMonth);
  }

  isToday(date: Date | null): boolean {
  if (!date) return false;
  const today = new Date();
  return date.getFullYear() === today.getFullYear() &&
         date.getMonth() === today.getMonth() &&
         date.getDate() === today.getDate();
}
  startReminderCheck() {
  this.reminderCheckInterval = setInterval(() => {
    if (!this.remindersEnabled) return;

    const now = new Date();
    const nowRounded = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      0, 0
    );

    this.events.forEach(event => {
      if (!event.dateTime || !event.id) return;
        const eventId = event.id; 
      const isoDateTime = event.dateTime.replace(' ', 'T');
      const eventDate = new Date(isoDateTime);
      if (isNaN(eventDate.getTime())) return;

      const eventRounded = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate(),
        eventDate.getHours(),
        eventDate.getMinutes(),
        0, 0
      );

     

      if (nowRounded.getTime() === eventRounded.getTime() && !this.remindedEventIds.has(eventId)) {
        this.showReminder(event);
        this.remindedEventIds.add(eventId);
      }
    });
  }, 1000);
}


 showReminder(event: CalendarEvent) {
  const formattedTime = new Date(event.dateTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  this.snackBar.openFromComponent(RemainderSnackbarComponent, {
    data: {
      title: event.title,
      time: formattedTime,
      description: event.description
    },
    duration: 60000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: ['snack-success'],
  });
}



  toggleReminders() {
    this.remindersEnabled = !this.remindersEnabled;
    const message = this.remindersEnabled ? 'Reminders Enabled' : 'Reminders Disabled';
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [this.remindersEnabled ? 'snack-success' : 'snack-error'],
    });
  }
}


