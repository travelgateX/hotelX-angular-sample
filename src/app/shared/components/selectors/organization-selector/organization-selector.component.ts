import { Component, OnInit, Input } from '@angular/core';
import { OrganizationSelectorService } from './organization-selector.service';
import { WebConfigService } from '../../../../core/services/web-config.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NoOrganizationModalComponent } from 'app/platform/components/no-organization-modal/no-organization-modal.component';
import { AuthService } from '../../../../core/services/auth.service';

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
    private webConfigService: WebConfigService,
    private notificationService: NotificationService,
    private modalService: NgbModal,
    private authService: AuthService
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
      const defaultOrg = this.webConfigService.getOrganization();

      this.selectedOrganization = defaultOrg && this.organizations.includes(defaultOrg) ? defaultOrg : res[0];

      if (this.organizations.length === 0) {
        this.notificationService.toast('Organizations', 'No organizations available', 5);
        const modalRef = this.modalService.open(NoOrganizationModalComponent, {
          size: 'lg',
          keyboard: false,
          backdrop: 'static'
        });

        modalRef.result.then(_ => {
          this.authService.logout();
        });
      }
      this.organizationSelectorService.organizationSelected$.next(this.selectedOrganization);
    });
  }

  setOrganization(organization) {
    this.webConfigService.setOrganization(organization);
    this.selectedOrganization = organization;
    this.organizationSelectorService.organizationSelected$.next(organization);
  }

  filterOptions() {
    this.organizations = this.organizationsAux.filter(res => res.toLowerCase().includes(this.filter.toLowerCase()));
  }

  resetInput() {
    this.filter = '';
    this.organizations = this.organizationsAux;
  }
}
