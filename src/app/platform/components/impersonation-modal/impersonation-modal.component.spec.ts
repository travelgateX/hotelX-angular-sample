import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpersonationModalComponent } from './impersonation-modal.component';

describe('ImpersonationModalComponent', () => {
  let component: ImpersonationModalComponent;
  let fixture: ComponentFixture<ImpersonationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpersonationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpersonationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
