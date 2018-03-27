
import { Access } from "app/core/interfaces/access";

export interface Supplier {
  code: string;
  name: string;
  isActive?: boolean;
  // provider: Provider;
  context?: string;
  serviceApi?: number;
  // legacy: LegacyData;
  supplierGroup?: string;
  accesses: Access[]; // Will be edges on intermidiate
}
