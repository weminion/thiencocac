import type { Metadata } from "next";
import { Cormorant_Garamond, Be_Vietnam_Pro, Ma_Shan_Zheng } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
});

const maShanZheng = Ma_Shan_Zheng({
  variable: "--font-ma-shan",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Thiên Cơ Các — Tử vi & Phong thuỷ",
  description: "Tra cứu tử vi, phong thủy, ngũ hành chuyên sâu theo đạo học phương Đông.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${cormorant.variable} ${beVietnam.variable} ${maShanZheng.variable} h-full`}
    >
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
