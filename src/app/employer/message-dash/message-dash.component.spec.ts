import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageDashComponent } from './message-dash.component';

describe('MessageDashComponent', () => {
  let component: MessageDashComponent;
  let fixture: ComponentFixture<MessageDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageDashComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MessageDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
