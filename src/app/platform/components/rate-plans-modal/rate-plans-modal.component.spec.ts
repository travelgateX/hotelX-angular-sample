import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatePlansModalComponent } from './rate-plans-modal.component';

describe('RatePlansModalComponent', () => {
  let component: RatePlansModalComponent;
  let fixture: ComponentFixture<RatePlansModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatePlansModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatePlansModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
