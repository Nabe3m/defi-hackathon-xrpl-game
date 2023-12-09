"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { UserState } from "../types/user";
import { HistoryData } from "../types/historyData";
import sdk from "@crossmarkio/sdk";
import { Client, Transaction, AccountTxTransaction } from "xrpl";

const initialState: UserState = {
  address: "",
  username: "",
  xrpBalance: 0,
  historyData: [],
  isConnected: false,
};

const UserContext = createContext<{
  user: UserState;
  setUser: React.Dispatch<React.SetStateAction<UserState>>;
  // updateXrpBalance: () => Promise<void>;
  updateThisWeekHistory: (newTransactions: HistoryData[]) => void;
}>({
  user: initialState,
  setUser: () => {},
  // updateXrpBalance: async () => {},
  updateThisWeekHistory: () => {},
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserState>(initialState);

  const asyncConnectWallet = async (data: any) => {
    try {
      if (data && !user.isConnected && data.response.data.address) {
        setUser({
          address: data.response.data.address,
          username: sdk.session.user?.username || "USER",
          xrpBalance: 0,
          historyData: [],
          isConnected: true,
        });
      }
    } catch (error) {
      console.error("Error in asyncConnectWallet:", error);
    }
  };

  const updateXrpBalance = async () => {
    // if (user.address) {
    //   const client = new Client("wss://s.altnet.rippletest.net:51233/");
    //   await client.connect();
    //   try {
    //     const response = await client.request({
    //       command: "account_info",
    //       account: user.address,
    //       ledger_index: "validated",
    //     });
    //     const xrpBalanceInDrops = response.result.account_data.Balance; // ドロップ単位での残高（文字列）
    //     const newXrpBalance = parseFloat(xrpBalanceInDrops) / 1000000; // 数値に変換してからXRP単位に変換
    //     setUser((prev) => ({ ...prev, xrpBalance: newXrpBalance }));
    //   } catch (error) {
    //     console.error("Failed to fetch XRP balance:", error);
    //   } finally {
    //     client.disconnect();
    //   }
    // }
  };

  useEffect(() => {
    // イベントリスナーの設定
    const handleResponse = (data: any) => {
      if (data?.request?.command === "address") {
        asyncConnectWallet(data);
      }
    };

    sdk?.on("response", handleResponse);
  }, [user.isConnected]);

  // コンポーネントがマウントされた時にXRP残高を更新
  // useEffect(() => {
  //   if (user.isConnected && user.address) {
  //     updateXrpBalance();
  //   }
  // }, [user.isConnected]);

  const updateThisWeekHistory = (newTransactions: HistoryData[]) => {
    setUser((prev) => ({ ...prev, historyData: newTransactions }));
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateThisWeekHistory }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
