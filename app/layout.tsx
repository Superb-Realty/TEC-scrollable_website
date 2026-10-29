import type { Metadata } from "next";
import localFont from "next/font/local";
import { IBM_Plex_Mono } from "next/font/google";
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

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Eastern Chambers | Grade A+ Commercial Workspaces",
  description: "Grade A+ Commercial Workspaces Designed for the Businesses of Tomorrow. Strategically positioned on LBS Marg, Vikhroli West.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${proxima.variable} ${minion.variable} ${ibmMono.variable}`}>
      <body suppressHydrationWarning>
        <a className="skip-link" href="#main-content">Skip to content</a>
        {children}
      </body>
    </html>
  );
}

