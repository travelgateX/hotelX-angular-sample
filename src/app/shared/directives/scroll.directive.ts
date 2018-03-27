import { Directive, HostListener, Input } from '@angular/core';

/**
 * Allows the user to go to an anchor with a smooth scroll effect
 */
@Directive({
  selector: '[appScroll]',
})
export class ScrollDirective {
  @Input() height = 0;

  constructor() {}

  /**
   * Adds an event listener (on click) to the element and when the user clicks on it,
   * the user is redirected to the href element with an scroll effect
   * @param $event the element
   */
  @HostListener('click', ['$event'])
  onClick(event) {
    const self = this;
    $('html, body')
      .stop()
      .animate(
        {
          scrollTop:
            $(event.target.getAttribute('href')).offset().top - self.height,
        },
        1500
      );
    event.preventDefault();
  }
}
