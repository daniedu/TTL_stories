import type { Metadata, Viewport } from "next";
import "./globals.css";
import RegisterSW from "@/components/RegisterSW";

export const metadata: Metadata = {
  title: "TTL Stories",
  description: "Ephemeral location-based stories",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ttl-stories.vercel.app"),
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
  themeColor: "#1e3a5f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
        <link rel="apple-touch-startup-image" href="/icons/icon.svg" />
      </head>
      <body className="overscroll-none">
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
