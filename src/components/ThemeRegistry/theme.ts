import { Roboto, DotGothic16 } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

// 使用したいフォントの設定
const dotGothic = DotGothic16({
  weight: ["400"],
  preload: false,
});

const theme = createTheme({
  palette: {
    mode: "light",
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    h1: {
      fontFamily: dotGothic.style.fontFamily,
    },
    h6: {
      fontFamily: dotGothic.style.fontFamily,
    },
    // 他のスタイル設定...
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.severity === "info" && {
            backgroundColor: "#000",
          }),
        }),
      },
    },
  },
});

export default theme;
