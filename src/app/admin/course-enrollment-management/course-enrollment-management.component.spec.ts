import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseEnrollmentManagementComponent } from './course-enrollment-management.component';

describe('CourseEnrollmentManagementComponent', () => {
  let component: CourseEnrollmentManagementComponent;
  let fixture: ComponentFixture<CourseEnrollmentManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CourseEnrollmentManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CourseEnrollmentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
