import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Distribution } from 'app/core/interfaces/distribution';

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
  market: any;
}
