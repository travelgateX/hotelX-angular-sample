import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelOptionComponent } from './hotel-option.component';

describe('HotelOptionComponent', () => {
  let component: HotelOptionComponent;
  let fixture: ComponentFixture<HotelOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
