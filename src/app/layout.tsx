import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { Cairo } from "next/font/google";

const cairo = Cairo({ subsets: ["arabic"], weight: ["400", "600", "700"], variable: "--font-arabic" });

export const metadata: Metadata = {
  title: "الدقة والتحكم | نظام إدارة",
  description: "نظام CRM/ERP لشركة الدقة والتحكم للمستلزمات الطبية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} antialiased bg-background text-foreground`}>
        <ThemeProvider>
          <div className="min-h-dvh grid grid-cols-[280px_1fr] grid-rows-[64px_1fr]">
            <Header />
            <Sidebar />
            <main className="p-6 bg-muted/20">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
