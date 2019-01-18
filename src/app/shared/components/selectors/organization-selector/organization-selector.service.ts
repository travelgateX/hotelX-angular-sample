import { Injectable } from '@angular/core';
import { CoreAdminService } from '../../../../core/services/core-admin.service';
import { Subject } from 'rxjs';

@Injectable()
export class OrganizationSelectorService {
  constructor(private coreAdminService: CoreAdminService) {}

  organizationSelected$ = new Subject<any>();
  organizations$ = new Subject<any>();

  getOrganizations() {
    const organizations = [];
    this.coreAdminService.getOrganizations().valueChanges.subscribe(res => {
      res.data.admin.organizations.edges.map(element => {
        if (((element.node || {}).organizationData || {}).code){
          organizations.push(element.node.organizationData.code)
        }
      });
      organizations.sort(function(a, b){
        if(a < b) { return -1; }
        if(a > b) { return 1; }
        return 0;
      });
      this.organizations$.next(organizations);
    });
  }
}