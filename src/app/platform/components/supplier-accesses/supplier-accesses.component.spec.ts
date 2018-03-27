import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierAccessesComponent } from './supplier-accesses.component';

describe('SupplierAccesesComponent', () => {
  let component: SupplierAccessesComponent;
  let fixture: ComponentFixture<SupplierAccessesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierAccessesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierAccessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
