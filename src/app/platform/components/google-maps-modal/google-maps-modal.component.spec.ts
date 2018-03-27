import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleMapsModalComponent } from './google-maps-modal.component';

describe('GoogleMapsModalComponent', () => {
  let component: GoogleMapsModalComponent;
  let fixture: ComponentFixture<GoogleMapsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleMapsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleMapsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
