import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Distribution } from 'app/core/interfaces/distribution';
import { Country } from 'app/core/interfaces/country';

export interface Criteria {
  rooms: Distribution[];
  checkIn: NgbDateStruct;
  checkOut: NgbDateStruct;
  city: boolean;
  items: {
    key?: string;
    label?: string;
    display?: string;
    value?: string;
    hotels?: any[];
    destination? : boolean;
  }[];
  market?: Country;
  language?: any;
  currency?: any;
  nationality?: Country;
}
