import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerManagementComponent } from './employer-management.component';

describe('EmployerManagementComponent', () => {
  let component: EmployerManagementComponent;
  let fixture: ComponentFixture<EmployerManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployerManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
