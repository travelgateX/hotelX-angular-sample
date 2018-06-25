import { Injectable } from '@angular/core';
import { CoreAdminService } from '../../../../core/services/core-admin.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Client } from '../../../../core/interfaces/client';
import { Subject } from 'rxjs/Subject';

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
      })
      this.organizations$.next(organizations)
    });
  }
}
