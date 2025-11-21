import type { Metadata } from "next";
import "./globals.css";
import { Cairo } from "next/font/google";
import ClientShell from "../components/ClientShell";

const cairo = Cairo({ subsets: ["arabic"], weight: ["400", "600", "700"], variable: "--font-arabic" });

export const metadata: Metadata = {
  title: "الدقة والتحكم | نظام إدارة",
  description: "نظام CRM/ERP لشركة الدقة والتحكم للمستلزمات الطبية",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${cairo.variable} antialiased bg-background text-foreground`}>
        <ClientShell>
          {children}
        </ClientShell>
      </body>
    </html>
  );
}
