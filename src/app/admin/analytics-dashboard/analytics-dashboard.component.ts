import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrl: './analytics-dashboard.component.css'
})
export class AnalyticsDashboardComponent implements OnInit {
  stats: any = {};
  userStatusChart: any[] = [];
  jobInternshipChart: any[] = [];
  jobStatusChart: any[] = [];
  internshipStatusChart: any[] = [];

  view: [number, number] = [500, 300];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getAnalyticsDashboard().subscribe(data => {
      this.stats = data;

      this.userStatusChart = [
        { name: 'Approved', value: data.approvedUsers  },
        { name: 'Pending', value: data.pendingUsers },
        { name: 'Blocked', value: data.blockedUsers },
      ];

      this.jobInternshipChart = [
        { name: 'Jobs', value: data.jobCount },
        { name: 'Internships', value: data.internshipCount },
        { name: 'Courses', value: data.courseCount },
      ];

      this.jobStatusChart = [
        { name: 'Approved', value: data.approvedJobs },
        { name: 'Pending', value: data.pendingJobs },
        { name: 'Flagged', value: data.flaggedJobs },
      ];

      this.internshipStatusChart = [
        { name: 'Approved', value: data.approvedInternships },
        { name: 'Pending', value: data.pendingInternships },
        { name: 'Flagged', value: data.flaggedInternships },
      ];
    });
  }
}