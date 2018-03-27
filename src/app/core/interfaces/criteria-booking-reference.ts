import { Reference } from "app/core/interfaces/reference";

export interface CriteriaBookingReference {
  hotel: string;
  currency: string;
  references: [Reference];
}
