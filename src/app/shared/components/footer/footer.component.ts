import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
  selector: 'b2b-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  environment: any;
  constructor() {}

  /**
   * Remove parallax
   * It's done here because footer and header components are the uniques which are imported always
   */
  ngOnInit() {
    $('.parallax-mirror').remove();
    this.environment = environment;
  }
}
