import { Reference } from "app/core/interfaces/reference";

export interface CriteriaBookingReference {
  hotelCode?: string;
  currency?: string;
  references: [Reference];
}
