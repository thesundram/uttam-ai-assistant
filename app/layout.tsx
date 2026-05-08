import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UISPL AI Agent — Uttam Innovative Solution Pvt. Ltd.",
  description:
    "AI-powered assistant for Uttam Innovative Solution Pvt. Ltd. and Uttam Galva Steels. Ask anything about our IT services, AI solutions, and steel products.",
  keywords:
    "Uttam Innovative Solution, UISPL, Uttam Galva, AI Agent, Industrial AI, Steel Company, IT Company Mumbai",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        <link rel="icon" href="/favicon.svg" />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
