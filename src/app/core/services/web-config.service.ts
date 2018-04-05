import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Access } from "app/core/interfaces/access";
import { Supplier } from "../interfaces/supplier";

@Injectable()
export class WebConfigService {

  constructor() { }

  setAccess(access: Access) {
    localStorage.setItem("access", JSON.stringify(access));
  }

  getAccess(): Access {
    return JSON.parse(localStorage.getItem("access"));
  }

  setSupplier(supplier: Supplier) {
    localStorage.setItem("supplier", JSON.stringify(supplier));
  }

  getSupplier(): Supplier {
    return JSON.parse(localStorage.getItem('supplier'));
  }

  setContext(context: string) {
    localStorage.setItem("context", JSON.stringify(context));
  }

  getContext(): string {
    return JSON.parse(localStorage.getItem("context"));
  }
}
