import { Breakdown } from './breakdown';
import { Price } from './price';

export interface RoomPrice {
  price: Price;
  breakdown: Breakdown[] | null;
}
