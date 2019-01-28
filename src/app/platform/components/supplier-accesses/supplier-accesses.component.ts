import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Supplier, Access } from 'app/core/interfaces';
import { WebConfigService } from '../../../core/services/web-config.service';
import { SupplierAccessesService } from './supplier-accesses.service';
import { OrganizationSelectorService } from '../../../shared/components/selectors/organization-selector/organization-selector.service';
import { NotificationService } from 'app/shared/services/notification.service';

@Component({
  selector: 'b2b-supplier-accesses',
  templateUrl: './supplier-accesses.component.html',
  styleUrls: ['./supplier-accesses.component.css']
})
export class SupplierAccessesComponent implements OnInit {
  @Output() accessesToSearchOutput = new EventEmitter();
  accesses: Access[];
  accessesSelected: string[];
  accessesToSearch: Access[];
  showErrorSuppliers: boolean;
  suppliers: Supplier[];
  supplierSelected: string;
  constructor(
    private webConfigService: WebConfigService,
    private supplierAccessesService: SupplierAccessesService,
    private organizationSelectorService: OrganizationSelectorService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.showErrorSuppliers = false;
    this.suppliers = [];
    this.organizationSelectorService.organizationSelected$.subscribe(res => {
      this.supplierAccessesService.getSuppliersAccesses(res);
    });
    this.supplierAccessesService.suppliersAccesses$.subscribe(
      res => {
        this.suppliers = res;
        if(this.suppliers.length === 0){
          this.notificationService.toast('Suppliers', 'No suppliers available', 5)
        }
        const access = this.webConfigService.getObjectFromLocalStorage('access');
        if (access && access.code) {
          for (let i = 0; i < this.suppliers.length; i++) {
            if (
              this.suppliers[i].accesses &&
              this.suppliers[i].accesses['edges'].findIndex(element => {
                return (
                  element.node.accessData.code ===
                  this.webConfigService.getObjectFromLocalStorage('access')['code']
                );
              }) !== -1
            ) {
              this.supplierSelected = this.suppliers[i].code;
              this.onSupplierSelected();
              break;
            }
          }
          if(!this.supplierSelected){
            this.supplierSelected = this.suppliers[0].code;
            this.onSupplierSelected();
          }
        } else if (this.suppliers.length === 1) {
          this.supplierSelected = this.suppliers[0].code;
          this.onSupplierSelected();
        } else if (
          this.webConfigService.getObjectFromLocalStorage('supplier') &&
          this.suppliers.findIndex(
            supplier =>
              supplier.code ===
              this.webConfigService.getObjectFromLocalStorage('supplier')['code']
          ) !== -1
        ) {
          this.supplierSelected = this.webConfigService.getObjectFromLocalStorage(
            'supplier'
          )['code'];
          this.onSupplierSelected();
        }
      },
      err => {
        this.showErrorSuppliers = true;
      }
    );
  }

  /**
   * Get the accesses of the supplier selected and charge it on the accesses variable.
   */
  onSupplierSelected() {
    this.accesses = [];
    this.accessesSelected = [];
    this.accessesToSearch = [];
    // this.criteria.items = [];

    const supplier = this.suppliers.find(s => s.code === this.supplierSelected);
    this.webConfigService.setObjectInLocalStorage('supplier', supplier);
    this.webConfigService.setItemInLocalStorage('context', supplier.context);
    if (supplier && supplier.accesses) {
      supplier.accesses['edges'].forEach(element => {
        const access = element.node.accessData;
        this.accesses.push(access);
      });
      this.accesses = this.accesses.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    }
    if (this.accesses.length === 1) {
      this.accessesSelected.push(this.accesses[0].code);
      this.onAccessSelected(this.accesses[0].code);
    } else {
      const accessAux = this.webConfigService.getObjectFromLocalStorage('access');
      if (
        accessAux &&
        this.accesses.findIndex(access => access.code === accessAux.code) !== -1
      ) {
        this.accessesSelected.push(accessAux.code);
        this.onAccessSelected(accessAux.code);
      } else {
        this.onAccessSelected('');
      }
    }
  }

  /**
   * Save the access selected cause the select save the object as string "[Object object]"
   * and we need another variable to store the access selected
   * @param $event Code of access selected
   */
  onAccessSelected($event) {
    this.accessesToSearch = this.accesses.filter(
      access => access.code === $event
    );
    if (this.accessesToSearch.length !== 0) {
      this.webConfigService.setObjectInLocalStorage(
        'access',
        this.accessesToSearch[0]
      );
    } else {
      this.webConfigService.setObjectInLocalStorage('access', {
        code: '',
        name: '',
        isTest: false
      });
    }
    this.accessesToSearchOutput.emit(this.accessesToSearch);
  }
}
