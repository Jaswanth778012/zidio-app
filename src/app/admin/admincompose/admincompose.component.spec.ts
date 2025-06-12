import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmincomposeComponent } from './admincompose.component';

describe('AdmincomposeComponent', () => {
  let component: AdmincomposeComponent;
  let fixture: ComponentFixture<AdmincomposeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdmincomposeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdmincomposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
