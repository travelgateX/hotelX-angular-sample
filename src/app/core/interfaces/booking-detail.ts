import { Option } from 'app/core/interfaces/option';
import { Search } from 'app/core/interfaces/search';
import { HotelBookInput } from 'app/core/interfaces/hotel-book-input';
import { HotelInfoDetail } from 'app/core/interfaces/hotel-info/hotel-info-detail';

export interface BookingDetail {
  hotelInfo: HotelInfoDetail;
  option: Option;
  search: Search;
  input: HotelBookInput;
}
