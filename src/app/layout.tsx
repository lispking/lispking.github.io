import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Components
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
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
  title: "King - 个人技术博客与项目分享",
  description: "欢迎来到 King 个人技术博客，探索前沿技术和开发经验，分享创新见解，助力开发者成长。",
  keywords: [
    "全栈开发", "Web3技术", "区块链技术", "技术博客", "前端开发", "数据库开发", "Rust编程", "Chrome扩展"
  ],
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
        <main className="min-h-screen pt-20">{children}</main>
        <Footer />
        <GoogleAnalytics gaId="G-28440BWWYK" />
        <GoogleAdSense publisherId="pub-6255376809208012" />
        <GoogleTagManager gtmId="G-28440BWWYK" />
      </body>
    </html>
  );
}
