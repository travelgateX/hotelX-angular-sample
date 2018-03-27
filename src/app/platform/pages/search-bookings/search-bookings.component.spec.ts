import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBookingsComponent } from './search-bookings.component';

describe('SearchBookingsComponent', () => {
  let component: SearchBookingsComponent;
  let fixture: ComponentFixture<SearchBookingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchBookingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
