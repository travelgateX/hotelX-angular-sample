import { Parameter } from "app/core/interfaces/parameter";

export interface Configuration {
  user?: string;
  password?: string;
  availUrl?: string;
  reservationUrl?: string;
  valuationUrl?: string;
  genericUrl?: string;
  parameters: Parameter[];
  markets: string[];
}
