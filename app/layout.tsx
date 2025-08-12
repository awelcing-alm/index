import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { EB_Garamond, Source_Sans_3 } from "next/font/google";

const serif = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZINDEX",
  description: "Account Management for the modern KM.",
  generator: "almaw",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* newspaper class adds subtle letterspacing; font-sans uses the Source Sans 3 var */}
      <body
        className={cn(
          "min-h-screen font-sans antialiased newspaper",
          serif.variable,
          sans.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
