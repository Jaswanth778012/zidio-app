import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from '../_model/CalendarEvent.model';
import { EmployerService } from '../_services/employer.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
interface CalendarDay {
  date: Date;
  day: number;
  currentMonth: boolean;
  events: CalendarEvent[];
}
@Component({
  selector: 'app-internships',
  templateUrl: './internships.component.html',
  styleUrl: './internships.component.css'
})
export class InternshipsComponent implements OnInit{
currentMonth: Date = new Date();
  weeks: (Date | null)[][] = [];
  events: CalendarEvent[] = [];

  selectedDateEvents: CalendarEvent[] = [];
  selectedDate: Date | null = null;

  showEventModal = false;
  eventForm: FormGroup;
  editingEvent: CalendarEvent | null = null;

  constructor(
    private employerService: EmployerService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.eventForm = this.fb.group({
      title: [''],
      description: [''],
      dateTime: ['']
    });
  }

  ngOnInit() {
    this.generateCalendar(this.currentMonth);
    this.loadEvents();
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

  isToday(date: Date | null): boolean {
  if (!date) return false;
  const today = new Date();
  return date.getFullYear() === today.getFullYear() &&
         date.getMonth() === today.getMonth() &&
         date.getDate() === today.getDate();
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
}
