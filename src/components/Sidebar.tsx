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

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="row-start-2 col-start-1 border-l border-border bg-card/50 backdrop-blur p-4">
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
  );
}


