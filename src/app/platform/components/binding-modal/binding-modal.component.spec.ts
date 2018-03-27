import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BindingModalComponent } from './binding-modal.component';

describe('BindingModalComponent', () => {
  let component: BindingModalComponent;
  let fixture: ComponentFixture<BindingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BindingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BindingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
