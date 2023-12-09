import { HistoryData } from "./historyData";

export interface UserState {
  address: string;
  username: string;
  xrpBalance: number;
  historyData: HistoryData[];
  isConnected: boolean;
}
