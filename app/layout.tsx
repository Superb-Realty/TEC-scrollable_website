import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eastern Chamber — Where Nature Meets Distinction",
  description: "A cinematic introduction to Eastern Chamber, where nature reveals architecture.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body suppressHydrationWarning>{children}</body></html>;
}

