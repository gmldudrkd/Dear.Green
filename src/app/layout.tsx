import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import { PointsProvider } from "@/context/PointsContext";
import "./globals.css";

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Dear Earth - 친애하는 지구에게",
  description: "당신의 식탁과 지구 사이, 다정한 거리를 만드는 기록",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${caveat.variable} antialiased`}>
          <PointsProvider>{children}</PointsProvider>
        </body>
    </html>
  );
}
