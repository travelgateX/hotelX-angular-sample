import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultBookingsComponent } from './result-bookings.component';

describe('ResultBookingsComponent', () => {
  let component: ResultBookingsComponent;
  let fixture: ComponentFixture<ResultBookingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultBookingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
