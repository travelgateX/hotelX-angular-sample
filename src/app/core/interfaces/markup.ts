import { Exchange } from './exchange';
export interface Markup {
  channel: string;
  currency: string;
  binding: boolean;
  net: number;
  gross: number;
  exchange: Exchange;
}
