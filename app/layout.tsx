// layout.tsx — still a server component
import type React from "react";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Providers from "@/components/Providers";
import ClientFontStyles from "@/components/ClientFontStyles"; // <-- client component
import { Poppins } from "next/font/google";

export const metadata: Metadata = {
  title: "Guest House Management System",
  description: "Complete management solution for guest houses",
  generator: "v0.dev",
  manifest: "/manifest.json",
  keywords: ["guest house", "hotel management", "booking system", "PWA"],
  authors: [{ name: "Guest House Management" }],
  icons: {
    icon: "/icon-192.png",
    shortcut: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

// Load Poppins with weights 400 & 700
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins", // optional CSS variable
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ClientFontStyles />
      </head>
      <body className={`${poppins.className} min-h-screen bg-background antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
