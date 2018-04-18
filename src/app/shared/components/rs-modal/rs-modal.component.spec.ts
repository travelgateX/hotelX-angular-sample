import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RsModalComponent } from './rs-modal.component';

describe('RsModalComponent', () => {
  let component: RsModalComponent;
  let fixture: ComponentFixture<RsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
