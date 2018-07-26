import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'b2b-edit-criteria-modal',
  templateUrl: './edit-criteria-modal.component.html',
  styleUrls: ['./edit-criteria-modal.component.css']
})
export class EditCriteriaModalComponent {
  @Input() isEdit = false;
  constructor(public activeModal: NgbActiveModal) {}

  /**
   * Closes edit criteria modal each time a user makes a search
   * @param event event from the search component
   */
  onSearch(event) {
    this.activeModal.close(event);
  }
}
