import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RqModalComponent } from './rq-modal.component';

describe('RqModalComponent', () => {
  let component: RqModalComponent;
  let fixture: ComponentFixture<RqModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RqModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RqModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
