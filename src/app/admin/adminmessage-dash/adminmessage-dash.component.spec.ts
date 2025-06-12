import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminmessageDashComponent } from './adminmessage-dash.component';

describe('AdminmessageDashComponent', () => {
  let component: AdminmessageDashComponent;
  let fixture: ComponentFixture<AdminmessageDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminmessageDashComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminmessageDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
