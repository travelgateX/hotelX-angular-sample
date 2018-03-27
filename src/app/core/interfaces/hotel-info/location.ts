import { HotelInfoGeocode } from 'app/core/interfaces/hotel-info/geocode';

export interface HotelInfoLocation {
  adress: string;
  city: string;
  zipCode: string;
  country: string;
  coordinates: HotelInfoGeocode;
}
