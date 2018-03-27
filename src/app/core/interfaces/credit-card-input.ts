import { ExpireDate } from "app/core/interfaces/expire-date";
import { HolderInput } from "app/core/interfaces/holder-input";

export interface CreditCardInput {
  cardType: string;
  holder: HolderInput;
  number: string;
  CVC: string;
  expire: ExpireDate;
}
