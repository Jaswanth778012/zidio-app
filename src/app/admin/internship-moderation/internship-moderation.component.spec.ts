import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipModerationComponent } from './internship-moderation.component';

describe('InternshipModerationComponent', () => {
  let component: InternshipModerationComponent;
  let fixture: ComponentFixture<InternshipModerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InternshipModerationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InternshipModerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
