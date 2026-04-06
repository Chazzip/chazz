import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chazz Atelier | Foreign Patent Knowledge System",
  description: "涉外专利、AI 工作流与高密度知识产品设计的超强视觉品牌站。"
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
