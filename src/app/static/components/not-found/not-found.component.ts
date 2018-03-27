import { Component, OnInit } from '@angular/core';

/**
 * 404 page
 */
@Component({
  selector: 'b2b-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
})
export class NotFoundComponent implements OnInit {
  constructor() {}

  /**
   * Removes parallax
   */
  ngOnInit() {
    $('.parallax-mirror').remove();
  }
}
