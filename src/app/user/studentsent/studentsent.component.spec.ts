import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsentComponent } from './studentsent.component';

describe('StudentsentComponent', () => {
  let component: StudentsentComponent;
  let fixture: ComponentFixture<StudentsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentsentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
