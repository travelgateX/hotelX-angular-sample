import { Markup } from './markup';
import { Exchange } from './exchange';
export interface Price {
  currency: string;
  binding: boolean;
  net: number;
  gross: number;
  exchange: Exchange;
  markeups: Markup[];
}
