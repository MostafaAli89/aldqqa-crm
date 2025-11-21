"use client";

import React, { useState } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="min-h-dvh grid grid-cols-1 grid-rows-[64px_1fr] md:pr-[280px]">
        <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="p-4 md:p-6 bg-muted/20">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
