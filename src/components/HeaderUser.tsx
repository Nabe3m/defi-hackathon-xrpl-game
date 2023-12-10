"use client";

import React from "react";
import { Typography, Button, Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useUser } from "../contexts/UserContext";
import sdk from "@crossmarkio/sdk";

const HeaderUser = () => {
  const { user, setUser } = useUser();

  const handleConnectWallet = async () => {
    if (!user.isConnected) {
      const id = sdk.signIn();

      // if (id) {
      //   if (sdk.api.connected) {
      //     console.log(sdk.api);
      //     setUser({
      //       address: sdk.session?.address || "",
      //       username: sdk.session?.user?.username || "",
      //       xrpBalance: 0,
      //       historyData: [],
      //       isConnected: true,
      //     });
      //   }
      // }
    } else {
      // sign out
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {user.isConnected && (
        <>
          {/* <Typography marginRight={2}>{user.xrpBalance} XRP</Typography> */}
          <AccountCircleIcon />
          <Typography>{user.username || user.address}</Typography>
        </>
      )}
      {!user.isConnected && (
        <Button
          variant="outlined"
          onClick={handleConnectWallet}
          sx={{
            border: 1,
            color: "white",
            "&:hover": {
              borderColor: "white",
              backgroundColor: "white",
              color: "black",
            },
          }}
        >
          {user.isConnected ? "Disconnect" : "Connect with CROSSMARK"}
        </Button>
      )}
    </Box>
  );
};

export default HeaderUser;
