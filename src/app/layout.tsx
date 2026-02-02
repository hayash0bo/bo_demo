import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BRING OUT - 商談書き起こし構造化解析デモ",
  description: "商談の書き起こしテキストを構造化解析するプロセスをデモするアプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-50 text-gray-700 antialiased" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
