import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseBookingsComponent } from './close-bookings.component';

describe('CloseBookingsComponent', () => {
  let component: CloseBookingsComponent;
  let fixture: ComponentFixture<CloseBookingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseBookingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
