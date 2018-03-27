import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Pagination component
 */
@Component({
  selector: 'b2b-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent {
  @Input('page') page;
  @Output() pageChanges: EventEmitter<number> = new EventEmitter();
  previousLabel = '<';
  nextLabel = '>';
  directionLinks = true;
  autoHide = false;

  constructor() {}

  /**
   * Emits the current page to the parent
   * @param event selected page
   */
  onPageChange(event) {
    this.pageChanges.emit(event);
  }
}
