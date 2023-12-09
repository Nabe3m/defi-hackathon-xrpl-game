import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { UserProvider } from "../contexts/UserContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Raffle{X}",
  description: "Game apps to enjoy in XRPL",
  icons: {
    icon: [{ url: "/apple-touch-icon.png" }],
    shortcut: ["apple-touch-icon"],
    apple: [{ url: "/apple-touch-icon" }],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-touch-icon-precomposed.png",
      },
    ],
  },
  openGraph: {
    images: "/og-image.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" prefix="og: http://ogp.me/ns#">
      <body className={inter.className}>
        <ThemeRegistry>
          <UserProvider>
            <Header />
            {children}
            <Footer />
          </UserProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
