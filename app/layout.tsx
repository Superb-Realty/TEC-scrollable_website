import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const proxima = localFont({
  src: [
    { path: "../assets/fonts/ProximaNova-Light.otf", weight: "300" },
    { path: "../assets/fonts/ProximaNova-Semibold.otf", weight: "600" },
    { path: "../assets/fonts/Proxima Nova Bold.otf", weight: "700" },
  ],
  variable: "--font-proxima",
  display: "swap",
});

const minion = localFont({
  src: "../assets/fonts/MinionPro-Regular.otf",
  variable: "--font-minion",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Eastern Chamber — Where Nature Meets Distinction",
  description: "A cinematic introduction to Eastern Chamber, where nature reveals architecture.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${proxima.variable} ${minion.variable}`}><body suppressHydrationWarning>{children}</body></html>;
}

