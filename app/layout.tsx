import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Community Platform",
  description: "커뮤니티 플랫폼 - DDD 기반 프로덕션급 애플리케이션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
