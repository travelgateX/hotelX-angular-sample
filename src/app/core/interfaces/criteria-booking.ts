import { CriteriaBookingReference } from "app/core/interfaces/criteria-booking-reference";
import { BookingCriteriaType } from "app/core/enumerates/booking-criteria-type";
import { CriteriaBookingDates } from "app/core/interfaces/criteria-booking-dates";

export interface CriteriaBooking {
  accessCode: string;
  language: string;
  typeSearch: BookingCriteriaType;
  references?: CriteriaBookingReference;
  dates?: CriteriaBookingDates
}
