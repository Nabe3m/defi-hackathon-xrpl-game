import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import HeaderUser from "@/components/HeaderUser";
import { DotGothic16 } from "next/font/google";

const dotGothic16 = DotGothic16({
  weight: ["400"],
  preload: false,
});

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" className={dotGothic16.className}>
            Raffle&#123;X&#125;
          </Typography>
        </Box>
        <HeaderUser />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
