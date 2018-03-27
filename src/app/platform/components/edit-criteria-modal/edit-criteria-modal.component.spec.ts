import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCriteriaModalComponent } from './edit-criteria-modal.component';

describe('EditCriteriaModalComponent', () => {
  let component: EditCriteriaModalComponent;
  let fixture: ComponentFixture<EditCriteriaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCriteriaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCriteriaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
