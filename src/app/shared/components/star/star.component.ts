import { Component, OnInit, Input } from '@angular/core';
import { getArrayUses } from 'app/shared/utilities/functions';

/**
 * Displays a start icon
 */
@Component({
  selector: 'b2b-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.css'],
  host: { class: 'hotel-star' },
})
export class StarComponent implements OnInit {
  @Input() max: number;
  @Input() filled: any;
  stars: number;
  numbers: number[];

  constructor() {}

  /**
   * Init the valuesF
   */
  ngOnInit() {
    this.stars = this.filled ? this.filled.length : null;
    this.numbers = getArrayUses(this.max, true);
  }
}
