import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { CoreAdminService } from '../../../core/services/core-admin.service';
import { WebConfigService } from '../../../core/services/web-config.service';

@Injectable()
export class SupplierAccessesService {
  suppliersAccesses$ = new Subject<any>();
  supplierSpinner = new Subject<number>();

  constructor(private coreAdminService: CoreAdminService, private webConfigService: WebConfigService) {}

  getSuppliersAccesses(organization) {
    const suppliers = [];
    this.coreAdminService.getSuppliersAccesses(organization).valueChanges.subscribe(res => {
      if (res) {
        res.data.admin.suppliers.edges.map(element => {
          if (
            element.node &&
            element.node.supplierData &&
            element.node.supplierData.accesses
          ) {
            suppliers.push(element.node.supplierData);
          }
        });
        this.suppliersAccesses$.next(suppliers);
        this.supplierSpinner.next(suppliers.length);
      }
    });
  }
}
