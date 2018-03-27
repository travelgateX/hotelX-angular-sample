import { IError } from 'app/core/interfaces/error';
import { TGXText } from 'app/core/interfaces/text';

export interface HotelInfoAmenity {
  code: number;
  type: string;
  texts: TGXText[];
}
