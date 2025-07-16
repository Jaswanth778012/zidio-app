import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentreviewComponent } from './studentreview.component';

describe('StudentreviewComponent', () => {
  let component: StudentreviewComponent;
  let fixture: ComponentFixture<StudentreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentreviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
