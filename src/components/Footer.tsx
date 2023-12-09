import React from "react";
import { Box, Typography, Container } from "@mui/material";
import { DotGothic16 } from "next/font/google";

const dotGothic16 = DotGothic16({
  weight: ["400"],
  preload: false,
});

const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ bgcolor: "background.paper", py: 6 }}>
      <Container maxWidth="lg">
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          <span className={dotGothic16.className}>© Raffle&#123;X&#125;</span>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
