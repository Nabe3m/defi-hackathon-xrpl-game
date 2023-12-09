import { AccountTxTransaction } from "xrpl";

export interface HistoryData {
  date: string;
  timestamp: number | null;
  lotteryNumber: number | null;
  transactionLink: string;
  tx: any;
}
