import { Injectable } from '@angular/core';
import { HubService } from '../../../core/services/hub.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SupplierAccessesService {
  suppliersAccesses$ = new Subject<any>();
  supplierSpinner = new Subject<number>();

  constructor(private hubService: HubService) {}

  getSuppliersAccesses() {
    const suppliers = [];
    this.hubService.getSuppliersAccesses().valueChanges.subscribe(res => {
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
