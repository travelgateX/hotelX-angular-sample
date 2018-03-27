import { BookingCriteriaDateType } from "app/core/enumerates/booking-criteria-date-type";

export interface CriteriaBookingDates {
  dateType: BookingCriteriaDateType;
  start: string;
  end: string;
}
