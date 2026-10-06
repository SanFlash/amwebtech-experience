import type { Metadata } from "next";
import "./globals.css";
import "./responsive.css";

export const metadata: Metadata = {
  title: "AM Webtech — Testing. Redefined.",
  description: "AI-driven software quality assurance, automation, performance, mobile, API and digital testing.",
  icons: { icon: "/amwebtech-logo.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}