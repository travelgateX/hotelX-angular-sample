import { CancelPenalty } from './cancel-penalty';

export interface CancelPolicy {
  refundable: boolean;
  cancelPenalties: CancelPenalty[];
}
