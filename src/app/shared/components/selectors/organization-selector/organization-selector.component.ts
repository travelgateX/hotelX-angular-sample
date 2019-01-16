import { Component, OnInit, Input } from '@angular/core';
import { OrganizationSelectorService } from './organization-selector.service';
import { WebConfigService } from '../../../../core/services/web-config.service';

/**
 * Displays a select for allowed organizations
 */
@Component({
  selector: 'b2b-organization-selector',
  templateUrl: './organization-selector.component.html',
  styleUrls: ['./organization-selector.component.css']
})
export class OrganizationSelectorComponent implements OnInit {
  @Input() hasClass: boolean;
  organizations: string[];
  organizationsAux: string[];
  selectedOrganization: string;
  filter: string;

  constructor(
    private organizationSelectorService: OrganizationSelectorService,
    private webConfigService: WebConfigService
  ) {}

  /**
   * Get allowed languages
   */
  ngOnInit() {
    this.organizations = [];
    this.organizationsAux = [];
    this.organizationSelectorService.getOrganizations();
    this.organizationSelectorService.organizations$.subscribe(res => {
      this.organizations = res;
      this.organizationsAux = res;
      let defaultOrg = this.webConfigService.getOrganization();

      this.selectedOrganization =
        defaultOrg && this.organizations.includes(defaultOrg)
          ? defaultOrg
          : res[0];
      this.organizationSelectorService.organizationSelected$.next(
        this.selectedOrganization
      );
    });
  }

  setOrganization(event) {
    this.webConfigService.setOrganization(event.target.outerText);
    this.selectedOrganization = event.target.outerText;
    this.organizationSelectorService.organizationSelected$.next(
      event.target.outerText
    );
  }

  filterOptions() {
    this.organizations = this.organizationsAux.filter(res =>
      res.toLowerCase().includes(this.filter.toLowerCase())
    );
  }

  resetInput() {
    this.filter = '';
    this.organizations = this.organizationsAux;
  }
}