import { HotelOptionQuote } from './hotel-option-quote';
import { IWarning } from 'app/core/interfaces/warning';
import { IError } from 'app/core/interfaces/error';

export interface HotelQuote {
  optionQuote: HotelOptionQuote;
  errors: IError[];
  warnings: IWarning[];
}
