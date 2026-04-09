import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "命理档案",
  description: "注册、建档、排盘、追问。把命理咨询长期保存在同一份个人档案里。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="oracle-body">{children}</body>
    </html>
  );
}
