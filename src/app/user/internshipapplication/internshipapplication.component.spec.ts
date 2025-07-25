import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipapplicationComponent } from './internshipapplication.component';

describe('InternshipapplicationComponent', () => {
  let component: InternshipapplicationComponent;
  let fixture: ComponentFixture<InternshipapplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InternshipapplicationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InternshipapplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
