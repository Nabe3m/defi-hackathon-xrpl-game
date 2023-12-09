import Image from "next/image";
import { DotGothic16 } from "next/font/google";
import { Typography, Button } from "@mui/material";
import ButtonJoin from "@/components/ButtonJoin";
import AccordionGuide from "@/components/AccordionGuide";
import HistoryTable from "@/components/HistoryTable";
import ClaimTable from "@/components/CraimTable";
import Suspension from "@/components/Suspension";
import isSaturdayEvening from "@/lib/isSaturdayEvening";

// 使用したいフォントの設定
// const dotGothic = DotGothic16({
//   weight: ["400"],
//   preload: false,
// });

const dotGothic16 = DotGothic16({
  weight: ["400"],
  preload: false,
});

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center pt-24">
      <Typography
        variant="h1"
        component="h1"
        className={dotGothic16.className}
        sx={{
          fontSize: { xs: "4rem", sm: "6rem", md: "8rem", lg: "9rem" },
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        Raffle&#123;X&#125;
      </Typography>
      {isSaturdayEvening() && <Suspension />}
      {!isSaturdayEvening() && <ButtonJoin />}
      <AccordionGuide />
      {!isSaturdayEvening() && <HistoryTable />}
      <ClaimTable />
    </main>
  );
}
