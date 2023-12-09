"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { Client, rippleTimeToUnixTime, AccountTxTransaction } from "xrpl";
import { getLastSundayTime } from "@/lib/getLastSundayTime";
import { HistoryData } from "../types/historyData";

const HistoryTable = () => {
  const [history, setHistory] = useState<Array<HistoryData>>([]);

  const { user, setUser, updateThisWeekHistory } = useUser();

  useEffect(() => {
    getRecentTransactions();
  }, [user.isConnected, user.historyData]); // 空の依存配列

  const getRecentTransactions = async () => {
    if (user.address) {
      const client = new Client("wss://s.altnet.rippletest.net:51233/");
      await client.connect();

      try {
        const unixEpochTimeOfLastSunday = getLastSundayTime(); // UNIXエポック時間を取得(UTC)

        const res = await client.request({
          command: "account_tx",
          account: user.address,
          ledger_index_min: -1,
          ledger_index_max: -1,
          limit: 200,
        });

        // console.log(res);

        const transactions = res.result.transactions;

        const filteredTxs = transactions.filter((tx) => {
          if (
            tx.tx &&
            tx.tx.date !== undefined &&
            tx.tx.Memos?.[0]?.Memo?.MemoData
          ) {
            const txUnixTimestamp = rippleTimeToUnixTime(tx.tx.date);

            // console.log(txUnixTimestamp);
            // console.log(unixEpochTimeOfLastSunday);

            return txUnixTimestamp >= unixEpochTimeOfLastSunday;
          }
          return false;
        });

        const filteredHistoryData: Array<HistoryData> = filteredTxs.map(
          (tx) => {
            // console.log(tx);

            // tx.txが存在し、かつtx.tx.dateも存在する場合にのみ処理を実行
            if (tx.tx && tx.tx.date !== undefined) {
              const txUnixTimestamp = rippleTimeToUnixTime(tx.tx.date);

              // メモデータを16進数として解釈し、整数に変換
              const memoData = tx.tx.Memos?.[0]?.Memo?.MemoData;
              let resultNum: number | null = null;

              if (memoData) {
                let numberStr = Buffer.from(memoData, "hex").toString("utf8");
                if (numberStr.length === 6) {
                  resultNum = Number(numberStr);
                }
              }

              // UNIXタイムスタンプからDateオブジェクトを生成
              const date = new Date(txUnixTimestamp);

              // MM/DD/YYYY 形式で日付をフォーマット
              const formattedDate = `${
                date.getMonth() + 1
              }/${date.getDate()}/${date.getFullYear()}`;

              const res: HistoryData = {
                date: formattedDate,
                timestamp: txUnixTimestamp,
                lotteryNumber: resultNum,
                transactionLink: `https://test.bithomp.com/explorer/${tx.tx.hash}`,
                tx: tx,
              };

              return res;
            }

            // tx.txまたはtx.tx.dateが存在しない場合はデフォルト値を返す
            return {
              date: "",
              timestamp: null,
              lotteryNumber: null,
              transactionLink: "",
              tx: tx,
            };
          }
        );

        setHistory(filteredHistoryData);

        // console.log(filteredHistoryData);
      } catch (error) {
        console.error("Failed to fetch XRP balance:", error);
      } finally {
        client.disconnect();
      }
    }
  };

  return (
    <>
      <Container maxWidth="sm" className="p-24">
        <Typography variant="h6">Participation history this week</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Lottery No.</TableCell>
              <TableCell>Transaction Link</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history
              .filter((entry: HistoryData) => entry.lotteryNumber) // lotteryNumberが存在するエントリのみを保持
              .map((entry: HistoryData, index: number) => (
                <TableRow key={index}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.lotteryNumber}</TableCell>
                  <TableCell>
                    <a
                      href={entry.transactionLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Container>
    </>
  );
};

export default HistoryTable;
