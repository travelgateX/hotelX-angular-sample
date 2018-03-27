import { Reference } from "app/core/interfaces/reference";

export interface CancelBooking {
  accessCode: string,
  hotelCode: string,
  reference: Reference
}
