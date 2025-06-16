import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentmessageComponent } from './studentmessage.component';

describe('StudentmessageComponent', () => {
  let component: StudentmessageComponent;
  let fixture: ComponentFixture<StudentmessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentmessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentmessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
