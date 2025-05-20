import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { ScaleType } from '@swimlane/ngx-charts';

interface Color {
  name: string;
  selectable: boolean;
  group: ScaleType;
  domain: string[];
}
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
  studentsandemployersChart: any[] = [];
  courseStatusChart: any[] = [];

  userStatusColors: Color = {
    name: 'UserStatusScheme',
    selectable: true,
    group: ScaleType.Ordinal, 
    domain: ['#5ef201', '#ffc107', '#f44336']
  };

  jobInternshipColors: Color = {
    name: 'JobInternshipScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#3f51b5', '#00bcd4', '#8bc34a']
  };

  statusColors: Color = {
    name: 'StatusScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#3f51b5', '#00bcd4', '#8bc34a']
  };

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
        { name: 'Jobs', value: data.jobsCount },
        { name: 'Internships', value: data.internshipsCount },
        { name: 'Courses', value: data.coursesCount },
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

      this.studentsandemployersChart = [
        { name: 'Students', value: data.studentsCount },
        { name: 'Employers', value: data.employersCount },
        { name: 'Admins', value: data.adminsCount }
      ];

      this.courseStatusChart = [
        {name: 'Approved', value: data.approvedCourses },
        {name: 'Rejected', value: data.rejectedCourses }
      ]
    });
  }
}