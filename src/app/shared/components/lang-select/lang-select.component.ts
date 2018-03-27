import { environment } from './../../../../environments/environment';
import { Component, OnInit, Input } from '@angular/core';

/**
 * Displays a select for allowed languages
 */
@Component({
  selector: 'b2b-lang-select',
  templateUrl: './lang-select.component.html',
  styleUrls: ['./lang-select.component.css'],
})
export class LangSelectComponent implements OnInit {
  @Input() hasClass: boolean;
  languages: string[];

  constructor() {}

  /**
   * Get allowed languages
   */
  ngOnInit() {
    this.languages = environment.languages;
  }
}
