import { Injectable } from '@angular/core';
import { HubService } from '../../../core/services/hub.service';
import { Subject } from 'rxjs';

@Injectable()
export class SupplierAccessesService {
  suppliersAccesses$ = new Subject<any>();
  supplierSpinner = new Subject<number>();

  constructor(private hubService: HubService) {}

  getSuppliersAccesses() {
    let suppliers = [];
    this.hubService.getSuppliersAccesses().valueChanges.subscribe(res => {
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
      }
    });
  }
}
