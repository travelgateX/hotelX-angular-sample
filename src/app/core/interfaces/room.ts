import { Promotion } from './promotion';
import { RatePlan } from './rate-plan';
import { Bed } from './bed';
import { RoomPrice } from './room-price';

export interface Room {
  occupancyRefId: number;
  code: string;
  description: string;
  refundable: boolean;
  units: null | number;
  roomPrice: RoomPrice;
  beds: Bed[] | null;
  ratePlans: RatePlan[] | null;
  promotions: Promotion[] | null;
}
