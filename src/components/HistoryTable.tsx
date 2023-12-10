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
import { getRecentHistoryData } from "@/lib/getHistoryData";
import { HistoryData } from "../types/historyData";

const HistoryTable = () => {
  const [history, setHistory] = useState<HistoryData[]>([]);
  const { user, setUser, updateThisWeekHistory } = useUser();

  useEffect(() => {
    setHistory(user.historyData);
  }, [user.historyData]);

  useEffect(() => {
    if (user.address) {
      getRecentHistoryData(user.address).then((result) => {
        updateThisWeekHistory(result || []);
        setHistory(result || []);
      });
    }
  }, [user.address]);

  return (
    <>
      <Container maxWidth="sm" className="p-24">
        <Typography variant="h6">Participation history this week</Typography>
        {history && history.length > 0 ? (
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
        ) : (
          <Typography className="pt-4">No data available.</Typography>
        )}
      </Container>
    </>
  );
};

export default HistoryTable;
