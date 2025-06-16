import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentcomposeComponent } from './studentcompose.component';

describe('StudentcomposeComponent', () => {
  let component: StudentcomposeComponent;
  let fixture: ComponentFixture<StudentcomposeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentcomposeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentcomposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
