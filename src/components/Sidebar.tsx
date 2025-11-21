"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gauge, Users, Truck, ShoppingCart, Boxes, Wallet, ReceiptText, BriefcaseBusiness, Building2 } from "lucide-react";

const navItems = [
  { href: "/", label: "لوحة التحكم", Icon: Gauge },
  { href: "/employees", label: "العاملين", Icon: BriefcaseBusiness },
  { href: "/alumlaa", label: "العملاء", Icon: Users },
  { href: "/almowaridoon", label: "الموردون", Icon: Truck },
  { href: "/almabeaat", label: "المبيعات", Icon: ShoppingCart },
  { href: "/almakhzon", label: "المخزون", Icon: Boxes },
  { href: "/almalia", label: "الإيرادات", Icon: Wallet },
  { href: "/expenses", label: "المصروفات والتكاليف", Icon: ReceiptText },
  { href: "/branches", label: "إدارة الفروع", Icon: Building2 },
  
];

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {/* Desktop fixed sidebar (full-height with inner scrolling) */}
      <aside className="hidden md:block md:fixed md:top-0 md:right-0 md:h-screen md:w-[280px] md:overflow-y-auto row-start-2 border-l border-border bg-card/50 backdrop-blur p-4 z-20">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm border transition flex items-center gap-2 ${
                  active ? "bg-primary/10 border-primary text-primary" : "border-transparent hover:bg-muted"
                }`}
              >
                <item.Icon size={16} className={active ? "text-primary" : "text-muted-foreground"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile drawer */}
      <div aria-hidden={!isOpen} className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black/50" onClick={() => onClose && onClose()} />
          <aside className={`fixed top-0 right-0 h-full w-72 transform ${isOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-200 z-50 border-l border-border bg-card p-4`}> 
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">القائمة</div>
              <button onClick={() => onClose && onClose()} className="px-2 py-1 rounded-md border border-border">إغلاق</button>
            </div>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => onClose && onClose()}
                    className={`px-3 py-2 rounded-md text-sm border transition flex items-center gap-2 ${
                      active ? "bg-primary/10 border-primary text-primary" : "border-transparent hover:bg-muted"
                    }`}
                  >
                    <item.Icon size={16} className={active ? "text-primary" : "text-muted-foreground"} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      </div>
    </>
  );
}


