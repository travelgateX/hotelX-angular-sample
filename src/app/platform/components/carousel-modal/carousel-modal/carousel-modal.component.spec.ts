import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselModalComponent } from './carousel-modal.component';

describe('CarouselModalComponent', () => {
  let component: CarouselModalComponent;
  let fixture: ComponentFixture<CarouselModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarouselModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
