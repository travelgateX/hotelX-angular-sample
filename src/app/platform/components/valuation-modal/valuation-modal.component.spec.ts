import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuationModalComponent } from './valuation-modal.component';

describe('ValuationModalComponent', () => {
  let component: ValuationModalComponent;
  let fixture: ComponentFixture<ValuationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValuationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
