"use client";

import React, { useState, useEffect } from "react";
import {
  Client,
  Amount,
  AccountObjectsResponse,
  dropsToXrp,
  xrpToDrops,
  unixTimeToRippleTime,
} from "xrpl";
import sdk from "@crossmarkio/sdk";
import { useUser } from "../contexts/UserContext";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
} from "@mui/material";

const ClaimTable = () => {
  const [checks, setChecks] = useState<AccountObjectsResponse | null>(null);
  const { user } = useUser();

  useEffect(() => {
    getCheckTransactions();
  }, [user.isConnected]);

  const getCheckTransactions = async () => {
    if (user.address) {
      const client = new Client(process.env.NEXT_PUBLIC_XRPL_SERVER || "");
      await client.connect();

      try {
        const response = await client.request({
          command: "account_objects",
          account: user.address,
          ledger_index: "validated",
          type: "check",
        });
        // console.log(response);

        setChecks(response);
      } catch (error) {
        console.error("Failed to fetch check objects:", error);
        throw new Error("Failed to fetch check objects.");
      } finally {
        client.disconnect();
      }
    }
  };

  const handleClaim = async (checkId: string, amount: Amount) => {
    try {
      // CROSSMARK署名処理とCheckCashトランザクションの実行
      const result = await sdk.signAndSubmitAndWait({
        TransactionType: "CheckCash",
        Account: user.address,
        CheckID: checkId,
        Amount: amount, // XRP in drops
      });

      //   console.log(
      //     result.request,
      //     result.response,
      //     result.createdAt,
      //     result.resolvedAt
      //   );

      getCheckTransactions();
    } catch (error) {
      console.error("Error in handleClaim:", error);
    }
  };

  return (
    <>
      <Container maxWidth="sm" className="p-5">
        <Typography variant="h6">Claim Checks</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Claimable Amount</TableCell>
              <TableCell>Claim</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {checks?.result.account_objects.map((check, index) => {
              if (
                check.LedgerEntryType === "Check" &&
                typeof check.SendMax === "string"
              ) {
                return (
                  <TableRow key={index}>
                    <TableCell>{dropsToXrp(check.SendMax)} XRP</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => handleClaim(check.index, check.SendMax)}
                      >
                        Claim
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              }
              return null; // Checkオブジェクトでない、またはSendMaxが適切な形式でない場合は何も表示しない
            })}
          </TableBody>
        </Table>
      </Container>
    </>
  );
};

export default ClaimTable;
