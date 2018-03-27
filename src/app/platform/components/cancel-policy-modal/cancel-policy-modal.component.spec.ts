import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelPolicyModalComponent } from './cancel-policy-modal.component';

describe('CancelPolicyModalComponent', () => {
  let component: CancelPolicyModalComponent;
  let fixture: ComponentFixture<CancelPolicyModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelPolicyModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelPolicyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
