"use client";

import { ThemeToggle } from "./ThemeToggle";
import { Bell, Menu } from "lucide-react";
import { useState } from "react";
import { notifications } from "@/lib/mockData";
import Image from "next/image";

export function Header({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="col-span-2 h-16 px-4 md:px-6 flex items-center justify-between border-b border-border bg-card/60 backdrop-blur">
      <div className="flex items-center gap-3">
        {/* Hamburger for mobile */}
        <button
          onClick={() => onOpenSidebar && onOpenSidebar()}
          className="p-2 rounded-md border border-border bg-card hover:bg-muted transition md:hidden"
          aria-label="فتح القائمة" 
          title="فتح القائمة"
        >
          <Menu size={18} />
        </button>

        <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border border-border bg-gradient-to-br from-white/5 to-black/[0.02] dark:from-white/[0.04] dark:to-black/[0.02] shadow-sm">
          <Image
            src="/d-logo404.png.jpg"
            alt="شعار الدقة والتحكم"
            fill
            sizes="(min-width: 768px) 64px, 56px"
            className="object-contain p-2"
            priority
          />
        </div>
        <div className="hidden sm:block">
          <div className="text-xl md:text-2xl font-bold leading-tight text-gradient bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400">الدقة والتحكم</div>
          <div className="text-sm text-muted-foreground">نظام إدارة متكامل</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <button onClick={() => setOpen((v) => !v)} className="relative p-2 rounded-md border border-border bg-card hover:bg-muted transition" aria-label="الإشعارات" title="الإشعارات">
            <Bell size={18} className="text-sky-400" />
            <span className="absolute -top-1 -left-1 min-w-5 h-5 px-1 rounded-full bg-rose-500 text-white text-[10px] leading-5 text-center shadow">
              4
            </span>
          </button>
          {open && (
            <div className="absolute top-10 right-0 w-80 rounded-lg border border-border bg-card shadow-xl z-50 origin-top-right" style={{ transformOrigin: "top right" }}>
              <div className="p-3 border-b border-border text-sm font-medium">الإشعارات</div>
              <ul className="max-h-80 overflow-auto">
                {notifications.map((n, i) => (
                  <li key={i} className="p-3 border-b border-border last:border-0">
                    <div className="text-xs text-muted-foreground mb-1">{n.time}</div>
                    <div className="text-sm font-medium">{n.title}</div>
                    <div className="text-[12px] mt-1">{n.detail}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}


