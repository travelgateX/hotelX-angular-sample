import { Injectable } from '@angular/core';
import { QueryRef, Apollo } from 'apollo-angular';
import { suppliersAccesses } from '../graphQL/shared/queries/suppliers-accesses';
import { clients } from '../graphQL/shared/queries/clients';
import { organizations } from '../graphQL/shared/queries/organizations';

@Injectable()
export class CoreAdminService {
  constructor(private apollo: Apollo) {}

  /**
   * Get the information of suppliers/accesses
   */
  getSuppliersAccesses(organization: string): QueryRef<any> {
    return this.apollo.watchQuery<any>({
      query: suppliersAccesses,
      variables: { groupID: [organization] },
    });
  }
  /**
   * Get the information of clients
   */
  getClients(organization: string): QueryRef<any> {
    return this.apollo.watchQuery<any>({
      query: clients,
      variables: { groupID: [organization] }
    });
  }

  /**
   * Get the information of organizations
   */
  getOrganizations(): QueryRef<any> {
    return this.apollo.watchQuery<any>({
      query: organizations
    });
  }
}