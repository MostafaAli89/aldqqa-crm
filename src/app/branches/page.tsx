"use client";

import { computeBranchKpis, formatCurrency, getBranches, getBranchProfiles, computeAvgOrderValueByBranch, computeMonthlyChangePct, totalEmployees, computeTargetAchievementByBranch } from "@/lib/branches";
import { useMemo, useState } from "react";
import Link from "next/link";
import { KPICard } from "@/components/KPICard";
import {
  Building2,
  Users,
  CircleDollarSign,
  TrendingUp,
  BarChart3,
  Target,
  ShoppingBag,
  Warehouse,
  UserCheck,
  BadgePercent,
  Receipt,
  Plus,
  Pencil,
  Trash2,
  Mail,
  MapPin,
  Phone,
  User,
  Calendar,
  ArrowUpRight,
  Eye
} from "lucide-react";

export default function BranchesPage() {
  const kpis = useMemo(() => computeBranchKpis(), []);
  const branches = getBranches();
  const profiles = getBranchProfiles();
  const avgOrder = computeAvgOrderValueByBranch();
  const monthlyChange = computeMonthlyChangePct();
  const targetRate = computeTargetAchievementByBranch();
  const [selected, setSelected] = useState<string>("الرياض");
  const [showNewModal, setShowNewModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const selectedKpi = kpis.find((k) => k.branch === selected);

  // Charts data (kept for future extensions, hidden in this style)
  const netProfit = kpis.map((k) => ({ name: k.branch, value: k.netProfit }));
  const clients = kpis.map((k) => ({ name: k.branch, value: k.clientsCount }));

  const totalBranches = branches.length;
  // profiles contains branch metadata — use its length for active branches count
  const activeBranches = profiles.length;
  const totalRevenue = kpis.reduce((sum, k) => sum + k.totalRevenue, 0);
  const totalProfit = kpis.reduce((sum, k) => sum + k.netProfit, 0);
  const avgOrderValue = Object.values(avgOrder).reduce((sum, val) => sum + val, 0) / totalBranches;
  const avgTargetAchievement = Object.values(targetRate).reduce((sum, val) => sum + val, 0) / totalBranches;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground">إدارة الفروع</h1>
        <div className="ms-auto flex items-center gap-2">
          <button 
            onClick={() => setShowNewModal(true)} 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-sm transition-all duration-200 hover:shadow active:scale-95"
          >
            <Plus size={18} className="text-blue-100" /> إضافة فرع جديد
          </button>
        </div>
      </div>



      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <MetricCard2 title="إجمالي الإيرادات" value={formatCurrency(selectedKpi?.totalRevenue || 0)} accent="from-sky-500/15 to-sky-500/5" onClick={() => setSelected("الرياض")} />
        <MetricCard2 title="إجمالي المصروفات" value={formatCurrency(selectedKpi?.totalExpenses || 0)} accent="from-rose-500/15 to-rose-500/5" onClick={() => setSelected("الرياض")} />
        <MetricCard2 title="صافي الربح" value={`${formatCurrency(selectedKpi?.netProfit || 0)} (${(selectedKpi?.netProfitPct || 0).toFixed(1)}%)`} accent="from-emerald-500/15 to-emerald-500/5" onClick={() => setSelected("الرياض")} />
        <MetricCard2 title="عدد الفروع" value={`${branches.length}`} accent="from-indigo-500/15 to-indigo-500/5" onClick={() => {}} />
        <MetricCard2 title="إجمالي الموظفين" value={`${totalEmployees()}`} accent="from-amber-500/15 to-amber-500/5" onClick={() => {}} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-muted-foreground">مقارنة صافي الربح بين الفروع</h3>
            <ArrowUpRight size={16} className="text-muted-foreground" />
          </div>
          <BarChart data={netProfit} height={240} />
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-muted-foreground">نسبة توزيع العملاء على الفروع</h3>
            <ArrowUpRight size={16} className="text-muted-foreground" />
          </div>
          <DonutChart data={clients} size={260} />
        </div>
      </div>

      {/* Branch Detail Blocks (full-width cards) */}
      <div className="flex flex-col gap-4">
        {kpis.map((r) => {
          const p = profiles.find((x) => x.branch === r.branch);
          const aov = avgOrder[r.branch as keyof typeof avgOrder] || 0;
          const change = monthlyChange[r.branch as keyof typeof monthlyChange] || 0;
          return (
            <div key={r.branch} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <div className="text-lg font-semibold">{r.branch}</div>
                  <div className="text-xs text-muted-foreground">
                    {p?.openingHours} • تأسس: {p?.establishedAt}
                  </div>
                </div>
                <div className="ms-auto flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${r.netProfitPct >= 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>{r.performance}</span>
                  <Link href={`/branches/${encodeURIComponent(r.branch)}`} className="p-1.5 rounded-md border border-sky-400/40 text-sky-600 hover:bg-sky-500/10 text-xs inline-flex items-center gap-1">
                    <Eye size={14} /> للتفاصيل
                  </Link>
                  <button onClick={() => setEditing(r.branch)} className="p-1.5 rounded-md border border-emerald-400/40 text-emerald-600 hover:bg-emerald-500/10 text-xs inline-flex items-center gap-1">
                    <Pencil size={14} /> لتعديل
                  </button>
                  <button onClick={() => window.confirm(`هل تريد حذف فرع ${r.branch}؟`)} className="p-1.5 rounded-md border border-rose-400/40 text-rose-600 hover:bg-rose-500/10 text-xs inline-flex items-center gap-1">
                    <Trash2 size={14} /> للحذف
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-2 text-xs text-muted-foreground">
                <div className="inline-flex items-center gap-1.5 min-w-0">
                  <Mail size={12} />
                  <span className="truncate" title={p?.email}>{p?.email || "-"}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 min-w-0">
                  <MapPin size={12} />
                  <span className="truncate" title={p?.address}>{p?.address || "-"}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 min-w-0">
                  <Phone size={12} />
                  <span className="truncate" title={p?.phone}>{p?.phone || "-"}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 min-w-0">
                  <User size={12} />
                  <span className="truncate" title={p?.manager}>{p?.manager || "-"}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 min-w-0">
                  <Calendar size={12} />
                  <span className="truncate" title={p?.establishedAt}>{p?.establishedAt || "-"}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
                <SoftStat title="متوسط قيمة الطلب" value={formatCurrency(aov)} color="#0ea5e9" bg="#eaf7ff" />
                <SoftStat title="عدد الموظفين" value={`${p?.employeesCount ?? 0}`} color="#0f766e" bg="#ecfdf5" />
                <SoftStat title="نسبة تحقيق المستهدف" value={`${targetRate[r.branch as keyof typeof targetRate] || 0}%`} color="#f59e0b" bg="#fff7ed" />
                <SoftStat title="قيمة المخزون" value={formatCurrency(r.inventoryValue)} color="#8b5cf6" bg="#f4f0ff" />
              </div>
              <div className="flex items-center justify-between mt-3 text-sm">
                <div className={change >= 0 ? "text-emerald-600" : "text-rose-600"}>
                  التغير الشهري: {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(1)}%
                </div>
                <div className="text-muted-foreground">عدد العملاء: {r.clientsCount}</div>
              </div>
            </div>
          );
        })}
      </div>

      {showNewModal && (
        <BranchModal 
          title="إضافة فرع جديد" 
          onClose={() => setShowNewModal(false)} 
          onSubmit={(d) => { 
            setShowNewModal(false); 
            alert(`تم إضافة الفرع "${d.name}" بنجاح!\n\nالمعلومات المحفوظة:\n- المدير: ${d.manager}\n- البريد: ${d.email}\n- الهاتف: ${d.phone || 'غير محدد'}\n- العنوان: ${d.address || 'غير محدد'}\n- نوع الفرع: ${d.branchType || 'غير محدد'}`); 
          }} 
        />
      )}
      {editing && (
        <BranchModal 
          title={`تعديل فرع: ${editing}`} 
          initial={{ 
            name: editing, 
            manager: "مدير الفرع الحالي",
            email: `${editing.toLowerCase()}@aldqqa.sa`,
            phone: "+966 11 123 4567",
            address: `طريق الملك فهد، ${editing}`,
            openingHours: "9:00 ص - 6:00 م",
            establishedAt: "2020-01-01",
            employeesCount: "25",
            branchType: "رئيسي",
            services: "مبيعات، خدمة عملاء، صيانة",
            targetRevenue: "500000",
            licenseNumber: "1234567890",
            taxNumber: "300123456789003"
          }} 
          onClose={() => setEditing(null)} 
          onSubmit={(d) => { 
            setEditing(null); 
            alert(`تم تحديث بيانات الفرع "${d.name}" بنجاح!\n\nالتحديثات المحفوظة:\n- المدير: ${d.manager}\n- البريد: ${d.email}\n- الهاتف: ${d.phone || 'غير محدد'}\n- العنوان: ${d.address || 'غير محدد'}\n- الهدف المالي: ${d.targetRevenue ? formatCurrency(Number(d.targetRevenue)) : 'غير محدد'}`); 
          }} 
        />
      )}
    </div>
  );
}

function MetricCard({ title, value, trend, negative }: { title: string; value: string; trend: number; negative?: boolean }) {
  const isUp = (!negative && trend >= 0) || (negative && trend < 0);
  const color = isUp ? "text-emerald-500" : "text-rose-500";
  const bg = isUp ? "bg-emerald-500/10" : "bg-rose-500/10";
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-sm text-muted-foreground mb-1">{title}</div>
      <div className="text-xl font-bold">{value}</div>
      <div className={`mt-2 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded ${bg} ${color}`}>
        {isUp ? "▲" : "▼"} {Math.abs(trend).toFixed(1)}%
      </div>
    </div>
  );
}

function MetricCard2({ title, value, accent, onClick }: { title: string; value: string; accent: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`text-right rounded-xl border border-border bg-card p-4 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md bg-gradient-to-br ${accent}`}>
      <div className="text-xs text-muted-foreground mb-1">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </button>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-start px-3 py-2 font-semibold border-b border-border text-muted-foreground">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2">{children}</td>;
}

function ratingColor(rating: string) {
  switch (rating) {
    case "ممتاز":
      return "border-emerald-500 text-emerald-600 bg-emerald-500/10";
    case "جيد":
      return "border-sky-500 text-sky-600 bg-sky-500/10";
    case "متوسط":
      return "border-amber-500 text-amber-600 bg-amber-500/10";
    default:
      return "border-rose-500 text-rose-600 bg-rose-500/10";
  }
}

function BarChart({ data, height = 220 }: { data: { name: string; value: number }[]; height?: number }) {
  const max = Math.max(1, ...data.map((d) => Math.abs(d.value)));
  const barWidth = 42;
  const gap = 24;
  const totalBarsWidth = data.length * (barWidth + gap) - gap;
  const width = 500; // fixed width
  const startX = (width - totalBarsWidth) / 2; // center the bars
  // Professional muted palette (blue/teal/indigo/gold)
  const colors = ["#3b82f6", "#06b6d4", "#10b981", "#6366f1"]; 
  return (
    <div className="flex justify-center">
      <svg width={width} height={height} className="block">
        {data.map((d, i) => {
          const h = Math.round((Math.abs(d.value) / max) * (height - 54));
          const x = startX + i * (barWidth + gap);
          const y = height - h - 28;
          const base = colors[i % colors.length];
          return (
            <g key={d.name}>
              <defs>
                <linearGradient id={`bar-${i}`} x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor={base} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={base} stopOpacity="0.7" />
                </linearGradient>
              </defs>
              <rect x={x} y={y} width={barWidth} height={h} rx={6} fill={`url(#bar-${i})`} />
              <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" fontSize="11" fill="#374151">
                {formatCurrency(d.value)}
              </text>
              <text x={x + barWidth / 2} y={height - 8} textAnchor="middle" fontSize="12" fill="currentColor">
                {d.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function DonutChart({ data, size = 220 }: { data: { name: string; value: number }[]; size?: number }) {
  const total = data.reduce((a, b) => a + b.value, 0) || 1;
  const radius = size / 2;
  const stroke = 24;
  const inner = radius - stroke;
  const circumference = 2 * Math.PI * inner;
  // Professional muted palette for donut
  const colors = ["#60a5fa", "#34d399", "#f59e0b", "#a78bfa"]; 
  let offset = 0;
  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
        <circle cx={radius} cy={radius} r={inner} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
        {data.map((d, i) => {
          const frac = d.value / total;
          const dash = circumference * frac;
          const dashArray = `${dash} ${circumference - dash}`;
          const dashOffset = circumference * (1 - offset);
          offset += frac;
          return (
            <circle
              key={d.name}
              cx={radius}
              cy={radius}
              r={inner}
              fill="none"
              stroke={colors[i % colors.length]}
              strokeWidth={stroke}
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${radius} ${radius})`}
            />
          );
        })}
        <text x={radius} y={radius - 6} textAnchor="middle" dominantBaseline="central" fontSize="12" fill="currentColor">العملاء</text>
        <text x={radius} y={radius + 12} textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#6b7280">{total}</text>
      </svg>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
        {data.map((it, i) => (
          <div key={it.name} className="inline-flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded" style={{ background: colors[i % colors.length] }} />
            <span className="text-muted-foreground">{it.name}</span>
            <span className="font-semibold">{((it.value / Math.max(1, total)) * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// old Legend helpers removed in favor of clear HTML legend

function SoftCard({ title, value, color, bg }: { title: string; value: string; color: string; bg: string }) {
  return (
    <div className="rounded-xl p-4" style={{ background: bg, border: `1px solid ${tint(bg, -8)}` }}>
      <div className="text-sm" style={{ color: shade(color, -20) }}>{title}</div>
      <div className="text-xl font-bold mt-1" style={{ color }}>{value}</div>
    </div>
  );
}

function SoftStat({ title, value, color, bg }: { title: string; value: string; color: string; bg: string }) {
  return (
    <div className="rounded-lg p-3" style={{ background: bg, border: `1px solid ${tint(bg, -8)}` }}>
      <div className="text-xs" style={{ color: shade(color, -20) }}>{title}</div>
      <div className="text-sm font-semibold mt-1" style={{ color }}>{value}</div>
    </div>
  );
}

function ratingBg(perf: string) {
  switch (perf) {
    case "ممتاز":
      return "#ecfdf5";
    case "جيد":
      return "#eaf7ff";
    case "متوسط":
      return "#fff7ed";
    default:
      return "#fff1f2";
  }
}
function ratingFg(perf: string) {
  switch (perf) {
    case "ممتاز":
      return "#047857";
    case "جيد":
      return "#0a5db3";
    case "متوسط":
      return "#b45309";
    default:
      return "#b91c1c";
  }
}
function ratingBorder(perf: string) {
  switch (perf) {
    case "ممتاز":
      return "#bbf7d0";
    case "جيد":
      return "#cfe6ff";
    case "متوسط":
      return "#ffedd5";
    default:
      return "#ffe4e6";
  }
}

function tint(hex: string, amount: number) {
  // hex like #eaf7ff
  const { r, g, b } = hexToRgb(hex);
  const adj = (v: number) => Math.max(0, Math.min(255, v + (amount / 100) * 255));
  return rgbToHex(adj(r), adj(g), adj(b));
}
function shade(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  const adj = (v: number) => Math.max(0, Math.min(255, v + (amount / 100) * 255));
  return rgbToHex(adj(r), adj(g), adj(b));
}
function hexToRgb(hex: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return { r: 234, g: 247, b: 255 };
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}
function rgbToHex(r: number, g: number, b: number) {
  const toHex = (v: number) => Math.round(v).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

type BranchModalData = { 
  name?: string; 
  manager?: string; 
  email?: string; 
  phone?: string;
  address?: string;
  openingHours?: string; 
  establishedAt?: string;
  employeesCount?: string;
  branchType?: string;
  services?: string;
  notes?: string;
  targetRevenue?: string;
  operatingHours?: string;
  contactPerson?: string;
  contactPhone?: string;
  licenseNumber?: string;
  taxNumber?: string;
  bankAccount?: string;
  insuranceProvider?: string;
  maintenanceContact?: string;
  emergencyContact?: string;
};

function BranchModal({ title, onClose, onSubmit, initial }: { title: string; onClose: () => void; onSubmit: (data: BranchModalData) => void; initial?: BranchModalData }) {
  const [data, setData] = useState<BranchModalData>(initial || {});
  const [activeTab, setActiveTab] = useState<'basic' | 'contact' | 'financial' | 'operational'>('basic');
  
  const tabs: { id: 'basic' | 'contact' | 'financial' | 'operational'; label: string; icon: string }[] = [
    { id: 'basic', label: 'المعلومات الأساسية', icon: '📋' },
    { id: 'contact', label: 'معلومات الاتصال', icon: '📞' },
    { id: 'financial', label: 'المعلومات المالية', icon: '💰' },
    { id: 'operational', label: 'التشغيلية', icon: '⚙️' }
  ];

  const handleSubmit = () => {
    // Basic validation
    if (!data.name || !data.manager || !data.email) {
      alert('يرجى ملء الحقول المطلوبة: اسم الفرع، مدير الفرع، البريد الإلكتروني');
      return;
    }
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0" style={{ background: "rgba(2,6,23,0.45)" }} onClick={onClose} />
      <div className="relative w-[800px] max-w-[95vw] max-h-[90vh] rounded-xl p-6 overflow-auto" style={{ background: "#ffffff", border: "1px solid #e9eef5", boxShadow: "0 8px 24px rgba(16,24,40,0.12)" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-semibold" style={{ color: "#0b1324" }}>{title}</div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100" style={{ color: "#6b7280" }}>✕</button>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-lg" style={{ background: "#f8fafc" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition ${
                activeTab === tab.id 
                  ? "bg-white shadow-sm" 
                  : "hover:bg-white/50"
              }`}
              style={{ color: activeTab === tab.id ? "#0b1324" : "#6b7280" }}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === 'basic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RichInput label="اسم الفرع *" value={data.name || ""} onChange={(v) => setData({ ...data, name: v })} placeholder="مثال: فرع الرياض الرئيسي" required />
              <RichInput label="مدير الفرع *" value={data.manager || ""} onChange={(v) => setData({ ...data, manager: v })} placeholder="مثال: أحمد محمد العتيبي" required />
              <RichInput label="البريد الإلكتروني *" value={data.email || ""} onChange={(v) => setData({ ...data, email: v })} placeholder="riyadh@aldqqa.sa" type="email" required />
              <RichInput label="رقم الهاتف" value={data.phone || ""} onChange={(v) => setData({ ...data, phone: v })} placeholder="+966 11 123 4567" />
              <RichInput label="العنوان الكامل" value={data.address || ""} onChange={(v) => setData({ ...data, address: v })} placeholder="طريق الملك فهد، حي العليا، الرياض" />
              <RichInput label="تاريخ التأسيس" value={data.establishedAt || ""} onChange={(v) => setData({ ...data, establishedAt: v })} type="date" />
              <RichInput label="عدد الموظفين" value={data.employeesCount || ""} onChange={(v) => setData({ ...data, employeesCount: v })} placeholder="25" type="number" />
              <RichSelect label="نوع الفرع" value={data.branchType || ""} onChange={(v) => setData({ ...data, branchType: v })} options={[
                { value: "رئيسي", label: "فرع رئيسي" },
                { value: "فرعي", label: "فرع فرعي" },
                { value: "مخزن", label: "مخزن" },
                { value: "مكتب", label: "مكتب" }
              ]} />
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RichInput label="ساعات العمل" value={data.openingHours || ""} onChange={(v) => setData({ ...data, openingHours: v })} placeholder="9:00 ص - 6:00 م" />
              <RichInput label="ساعات التشغيل الكاملة" value={data.operatingHours || ""} onChange={(v) => setData({ ...data, operatingHours: v })} placeholder="24/7 أو 8:00 ص - 10:00 م" />
              <RichInput label="شخص الاتصال" value={data.contactPerson || ""} onChange={(v) => setData({ ...data, contactPerson: v })} placeholder="سارة أحمد" />
              <RichInput label="هاتف الاتصال" value={data.contactPhone || ""} onChange={(v) => setData({ ...data, contactPhone: v })} placeholder="+966 50 123 4567" />
              <RichInput label="جهة الصيانة" value={data.maintenanceContact || ""} onChange={(v) => setData({ ...data, maintenanceContact: v })} placeholder="شركة الصيانة المتخصصة" />
              <RichInput label="جهة الطوارئ" value={data.emergencyContact || ""} onChange={(v) => setData({ ...data, emergencyContact: v })} placeholder="+966 50 987 6543" />
              <RichTextArea label="الخدمات المقدمة" value={data.services || ""} onChange={(v) => setData({ ...data, services: v })} placeholder="مبيعات، خدمة عملاء، صيانة، استشارات..." />
            </div>
          )}

          {activeTab === 'financial' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RichInput label="الهدف المالي الشهري" value={data.targetRevenue || ""} onChange={(v) => setData({ ...data, targetRevenue: v })} placeholder="500000" type="number" />
              <RichInput label="رقم الترخيص" value={data.licenseNumber || ""} onChange={(v) => setData({ ...data, licenseNumber: v })} placeholder="1234567890" />
              <RichInput label="الرقم الضريبي" value={data.taxNumber || ""} onChange={(v) => setData({ ...data, taxNumber: v })} placeholder="300123456789003" />
              <RichInput label="رقم الحساب البنكي" value={data.bankAccount || ""} onChange={(v) => setData({ ...data, bankAccount: v })} placeholder="SA1234567890123456789012" />
              <RichInput label="مزود التأمين" value={data.insuranceProvider || ""} onChange={(v) => setData({ ...data, insuranceProvider: v })} placeholder="شركة التأمين السعودية" />
            </div>
          )}

          {activeTab === 'operational' && (
            <div className="space-y-4">
              <RichTextArea label="ملاحظات إضافية" value={data.notes || ""} onChange={(v) => setData({ ...data, notes: v })} placeholder="أي معلومات إضافية مهمة حول الفرع..." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RichSelect label="حالة الفرع" value={data.branchType || ""} onChange={(v) => setData({ ...data, branchType: v })} options={[
                  { value: "نشط", label: "نشط" },
                  { value: "معلق", label: "معلق مؤقتاً" },
                  { value: "مغلق", label: "مغلق" },
                  { value: "تطوير", label: "قيد التطوير" }
                ]} />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            * الحقول المطلوبة
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-md border border-border hover:bg-muted transition">
              إلغاء
            </button>
            <button onClick={handleSubmit} className="px-4 py-2 rounded-md text-white font-medium" style={{ background: "#0a5db3" }}>
              حفظ التغييرات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SoftInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs" style={{ color: "#6b7280" }}>{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="px-3 py-2 rounded-md outline-none" style={{ background: "#f8fafc", border: "1px solid #e5e7eb", color: "#0b1324" }} />
    </label>
  );
}

function RichInput({ label, value, onChange, placeholder, type = "text", required = false }: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void; 
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium" style={{ color: "#374151" }}>
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </span>
      <input 
        type={type}
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder}
        className="px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
        style={{ background: "#ffffff" }}
        required={required}
      />
    </label>
  );
}

function RichSelect({ label, value, onChange, options }: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void; 
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium" style={{ color: "#374151" }}>{label}</span>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
        style={{ background: "#ffffff" }}
      >
        <option value="">اختر...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}

function RichTextArea({ label, value, onChange, placeholder }: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void; 
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium" style={{ color: "#374151" }}>{label}</span>
      <textarea 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder}
        rows={3}
        className="px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition resize-none"
        style={{ background: "#ffffff" }}
      />
    </label>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <div className="text-[11px] text-muted-foreground mb-0.5">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="text-[11px] text-muted-foreground mb-0.5">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}


