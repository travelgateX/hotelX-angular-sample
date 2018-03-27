import { HotelInfoLocation } from 'app/core/interfaces/hotel-info/location';
import { HotelInfoContact } from 'app/core/interfaces/hotel-info/contact';
import { HotelInfoDestination } from 'app/core/interfaces/hotel-info/destination';
import { HotelInfoAmenity } from 'app/core/interfaces/hotel-info/amenity';
import { HotelInfoDescription } from 'app/core/interfaces/hotel-info/description';
import { HotelInfoMedia } from 'app/core/interfaces/hotel-info/media';

export interface HotelInfoDetail {
  hotelCode: string;
  hotelName: string;
  categoryCode: string;
  // exclusiveDeal: Boolean;
  medias: HotelInfoMedia[];
  amenities: HotelInfoAmenity[];
  descriptions: HotelInfoDescription[];
  location: HotelInfoLocation;
  contact: HotelInfoContact;
  // destination: HotelInfoDestination;
}
