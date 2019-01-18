import { Injectable } from '@angular/core';
import { CoreAdminService } from '../../../core/services/core-admin.service';
import { WebConfigService } from '../../../core/services/web-config.service';
import { Subject } from 'rxjs';

@Injectable()
export class SupplierAccessesService {
  suppliersAccesses$ = new Subject<any>();
  supplierSpinner = new Subject<number>();

  constructor(private coreAdminService: CoreAdminService, private webConfigService: WebConfigService) {}

  getSuppliersAccesses(organization) {
    let suppliers = [];
    if(!organization){
      this.supplierSpinner.next(0);
      return;
    }
    this.coreAdminService.getSuppliersAccesses(organization).valueChanges.subscribe(res => {
      if (res) {
        res.data.admin.suppliers.edges.map(element => {
          if (element.node && element.node.supplierData) {
            suppliers.push(element.node.supplierData);
          }
        });
        suppliers = suppliers.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
        this.suppliersAccesses$.next(suppliers);
        this.supplierSpinner.next(suppliers.length);
      }else{
        this.supplierSpinner.next(0);
      }
    });
  }
}
