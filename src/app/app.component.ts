import { Component, OnInit } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'b2b-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  /**
   * Subscribe to router state and detect when the navigation is starting
   * to remove all active modals
   * @param router Router
   * @param activeModal NgbActiveModal
   */
  constructor(private router: Router, private activeModal: NgbActiveModal) {}

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.removeModals();
      }
    });
  }

  /**
   * Remove active modal
   */
  removeModals() {
    this.activeModal.close();
  }
}
