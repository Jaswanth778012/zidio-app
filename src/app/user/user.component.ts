import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { UserAuthService } from '../_services/user-auth.service';
import { Router } from '@angular/router';
import { StudentService } from '../_services/student.service';
import { CalendarEvent } from '../_model/CalendarEvent.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RemainderSnackbarComponent } from '../remainder-snackbar/remainder-snackbar.component';
import { Application } from '../_model/Application.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  mycourses: any[] = [];
  appliedJob: any[] = [];
  myInternships: any[] = [];
  applications: Application[] = [];
  message: any;
  role: any;
  userName!: string | null;
  profilePictureUrl: string = 'assets/admin.png'; // Default image URL

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
      remindedEventIds = new Set<number>();
    remindersEnabled: boolean = true;


       appliedJobs = 0;
      appliedInternships = 0;
      paidCourses = 0;
      freeCourses = 0;
  constructor(private userService: UserService,private userAuthService: UserAuthService,private fb: FormBuilder, private router : Router,private studentService: StudentService,private snackBar: MatSnackBar) {this.eventForm = this.fb.group({
      title: [''],
      description: [''],
      dateTime: ['']
    }); }



  ngOnInit(): void {
    // Initialization logic can go here
    this.userName = this.userAuthService.getUsername();
    this.forUser();

    this.studentService.getProfile().subscribe(profile =>{
      if(profile.profilePictureUrl){
        this.profilePictureUrl = profile.profilePictureUrl;
      }
    })
    this.forcourses();
    this.forjobs();
    this.forinternships();
    this.generateCalendar(this.currentMonth);
    this.loadUpcomingEvents();
    this.loadEvents();
    this.loadDashboardCounts();

  }

  forcourses(): void{
    this.studentService.getMyCourses().subscribe(data => {
      this.mycourses = data;
      console.log('Courses fetched successfully', this.mycourses);
    }, error => {
      console.error('Failed to load courses', error);
    });
  }

  forjobs(){
    this.studentService.getAppliedJobs().subscribe(data => {
      this.appliedJob = data;
      console.log('Jobs fetched successfully', this.appliedJob);
    }, error => {
      console.error('Failed to load jobs', error);
    });
  }

  forinternships(){
    this.studentService.getAppliedInternships().subscribe(data => {
      this.myInternships = data;
      console.log('Internships fetched successfully', this.myInternships);
    }, error => {
      console.error('Failed to load internships', error);
    });
  }
  async ngAfterViewInit() {
    const Dropdown = (await import('bootstrap/js/dist/dropdown')).default;

    const dropdownToggle = document.getElementById('dropdownMenuButton');
    if (dropdownToggle) {
      new Dropdown(dropdownToggle);
    }
  }

  loadUpcomingEvents(): void {
    this.studentService.getUpcomingEvents().subscribe(
      (events) => {
        this.upcomingEvents = events;
      },
      (error) => console.error('Failed to load upcoming events', error)
    );
    
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
      this.studentService.getEvents().subscribe(events => {
        this.events = events;
        this.startReminderCheck(); 
        this.loadUpcomingEvents();
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
  
      this.studentService.deleteEvent(event.id!).subscribe({
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
        this.studentService.updateEvent(this.editingEvent.id!, newEvent).subscribe({
          next: () => {
            this.snackBar.open('Event updated successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',panelClass: ['snack-success'],
  
            });
  
            this.loadEvents();
            this.loadUpcomingEvents(); 
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
        this.studentService.createEvent(newEvent).subscribe({
          next: () => {
            this.snackBar.open('Event created successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['snack-success'],
            });
  
            this.loadEvents();
            this.loadUpcomingEvents(); 
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
  // Add any additional methods or properties needed for the UserComponent

  // Example method
  forUser(){
    this.userService.forStudent().subscribe(
      (response: any) => {
        console.log(response);
        this.message = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

   public logout()
  {
    this.userAuthService.clear();
    this.router.navigate(['/']);
  }

  getRecentApplications() {
  return this.applications
    ?.sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    .slice(0, 5);
}

formatStatus(status: string): string {
  return status?.toLowerCase()
    .split('_')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

getRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}
viewAllApplications() {
  // Example route navigation
  this.router.navigate(['/student/allapplications']);
}

loadDashboardCounts(): void {
    this.studentService.getDashboardCounts().subscribe(data => {
      this.appliedJobs = data.appliedJobs;
      this.appliedInternships = data.appliedInternships;
      this.paidCourses = data.paidCourses;
      this.freeCourses = data.freeCourses;
    });
  }
}
