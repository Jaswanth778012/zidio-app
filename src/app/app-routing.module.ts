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
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { MessageDashComponent } from './employer/message-dash/message-dash.component';
import { ComposeComponent } from './employer/compose/compose.component';
import { SentComponent } from './employer/sent/sent.component';
import { AdmincomposeComponent } from './admin/admincompose/admincompose.component';
import { AdminmessageDashComponent } from './admin/adminmessage-dash/adminmessage-dash.component';
import { AdminsentComponent } from './admin/adminsent/adminsent.component';
import { EmployerProfileComponent } from './employer/employer-profile/employer-profile.component';
import { StudentProfileComponent } from './user/student-profile/student-profile.component';
import { StudentcomposeComponent } from './user/studentcompose/studentcompose.component';
import { StudentmessageComponent } from './user/studentmessage/studentmessage.component';
import { StudentsentComponent } from './user/studentsent/studentsent.component';
import { JobManagementComponent } from './employer/job-management/job-management.component';
import { InternshipManagementComponent } from './employer/internship-management/internship-management.component';
import { InterviewComponent } from './employer/interview/interview.component';
import { InterviewUpdateComponent } from './employer/interview-update/interview-update.component';
import { ApplicationsComponent } from './employer/applications/applications.component';
import { InterviewsComponent } from './employer/interviews/interviews.component';


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
  path: 'admin/compose',
  component: AdmincomposeComponent
},
{
  path: 'admin/inbox',
  component: AdminmessageDashComponent
},
{
  path: 'admin/sent',
  component: AdminsentComponent
},

{
  path: 'submit-report',
  component: SubmitReportComponent
},
{ path: 'admin/notifications', 
  component: NotificationsComponent
},
{
  path: 'about',
  component: AboutComponent
},
{
  path: 'contact',
  component: ContactComponent
},
{
  path: 'employer/jobs',
  component: JobManagementComponent
},
{
  path: 'employer/internships',
  component: InternshipManagementComponent
},
{
  path: 'employer/messages',
  component: MessageDashComponent

},
{
  path: 'employer/compose',
  component: ComposeComponent
},
{
  path: 'employer/sent',
  component: SentComponent
},
{
  path: 'employer/employer-profile',
  component: EmployerProfileComponent
},
{
  path: 'employer/interview',
  component: InterviewComponent
},
{
  path: 'employer/interview-update/:id',
  component: InterviewUpdateComponent
},
{
  path: 'employer/applications',
  component: ApplicationsComponent
},
{
  path: 'employer/interviews',
  component: InterviewsComponent
},
{
  path: 'student/student-profile',
  component: StudentProfileComponent
},
{
  path: 'student/student-compose',
  component: StudentcomposeComponent
},
{
  path: 'student/inbox',
  component: StudentmessageComponent
},
{
  path: 'student/sent',
  component: StudentsentComponent
}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }