"use client";

import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState("");

  const calculateTimeLeft = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);

    const difference = tomorrow.getTime() - now.getTime();
    let timeLeft = "";

    if (difference > 0) {
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      timeLeft = `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;
    }

    return timeLeft;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <Typography>
        Currently tallying. <br />
        Resumption will occur from 0:00 (UTC time).
      </Typography>
      <Typography
        variant="h4"
        style={{ fontSize: "2rem", textAlign: "center", marginTop: "20px" }}
      >
        {timeLeft}
      </Typography>
    </div>
  );
};

export default CountdownTimer;
