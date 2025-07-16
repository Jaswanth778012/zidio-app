import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { EmployerComponent } from './employer/employer.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './_auth/auth.guard';
import { AuthInterceptor } from './_auth/auth.interceptor';
import { UserService } from './_services/user.service';
import { RegisterComponent } from './register/register.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { MatSelectModule } from '@angular/material/select';
import { EmployerManagementComponent } from './admin/employer-management/employer-management.component';
import { CourseManagementComponent } from './admin/course-management/course-management.component';
import { InternshipModerationComponent } from './admin/internship-moderation/internship-moderation.component';
import { JobModerationComponent } from './admin/job-moderation/job-moderation.component';
import { AnalyticsDashboardComponent } from './admin/analytics-dashboard/analytics-dashboard.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { StudentManagementComponent } from './admin/student-management/student-management.component';
import { ReportsComponent } from './admin/reports/reports.component';
import { SubmitReportComponent } from './admin/submit-report/submit-report.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationsComponent } from './admin/notifications/notifications.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AdminProfileComponent } from './admin/admin-profile/admin-profile.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { MatSidenav,MatSidenavModule } from '@angular/material/sidenav';
import { JobManagementComponent } from './employer/job-management/job-management.component';
import { InternshipManagementComponent } from './employer/internship-management/internship-management.component';
import { MessageDashComponent } from './employer/message-dash/message-dash.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ComposeComponent } from './employer/compose/compose.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { SentComponent } from './employer/sent/sent.component';
import { AdmincomposeComponent } from './admin/admincompose/admincompose.component';
import { AdminsentComponent } from './admin/adminsent/adminsent.component';
import { AdminmessageDashComponent } from './admin/adminmessage-dash/adminmessage-dash.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StudentProfileComponent } from './user/student-profile/student-profile.component';
import { EmployerProfileComponent } from './employer/employer-profile/employer-profile.component';
import { StudentcomposeComponent } from './user/studentcompose/studentcompose.component';
import { StudentsentComponent } from './user/studentsent/studentsent.component';
import { StudentmessageComponent } from './user/studentmessage/studentmessage.component';
import { InterviewComponent } from './employer/interview/interview.component';
import { InterviewUpdateComponent } from './employer/interview-update/interview-update.component';
import { ApplicationsComponent } from './employer/applications/applications.component';
import { InterviewsComponent } from './employer/interviews/interviews.component';
import { MatChipsModule } from '@angular/material/chips';
import { FooterComponent } from './footer/footer.component';
import { InternshipsComponent } from './internships/internships.component';
import { JobsComponent } from './jobs/jobs.component';
import { CourseEnrollmentManagementComponent } from './admin/course-enrollment-management/course-enrollment-management.component';
import { RemainderSnackbarComponent } from './remainder-snackbar/remainder-snackbar.component';
import { CoursesComponent } from './courses/courses.component';
import { StudentreviewComponent } from './user/studentreview/studentreview.component';
import { CourseDetailsComponent } from './course-details/course-details.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AdminComponent,
    UserComponent,
    EmployerComponent,
    ForbiddenComponent,
    HeaderComponent,
    RegisterComponent,
    UpdatePasswordComponent,
    UserManagementComponent,
    EmployerManagementComponent,
    CourseManagementComponent,
    InternshipModerationComponent,
    JobModerationComponent,
    AnalyticsDashboardComponent,
    StudentManagementComponent,
    ReportsComponent,
    SubmitReportComponent,
    NotificationsComponent,
    AdminProfileComponent,
    AboutComponent,
    ContactComponent,
    JobManagementComponent,
    InternshipManagementComponent,
    MessageDashComponent,
    ComposeComponent,
    MessageDialogComponent,
    SentComponent,
    AdmincomposeComponent,
    AdminsentComponent,
    AdminmessageDashComponent,
    StudentProfileComponent,
    EmployerProfileComponent,
    StudentcomposeComponent,
    StudentsentComponent,
    StudentmessageComponent,
    InterviewComponent,
    InterviewUpdateComponent,
    ApplicationsComponent,
    InterviewsComponent,
    FooterComponent,
    InternshipsComponent,
    JobsComponent,
    CourseEnrollmentManagementComponent,
    RemainderSnackbarComponent,
    CoursesComponent,
    StudentreviewComponent,
    CourseDetailsComponent,
   



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule, // Ensure RouterModule is configured properly
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatButtonToggleModule,
    MatListModule,
    MatBadgeModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSidenav,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatMenuModule,
    MatTooltipModule,
    MatChipsModule
  ],
  providers: [
    // authGuard is removed as it should be used in route configuration, not as a provider
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    UserService,
    provideAnimationsAsync(),
    
   
    provideAnimations()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


