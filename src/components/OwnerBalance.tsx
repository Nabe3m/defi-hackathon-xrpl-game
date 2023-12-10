"use client";
import React, { useState, useEffect } from "react";
import { Typography, Box, CircularProgress, Link } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import { Client, dropsToXrp } from "xrpl";

const OwnerBalance = () => {
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      const client = new Client(process.env.NEXT_PUBLIC_XRPL_SERVER || "");
      try {
        await client.connect();
        const response = await client.request({
          command: "account_info",
          account: process.env.NEXT_PUBLIC_OWNER_WALLET_ADDRESS,
          ledger_index: "validated",
        });

        const accountInfo = response.result as any;
        setBalance(dropsToXrp(accountInfo?.account_data.Balance) || "0");
      } catch (error) {
        console.error("Error fetching balance:", error);
      } finally {
        client.disconnect();
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, []);

  const ownerWalletLink = `https://xrpscan.com/account/${process.env.NEXT_PUBLIC_OWNER_WALLET_ADDRESS}`;

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      padding="2rem 0 4rem"
    >
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant="h5">
            Pooled XRP: {balance ? `${balance} XRP` : "Unavailable"}
          </Typography>
          <Link
            href={ownerWalletLink}
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body1">Owner Account</Typography>
              <LinkIcon />
            </Box>
          </Link>
        </>
      )}
    </Box>
  );
};

export default OwnerBalance;
