import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllapplicationsComponent } from './allapplications.component';

describe('AllapplicationsComponent', () => {
  let component: AllapplicationsComponent;
  let fixture: ComponentFixture<AllapplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllapplicationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllapplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
