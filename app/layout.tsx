import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chazz Atelier | Foreign Patent Knowledge System",
  description: "涉外专利、AI 工作流与个人知识品牌的高端沉浸式视觉站点。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
