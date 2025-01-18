import { GoogleAnalytics } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  minimumScale: 1,
  initialScale: 1,
  width: "device-width",
  viewportFit: "cover",
  userScalable: false,
};

export const metadata: Metadata = {
  title: "mTransit 澳門巴士預報",
  description: "一名澳門市民因為睇唔順眼巴士報站而整嘅網站",
  manifest: "/manifest.json",
  authors: [{ name: "Matthew Ngan", url: "https://github.com/cwngan" }],
  icons: [
    { rel: "apple-touch-icon", url: "icon-128x128.png" },
    { rel: "icon", url: "icon-128x128.png" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleAnalytics gaId="G-BDX6DE2KQJ" />
      <SpeedInsights />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
