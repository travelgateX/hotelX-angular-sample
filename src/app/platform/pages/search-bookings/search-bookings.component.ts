import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { SearchService } from 'app/core/services/search.service';
import { AuthService } from 'app/core/services/auth.service';
import { WebConfigService } from 'app/core/services/web-config.service';

@Component({
  selector: 'b2b-search-bookings',
  templateUrl: './search-bookings.component.html',
  styleUrls: ['./search-bookings.component.css']
})
export class SearchBookingsComponent implements OnInit {
  constructor(
    private router: Router,
    public authService: AuthService,
    private searchService: SearchService,
    private route: ActivatedRoute,
    private webConfigService: WebConfigService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['access']) {
        this.webConfigService.setAccess({
          code: params['access'],
          name: 'UrlAccess'
        });
      }
    });
  }

  /**
   * Search a new criteria
   * @param event Event
   */
  onSearch(event) {
    if (event.criteria) {
      this.searchService.setCriteria(event.criteria);
    }
    this.router.navigate(['/platform/results-bookings']);
  }
}
