"use client";

import { xrpToDrops } from "xrpl";
import sdk from "@crossmarkio/sdk";
import { Button } from "@mui/material";
import { useUser } from "../contexts/UserContext";
import { HistoryData } from "../types/historyData";
import { fetchOwnerBalance } from "@/lib/getOwnerBalance";

export default function ButtonJoin() {
  const { user, setUser, updateThisWeekHistory } = useUser();

  const handleJoinClick = async () => {
    if (user?.address) {
      // 6桁のランダムな数値を生成
      const randomSixDigits = Math.floor(
        Math.random() * 900000 + 100000
      ).toString();

      let result = await sdk.signAndSubmitAndWait({
        TransactionType: "Payment",
        Account: user.address,
        Destination: process.env.NEXT_PUBLIC_OWNER_WALLET_ADDRESS,
        Amount: xrpToDrops("1"), // 1XRP
        Memos: [
          {
            Memo: {
              MemoData: Buffer.from(randomSixDigits, "utf8").toString("hex"),
            },
          },
        ],
      });

      if (!result.createdAt) {
        throw new Error("The transaction failed.");
      }

      const txUnixTimestamp = result.createdAt;
      const date = new Date(txUnixTimestamp);

      const formattedDate = `${
        date.getMonth() + 1
      }/${date.getDate()}/${date.getFullYear()}`;

      console.log(result);

      const res: HistoryData = {
        date: formattedDate,
        timestamp: txUnixTimestamp,
        lotteryNumber: Number(randomSixDigits),
        transactionLink: `https://test.bithomp.com/explorer/${result.response.data.resp.result.hash}`,
        tx: result.request.data.tx,
      };

      updateThisWeekHistory([res]);

      // updateOwnerBalance(fetchOwnerBalance());
    }
  };

  return (
    <>
      {user?.isConnected && (
        <Button variant="contained" onClick={handleJoinClick}>
          Draw lots
        </Button>
      )}
    </>
  );
}
