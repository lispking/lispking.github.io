import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Components
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { GoogleAdSense } from "@/components/GoogleAdSense";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "King - 个人技术博客",
  description: "分享技术见解，探索创新解决方案，连接志同道合的技术爱好者",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
  },
  manifest: "/manifest.json",
  themeColor: "#6366F1",
  authors: [{ name: "King" }],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <Navbar />
        <main className="min-h-screen pt-20">
          {children}
        </main>
        <Footer />
        <GoogleAnalytics gaId="G-28440BWWYK" />
        <GoogleAdSense publisherId="pub-6255376809208012" />
        <GoogleTagManager gtmId="G-28440BWWYK" />
      </body>
    </html>
  );
}
