import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemainderSnackbarComponent } from './remainder-snackbar.component';

describe('RemainderSnackbarComponent', () => {
  let component: RemainderSnackbarComponent;
  let fixture: ComponentFixture<RemainderSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemainderSnackbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RemainderSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
