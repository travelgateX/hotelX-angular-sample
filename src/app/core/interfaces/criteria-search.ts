import { Occupancy } from 'app/core/interfaces/occupancy';

export interface CriteriaSearch {
  checkIn: string;
  checkOut: string;
  hotels: string[];
  occupancies: Occupancy[];
  market: string;
}
