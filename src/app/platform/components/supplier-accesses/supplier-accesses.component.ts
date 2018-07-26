import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Supplier, Access } from 'app/core/interfaces';
import { WebConfigService } from '../../../core/services/web-config.service';
import { SupplierAccessesService } from './supplier-accesses.service';

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
  ) {}

  ngOnInit() {
    this.showErrorSuppliers = false;
    this.suppliers = [];
    this.supplierAccessesService.getSuppliersAccesses();
    this.supplierAccessesService.suppliersAccesses$.subscribe(
      res => {
        this.suppliers = res;
        if (
          this.webConfigService.getAccess() &&
          this.webConfigService.getAccess().code
        ) {
          for (
            let i = 0;
            i < this.suppliers.length && !this.supplierSelected;
            i++
          ) {
            if (
              this.suppliers[i].accesses['edges'].findIndex(element => {
                return (
                  element.node.accessData.code ===
                  this.webConfigService.getAccess().code
                );
              }) !== -1
            ) {
              this.supplierSelected = this.suppliers[i].code;
              this.onSupplierSelected();
            }
          }
        } else if (this.suppliers.length === 1) {
          this.supplierSelected = this.suppliers[0].code;
          this.onSupplierSelected();
        } else if (
          this.webConfigService.getSupplier() &&
          this.suppliers.findIndex(
            supplier =>
              supplier.code === this.webConfigService.getSupplier().code
          ) !== -1
        ) {
          this.supplierSelected = this.webConfigService.getSupplier().code;
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
    this.webConfigService.setSupplier(supplier);
    this.webConfigService.setContext(supplier.context);
    if (supplier && supplier.accesses) {
      supplier.accesses['edges'].forEach(element => {
        const access = element.node.accessData;
        this.accesses.push(access);
      });
    }
    if (this.accesses.length === 1) {
      this.accessesSelected.push(this.accesses[0].code);
      this.onAccessSelected(this.accesses[0].code);
    } else {
      if (
        this.webConfigService.getAccess() &&
        this.accesses.findIndex(
          access => access.code === this.webConfigService.getAccess().code
        ) !== -1
      ) {
        this.accessesSelected.push(this.webConfigService.getAccess().code);
        this.onAccessSelected(this.webConfigService.getAccess().code);
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
      this.webConfigService.setAccess(this.accessesToSearch[0]);
    } else {
      this.webConfigService.setAccess({ code: '', name: '' });
    }
    this.accessesToSearchOutput.emit(this.accessesToSearch);
  }
}
