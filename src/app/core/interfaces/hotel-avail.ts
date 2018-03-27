import { Option } from './option';
import { HotelInfoDetail } from 'app/core/interfaces/hotel-info/hotel-info-detail';

export interface HotelAvail {
  info: HotelInfoDetail;
  options: Option[];
}
