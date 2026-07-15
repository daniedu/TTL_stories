import type { Metadata, Viewport } from "next";
import { Courier_Prime, JetBrains_Mono, Space_Mono } from "next/font/google";
import "./globals.css";
import RegisterSW from "@/components/RegisterSW";

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-courier-prime",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "TTL Stories",
  description: "Ephemeral location-based stories",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://ttl-stories.vercel.app",
  ),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TTL Stories",
  },
  openGraph: {
    title: "TTL Stories",
    description: "Ephemeral location-based stories",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://ttl-stories.vercel.app",
    siteName: "TTL Stories",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TTL Stories",
    description: "Ephemeral location-based stories",
    images: ["/opengraph-image"],
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#00416A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${courierPrime.variable} ${jetbrainsMono.variable} ${spaceMono.variable}`}
    >
      <head>
        <link rel="icon" href="/icons/icon.svg" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1" />
      </head>
      <body className="overscroll-none">{children}</body>
    </html>
  );
}
