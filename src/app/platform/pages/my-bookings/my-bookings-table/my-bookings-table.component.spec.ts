import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBookingsTableComponent } from './my-bookings-table.component';

describe('MyBookingsTableComponent', () => {
  let component: MyBookingsTableComponent;
  let fixture: ComponentFixture<MyBookingsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyBookingsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyBookingsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
