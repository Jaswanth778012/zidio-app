import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobModerationComponent } from './job-moderation.component';

describe('JobModerationComponent', () => {
  let component: JobModerationComponent;
  let fixture: ComponentFixture<JobModerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobModerationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobModerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
