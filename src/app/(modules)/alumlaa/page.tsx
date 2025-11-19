"use client";

import { useEffect, useMemo, useState } from "react";
import { customers, type Customer } from "@/lib/mockData";
import { formatNumber, formatSAR } from "@/lib/format";
import { Users, Star, AlertTriangle, CalendarPlus, Phone, Receipt, HandCoins, Trophy, PieChart, Wallet, Eye, Pencil, Trash2, Printer } from "lucide-react";

function classificationTag(c: Customer["classification"]) {
  switch (c) {
    case "VIP":
      return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
    case "High Value":
      return "bg-sky-500/15 text-sky-500 border-sky-500/30";
    case "Risk":
      return "bg-rose-500/15 text-rose-500 border-rose-500/30";
  }
}

export default function Page() {
  const [list, setList] = useState<Customer[]>(customers);
  const [city, setCity] = useState<string | "">("");
  const [segment, setSegment] = useState<string | "">("");
  const [query, setQuery] = useState("");
  const [classification, setClassification] = useState<string | "">("");
  const [view, setView] = useState<"cards" | "table">("cards");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    phone: "",
    email: "",
    classification: "",
    segment: "",
    credit: "",
  });
  const [editTarget, setEditTarget] = useState<Customer | null>(null);

  const filtered = useMemo(() => {
    return list.filter((c) => {
      const matchesQuery = [c.name].some((v) => v.includes(query));
      const matchesSeg = segment ? c.segment === segment : true;
      const matchesCity = city ? c.city === city : true;
      const matchesClass = classification ? c.classification === classification : true;
      let matchesRange = true;
      if (fromDate || toDate) {
        const d = new Date(c.lastOrder);
        const start = fromDate ? new Date(fromDate) : null;
        const end = toDate ? new Date(toDate) : null;
        if (start && d < start) matchesRange = false;
        if (end) {
          const endInclusive = new Date(end.getFullYear(), end.getMonth(), end.getDate() + 1);
          if (d >= endInclusive) matchesRange = false;
        }
      }
      return matchesQuery && matchesSeg && matchesCity && matchesClass && matchesRange;
    });
  }, [list, query, segment, city, classification, fromDate, toDate]);

  useEffect(() => {
    setPage(1);
  }, [query, segment, city, classification, fromDate, toDate]);

  const metrics = useMemo(() => {
    const list = filtered;
    const total = list.length;
    const vip = list.filter((c) => c.classification === "VIP").length;
    const highValue = list.filter((c) => c.classification === "High Value").length;
    const riskCount = list.filter((c) => c.classification === "Risk").length;
    const totalOverdue = list.reduce((sum, c) => sum + c.overdue, 0);
    const now = new Date();
    const last30Count = list.filter((c) => {
      const d = new Date(c.lastOrder);
      return now.getTime() - d.getTime() <= 30 * 24 * 60 * 60 * 1000;
    }).length;
    const highestOrder = list.reduce((max, c) => Math.max(max, c.last6moTotal), 0);
    const b2b = list.filter((c) => c.segment === "B2B").length;
    const b2c = list.filter((c) => c.segment === "B2C").length;
    const b2bPct = total ? Math.round((b2b / total) * 100) : 0;
    const b2cPct = total ? 100 - b2bPct : 0;
    const totalCredit = list.reduce((sum, c) => sum + c.credit, 0);
    const orderTotal = list.reduce((sum, c) => sum + c.last6moTotal, 0);
    return { total, vip, highValue, riskCount, totalOverdue, last30Count, highestOrder, b2bPct, b2cPct, totalCredit, orderTotal };
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paged = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page]);

  function LargePie({ b2b, b2c }: { b2b: number; b2c: number }) {
    // Compact pie to fit same card size as neighbors
    const size = 72;
    const stroke = 10;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const b2bLen = (b2b / 100) * c;
    const b2cLen = c - b2bLen;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} strokeWidth={stroke} className="fill-none stroke-muted/40" />
        <circle
          cx={size/2}
          cy={size/2}
          r={r}
          strokeWidth={stroke}
          className="fill-none stroke-indigo-500"
          strokeDasharray={`${b2bLen} ${c - b2bLen}`}
          strokeDashoffset={0}
          strokeLinecap="butt"
        />
        <circle
          cx={size/2}
          cy={size/2}
          r={r}
          strokeWidth={stroke}
          className="fill-none stroke-sky-400"
          strokeDasharray={`${b2cLen} ${c - b2cLen}`}
          strokeDashoffset={-b2bLen}
          strokeLinecap="butt"
        />
      </svg>
    );
  }

  function availableCredit(c: Customer) {
    return Math.max(0, c.credit - c.overdue);
  }

  function contactHistory(c: Customer) {
    // Derive deterministic recent events based on lastOrder date
    const base = new Date(c.lastOrder);
    const events = [
      { type: "زيارة", date: new Date(base.getTime() - 7 * 86400000) },
      { type: "اتصال", date: new Date(base.getTime() - 14 * 86400000) },
      { type: "متابعة", date: new Date(base.getTime() - 21 * 86400000) },
    ];
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    return events.map(e => `${e.type}: ${fmt(e.date)}`);
  }

  function nextFollowUp(c: Customer) {
    const base = new Date(c.lastOrder);
    const next = new Date(base.getTime() + 14 * 86400000);
    return next.toISOString().slice(0, 10);
  }

  function startEdit(c: Customer) {
    setEditTarget(c);
    setForm({
      name: c.name,
      city: c.city,
      address: "",
      phone: c.contactPhone,
      email: "",
      classification: c.classification,
      segment: c.segment,
      credit: String(c.credit),
    });
    setShowCreate(true);
  }

  return (
    <div className="space-y-4">
      {/* Top Metrics - redesigned with hover/3D effect */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="p-2 rounded-lg bg-primary/15 text-primary border border-primary/20">
            <Users size={18} />
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">إجمالي عدد العملاء</div>
            <div className="text-xl font-semibold">{formatNumber(metrics.total)}</div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="p-2 rounded-lg bg-violet-500/15 text-violet-500 border border-violet-500/20">
            <Receipt size={18} />
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">إجمالي قيمة الطلبات</div>
            <div className="text-xl font-semibold">{formatSAR(metrics.orderTotal)}</div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="p-2 rounded-lg bg-rose-500/15 text-rose-500 border border-rose-500/20">
            <HandCoins size={18} />
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">إجمالي الرصيد المتأخر</div>
            <div className="text-xl font-semibold">{formatSAR(metrics.totalOverdue)}</div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="p-2 rounded-lg bg-sky-500/15 text-sky-500 border border-sky-500/20">
            <CalendarPlus size={18} />
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">عملاء جدد آخر 30 يوم</div>
            <div className="text-xl font-semibold">{formatNumber(metrics.last30Count)}</div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="p-2 rounded-lg bg-amber-500/15 text-amber-500 border border-amber-500/20">
            <Trophy size={18} />
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">قيمة أعلى طلبية (6 أشهر)</div>
            <div className="text-xl font-semibold">{formatSAR(metrics.highestOrder)}</div>
          </div>
        </div>
        {/* Consolidated classification card (VIP, High Value & Risk) */}
        <div className="rounded-xl border border-border bg-card p-4 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500/15 to-rose-500/15 text-emerald-500 border border-emerald-500/20">
              <Star size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">تصنيف العملاء</div>
              <div className="text-xs text-muted-foreground">VIP & High Value & Risk</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
              <div className="text-xs text-emerald-600 dark:text-emerald-400">VIP</div>
              <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">{formatNumber(metrics.vip)}</div>
            </div>
            <div className="rounded-lg bg-sky-500/10 border border-sky-500/20 p-3">
              <div className="text-xs text-sky-600 dark:text-sky-400">High Value</div>
              <div className="text-lg font-semibold text-sky-600 dark:text-sky-400">{formatNumber(metrics.highValue)}</div>
            </div>
            <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3">
              <div className="text-xs text-rose-600 dark:text-rose-400">High Risk</div>
              <div className="text-lg font-semibold text-rose-600 dark:text-rose-400">{formatNumber(metrics.riskCount)}</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/15 text-indigo-500 border border-indigo-500/20">
              <PieChart size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">نسبة B2B إلى B2C</div>
              <div className="text-xl font-semibold">{formatNumber(metrics.b2bPct)}% / {formatNumber(metrics.b2cPct)}%</div>
              <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500"></span> B2B</span>
                <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-full bg-sky-400"></span> B2C</span>
              </div>
            </div>
          </div>
          <div className="shrink-0">
            <LargePie b2b={metrics.b2bPct} b2c={metrics.b2cPct} />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="p-2 rounded-lg bg-teal-500/15 text-teal-500 border border-teal-500/20">
            <Wallet size={18} />
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">إجمالي حدود الائتمان</div>
            <div className="text-xl font-semibold">{formatSAR(metrics.totalCredit)}</div>
          </div>
        </div>
      </div>

      {/* Filters + Actions */}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
        <h1 className="text-xl font-semibold">العملاء</h1>
        <div className="flex flex-wrap gap-2">
          <input
            className="px-3 py-2 rounded-md border border-border bg-card text-sm w-full sm:w-72 md:w-96 lg:w-[32rem]"
            placeholder="بحث بالاسم"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="px-3 py-2 rounded-md border border-border bg-card text-sm"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">كل المدن</option>
            <option value="الرياض">الرياض</option>
            <option value="جدة">جدة</option>
            <option value="الدمام">الدمام</option>
            <option value="مكة">مكة</option>
          </select>
          <select
            className="px-3 py-2 rounded-md border border-border bg-card text-sm"
            value={segment}
            onChange={(e) => setSegment(e.target.value)}
          >
            <option value="">كل الشرائح</option>
            <option value="B2B">B2B</option>
            <option value="B2C">B2C</option>
          </select>
          <select
            className="px-3 py-2 rounded-md border border-border bg-card text-sm"
            value={classification}
            onChange={(e) => setClassification(e.target.value)}
          >
            <option value="">كل التصنيفات</option>
            <option value="VIP">VIP</option>
            <option value="High Value">High Value</option>
            <option value="Risk">Risk</option>
          </select>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">من</label>
            <input
              type="date"
              className="px-3 py-2 rounded-md border border-border bg-card text-sm"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <label className="text-xs text-muted-foreground">إلى</label>
            <input
              type="date"
              className="px-3 py-2 rounded-md border border-border bg-card text-sm"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <button
            className="px-3 py-2 rounded-md border border-primary bg-primary text-primary-foreground text-sm"
            onClick={() => setShowCreate(true)}
          >
            إضافة عميل جديد
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setView("cards")}
          className={`px-3 py-1.5 rounded-md border text-sm ${
            view === "cards" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-muted"
          }`}
        >
          عرض البطاقات
        </button>
        <button
          onClick={() => setView("table")}
          className={`px-3 py-1.5 rounded-md border text-sm ${
            view === "table" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-muted"
          }`}
        >
          عرض الجدول
        </button>
      </div>

      {view === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.city} • {c.segment}</div>
                </div>
                <span className={`px-2.5 py-1 text-[11px] rounded-md border shadow-sm ${classificationTag(c.classification)}`}>
                  {c.classification}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-violet-500/25 bg-violet-500/10 p-3">
                  <div className="flex items-center gap-2 text-xs text-violet-600 dark:text-violet-300"><Receipt size={14} /> إجمالي الطلبات (6 أشهر)</div>
                  <div className="mt-1 font-semibold text-violet-700 dark:text-violet-300">{formatSAR(c.last6moTotal)}</div>
                </div>
                <div className="rounded-lg border border-rose-500/25 bg-rose-500/10 p-3">
                  <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-300"><HandCoins size={14} /> رصيد التحصيل المتأخر</div>
                  <div className="mt-1 font-semibold text-rose-700 dark:text-rose-300">{formatSAR(c.overdue)}</div>
                </div>
                <div className="rounded-lg border border-sky-500/25 bg-sky-500/10 p-3 col-span-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-sky-700 dark:text-sky-300">
                      <Phone size={14} /> مسؤول المشتريات
                    </div>
                    <div className="text-[11px] px-2 py-0.5 rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300">زيارات 30 يوم: {c.visitCount30d}</div>
                  </div>
                  <div className="mt-1 font-semibold text-sky-800 dark:text-sky-200">{c.contactName} • {c.contactPhone}</div>
                  <div className="mt-2 text-[11px] text-sky-700/90 dark:text-sky-300/90">آخر طلب: {c.lastOrder}</div>
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  className="px-3 py-1.5 rounded-md border border-border hover:bg-muted text-xs"
                  onClick={() => { setSelected(c); setShowModal(true); }}
                >
                  عرض التفاصيل
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="overflow-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="p-3 text-right">الاسم</th>
                  <th className="p-3 text-right">المدينة</th>
                  <th className="p-3 text-right">الشريحة</th>
                  <th className="p-3 text-right">التصنيف</th>
                  <th className="p-3 text-right">إجمالي الطلبات (6 أشهر)</th>
                  <th className="p-3 text-right">الرصيد المتأخر</th>
                  <th className="p-3 text-right">آخر طلب</th>
                  <th className="p-3 text-right">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((c, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-3">{c.name}</td>
                    <td className="p-3">{c.city}</td>
                    <td className="p-3">{c.segment}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-[11px] rounded-md border ${classificationTag(c.classification)}`}>
                        {c.classification}
                      </span>
                    </td>
                    <td className="p-3">{formatSAR(c.last6moTotal)}</td>
                    <td className="p-3">{formatSAR(c.overdue)}</td>
                    <td className="p-3">{c.lastOrder}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          className="p-1.5 rounded-md border border-sky-400/40 text-sky-600 dark:text-sky-300 hover:bg-sky-500/10"
                          aria-label="عرض سريع"
                          onClick={() => { setSelected(c); setShowModal(true); }}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="p-1.5 rounded-md border border-violet-400/40 text-violet-600 dark:text-violet-300 hover:bg-violet-500/10"
                          aria-label="تعديل"
                          onClick={() => startEdit(c)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="p-1.5 rounded-md border border-rose-400/40 text-rose-600 dark:text-rose-300 hover:bg-rose-500/10"
                          aria-label="حذف"
                          onClick={() => {
                            if (typeof window !== "undefined" && window.confirm && !window.confirm(`حذف العميل ${c.name}؟`)) return;
                            setList(prev => prev.filter(item => item !== c));
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          className="p-1.5 rounded-md border border-emerald-400/40 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/10"
                          aria-label="طباعة"
                          onClick={() => window.print?.()}
                        >
                          <Printer size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 text-sm">
            <div className="text-xs text-muted-foreground">صفحة {formatNumber(page)} من {formatNumber(totalPages)} • إجمالي السجلات: {formatNumber(filtered.length)}</div>
            <div className="flex items-center gap-1">
              <button
                className="px-2 py-1 rounded-md border border-border bg-card hover:bg-muted disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                السابق
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const p = idx + 1;
                return (
                  <button
                    key={p}
                    className={`px-2 py-1 rounded-md border text-xs ${p === page ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-muted"}`}
                    onClick={() => setPage(p)}
                  >
                    {formatNumber(p)}
                  </button>
                );
              })}
              <button
                className="px-2 py-1 rounded-md border border-border bg-card hover:bg-muted disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                التالي
              </button>
            </div>
          </div>
        </>
      )}

      {showModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-2xl rounded-xl border border-border bg-card p-4 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-semibold">{selected.name}</div>
              <button className="px-2 py-1 rounded-md border border-border hover:bg-muted text-xs" onClick={() => setShowModal(false)}>إغلاق</button>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{selected.name}</div>
                  <div className="text-xs text-muted-foreground">{selected.city} • {selected.segment}</div>
                </div>
                <span className={`px-2.5 py-1 text-[11px] rounded-md border shadow-sm ${classificationTag(selected.classification)}`}>
                  {selected.classification}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-violet-500/25 bg-violet-500/10 p-3">
                  <div className="flex items-center gap-2 text-xs text-violet-600 dark:text-violet-300"><Receipt size={14} /> إجمالي الطلبات (6 أشهر)</div>
                  <div className="mt-1 font-semibold text-violet-700 dark:text-violet-300">{formatSAR(selected.last6moTotal)}</div>
                </div>
                <div className="rounded-lg border border-rose-500/25 bg-rose-500/10 p-3">
                  <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-300"><HandCoins size={14} /> رصيد التحصيل المتأخر</div>
                  <div className="mt-1 font-semibold text-rose-700 dark:text-rose-300">{formatSAR(selected.overdue)}</div>
                </div>
                <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-3">
                  <div className="text-xs text-emerald-700 dark:text-emerald-300">حد الائتمان • المتاح</div>
                  <div className="mt-1 font-semibold text-emerald-800 dark:text-emerald-200">{formatSAR(selected.credit)} • {formatSAR(availableCredit(selected))}</div>
                </div>
                <div className="rounded-lg border border-sky-500/25 bg-sky-500/10 p-3 col-span-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-sky-700 dark:text-sky-300">
                      <Phone size={14} /> مسؤول المشتريات
                    </div>
                    <div className="text-[11px] px-2 py-0.5 rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300">زيارات 30 يوم: {selected.visitCount30d}</div>
                  </div>
                  <div className="mt-1 font-semibold text-sky-800 dark:text-sky-200">{selected.contactName} • {selected.contactPhone}</div>
                  <div className="mt-2 text-[11px] text-sky-700/90 dark:text-sky-300/90">آخر طلب: {selected.lastOrder}</div>
                </div>
                <div className="rounded-lg border border-border p-3 col-span-2">
                  <div className="text-xs text-muted-foreground mb-1">سجل التواصل (آخر 3)</div>
                  <ul className="list-disc pr-5 text-xs space-y-1">
                    {contactHistory(selected).map((t, i) => (<li key={i}>{t}</li>))}
                  </ul>
                  <div className="mt-2 text-xs">المتابعة القادمة: <span className="font-medium">{nextFollowUp(selected)}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreate(false)} />
          <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-2xl rounded-xl border border-border bg-card p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-semibold">إضافة عميل جديد</div>
              <button className="px-2 py-1 rounded-md border border-border hover:bg-muted text-xs" onClick={() => setShowCreate(false)}>إلغاء</button>
            </div>
            <form
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm"
              onSubmit={(e) => {
                e.preventDefault();
                console.log(editTarget ? "Edit customer:" : "New customer:", form);
                setShowCreate(false);
                setEditTarget(null);
              }}
            >
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">الاسم</label>
                <input className="px-3 py-2 rounded-md border border-border bg-card" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">المدينة</label>
                <select className="px-3 py-2 rounded-md border border-border bg-card" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required>
                  <option value="">اختر المدينة</option>
                  <option value="الرياض">الرياض</option>
                  <option value="جدة">جدة</option>
                  <option value="الدمام">الدمام</option>
                  <option value="مكة">مكة</option>
                </select>
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-xs text-muted-foreground">العنوان</label>
                <input className="px-3 py-2 rounded-md border border-border bg-card" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">رقم الهاتف</label>
                <input className="px-3 py-2 rounded-md border border-border bg-card" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">البريد الإلكتروني</label>
                <input type="email" className="px-3 py-2 rounded-md border border-border bg-card" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">التصنيف</label>
                <select className="px-3 py-2 rounded-md border border-border bg-card" value={form.classification} onChange={(e) => setForm({ ...form, classification: e.target.value })} required>
                  <option value="">اختر التصنيف</option>
                  <option value="VIP">VIP</option>
                  <option value="High Value">High Value</option>
                  <option value="Risk">Risk</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">الشريحة</label>
                <select className="px-3 py-2 rounded-md border border-border bg-card" value={form.segment} onChange={(e) => setForm({ ...form, segment: e.target.value })} required>
                  <option value="">اختر الشريحة</option>
                  <option value="B2B">B2B</option>
                  <option value="B2C">B2C</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">حد الائتمان</label>
                <input type="number" className="px-3 py-2 rounded-md border border-border bg-card" value={form.credit} onChange={(e) => setForm({ ...form, credit: e.target.value })} />
              </div>

              <div className="sm:col-span-2 flex items-center justify-end gap-2 mt-2">
                <button type="button" className="px-3 py-2 rounded-md border border-border bg-card hover:bg-muted text-sm" onClick={() => setShowCreate(false)}>إلغاء</button>
                <button type="submit" className="px-3 py-2 rounded-md border border-primary bg-primary text-primary-foreground text-sm">إضافة</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice modal was intentionally removed from Clients page */}
    </div>
  );
}


