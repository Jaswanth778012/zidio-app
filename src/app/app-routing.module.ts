import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { EmployerComponent } from './employer/employer.component';
import { LoginComponent } from './login/login.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { AuthGuard } from './_auth/auth.guard';
import { RegisterComponent } from './register/register.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { EmployerManagementComponent } from './admin/employer-management/employer-management.component';
import { CourseManagementComponent } from './admin/course-management/course-management.component';
import { InternshipModerationComponent } from './admin/internship-moderation/internship-moderation.component';
import { JobModerationComponent } from './admin/job-moderation/job-moderation.component';
import { AnalyticsDashboardComponent } from './admin/analytics-dashboard/analytics-dashboard.component';
import { StudentManagementComponent } from './admin/student-management/student-management.component';
import { ReportsComponent } from './admin/reports/reports.component';
import { SubmitReportComponent } from './admin/submit-report/submit-report.component';
import { NotificationsComponent } from './admin/notifications/notifications.component';
import { AdminProfileComponent } from './admin/admin-profile/admin-profile.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'student',
    component: UserComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Student'] }
  },

  {
    path: 'employer',
    component: EmployerComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Employer'] }
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'updatepassword',
    component: UpdatePasswordComponent
  },
  {
    path: 'admin/users', 
    component: UserManagementComponent
  },
  {
    path: 'admin/employers',
    component: EmployerManagementComponent
  },
  {
    path: 'admin/students',
    component: StudentManagementComponent
  },
  {
     path: 'admin/courses', 
    component: CourseManagementComponent
     
  },
  {
    path: 'admin/internships',
  component: InternshipModerationComponent
  },
  {
  path: 'admin/jobs',
  component: JobModerationComponent
},
{
  path:'admin/analytics',
  component: AnalyticsDashboardComponent
},
{ path: 'admin/reports', 
  component: ReportsComponent
},
{
  path: 'admin/admin-profile',
  component: AdminProfileComponent
},
{
  path: 'submit-report',
  component: SubmitReportComponent
},
{ path: 'admin/notifications', 
  component: NotificationsComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }