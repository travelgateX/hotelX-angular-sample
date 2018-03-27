import { Router } from "@angular/router";
import { Component } from "@angular/core";

import { SearchService } from "app/core/services/search.service";
import { AuthService } from "app/core/services/auth.service";

@Component({
  selector: "b2b-search-bookings",
  templateUrl: "./search-bookings.component.html",
  styleUrls: ["./search-bookings.component.css"]
})
export class SearchBookingsComponent {
  constructor(
    private router: Router,
    public authService: AuthService,
    private searchService: SearchService
  ) {}

  /**
   * Search a new criteria
   * @param event Event
   */
  onSearch(event) {
    if (event.criteria) {
      this.searchService.setCriteria(event.criteria);
    }
    this.router.navigate(["/platform/results-bookings"]);
  }
}
