import { Component, Input } from '@angular/core';
import { HotelInfoAmenity } from 'app/core/interfaces/hotel-info/amenity';
import { LangService } from 'app/core/services/lang.service';

@Component({
  selector: 'b2b-amenities',
  templateUrl: './amenities.component.html',
  styleUrls: ['./amenities.component.css']
})
export class AmenitiesComponent {
  @Input() data: HotelInfoAmenity;
  prueba = 'parking';
  amenities = [
    { key: 0, code: 'airConditioner' },
    { key: 1, code: 'cleaning' },
    { key: 2, code: 'laundry' },
    { key: 3, code: 'lifts' },
    { key: 4, code: 'reception' },
    { key: 5, code: 'parking' },
    { key: 6, code: 'transfer' },
    { key: 7, code: 'internet' },
    { key: 8, code: 'childrenAmenities' },
    { key: 9, code: 'bar' },
    { key: 10, code: 'restaurant' },
    { key: 11, code: 'pool' },
    { key: 12, code: 'privateBeach' },
    { key: 13, code: 'healthAndSpa' },
    { key: 14, code: 'businessInstallations' }
  ];
  constructor(private langService: LangService) {}
}
