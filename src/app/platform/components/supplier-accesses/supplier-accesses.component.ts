import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { HubService } from "app/core/services/hub.service";
import { Supplier } from "app/core/interfaces/supplier";
import { Access } from "app/core/interfaces/access";
import { WebConfigService } from "../../../core/services/web-config.service";

@Component({
  selector: "b2b-supplier-accesses",
  templateUrl: "./supplier-accesses.component.html",
  styleUrls: ["./supplier-accesses.component.css"]
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
    private hubService: HubService,
    private webConfigService: WebConfigService
  ) {}

  ngOnInit() {
    this.showErrorSuppliers = false;
    this.suppliers = [];
    this.hubService.getSuppliersAccesses().valueChanges.subscribe(
      res => {
        res.data.admin.suppliers.edges.forEach(element => {
          if (
            element.node &&
            element.node.supplierData &&
            element.node.supplierData.accesses
          ) {
            this.suppliers.push(element.node.supplierData);
          }
        });
        if (
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
      supplier.accesses["edges"].forEach(element => {
        const access = element.node.accessData;
        this.accesses.push(access);
      });
    }
    if (this.accesses.length === 1) {
      this.accessesSelected.push(this.accesses[0].code);
      this.onAccessSelected(this.accesses[0].code);
    } else {
      if (
        this.accesses.findIndex(
          access => access.code === this.webConfigService.getAccess().code
        ) !== -1
      ) {
        this.accessesSelected.push(this.webConfigService.getAccess().code);
        this.onAccessSelected(this.webConfigService.getAccess().code);
      } else {
        this.onAccessSelected("");
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
      this.webConfigService.setAccess({ code: "", name: "" });
    }
    this.accessesToSearchOutput.emit(this.accessesToSearch);
  }
}
