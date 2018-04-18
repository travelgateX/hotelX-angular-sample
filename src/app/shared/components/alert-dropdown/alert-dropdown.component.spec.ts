import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertDropdownComponent } from './alert-dropdown.component';

describe('AlertDropdownComponent', () => {
  let component: AlertDropdownComponent;
  let fixture: ComponentFixture<AlertDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
