import { Transaction } from "app/core/interfaces/transaction";

export interface AuditData {
  transactions: Transaction;
  timeStamp: string;
  processTime: string;
}
