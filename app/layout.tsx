import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { WebMCP } from "@/components/WebMCP";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TraderAdd | The intelligent trading journal",
  description:
    "TraderAdd helps traders journal, review, analyze and improve their trading process with analytics, charts and AI-powered insights.",
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
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="absolute left-4 top-0 -translate-y-full focus:translate-y-4 z-50 px-4 py-2 bg-white text-black rounded-md font-semibold outline-none ring-2 ring-accent transition-transform"
        >
          Skip to main content
        </a>
        {children}
        <Analytics />
        <WebMCP />
      </body>
    </html>
  );
}
