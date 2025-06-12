import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminsentComponent } from './adminsent.component';

describe('AdminsentComponent', () => {
  let component: AdminsentComponent;
  let fixture: ComponentFixture<AdminsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminsentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
