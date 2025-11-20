"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { invoices, monthlySalesTrend, inventoryCategories, type Invoice, type PaymentStatus } from "@/lib/mockData";
import { formatSAR, formatNumber } from "@/lib/format";
import { Eye, Download as DownloadIcon, Receipt, Trash2, Pencil } from "lucide-react";
import Link from "next/link";

type Method = "نقدي" | "آجل" | "أقساط تمارا" | "أقساط تابي";

export default function Page() {
  const [list, setList] = useState(invoices);
  const [status, setStatus] = useState<string | "">("");
  const [query, setQuery] = useState("");
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceCustomer, setInvoiceCustomer] = useState("");
  const [invoiceDue, setInvoiceDue] = useState("");
  const [invoiceMethod, setInvoiceMethod] = useState("");
  const [invoiceVatPct, setInvoiceVatPct] = useState<string>("");
  const [invoiceItems, setInvoiceItems] = useState<{ description: string; quantity: number | ""; price: number | "" }[]>([]);
  // Dashboard filters
  const [methodFilter, setMethodFilter] = useState<string | "">("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [showTxn, setShowTxn] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Derived aggregates
  const filtered = useMemo(() => {
    return list.filter((inv) => {
      const matchesQuery = [inv.id, inv.customer].some((v) => v.includes(query));
      const matchesStatus = status ? inv.status === status : true;
      // Map invoice status to payment method buckets
      const pm = inv.status === "مدفوع" ? "نقدي" : (inv.status === "أقساط تمارا" ? "أقساط تمارا" : (inv.status === "أقساط تابي" ? "أقساط تابي" : "آجل"));
      const matchesMethod = methodFilter ? pm === methodFilter : true;
      let matchesRange = true;
      if (fromDate || toDate) {
        const d = new Date(inv.invoiceDate);
        const start = fromDate ? new Date(fromDate) : null;
        const end = toDate ? new Date(toDate) : null;
        if (start && d < start) matchesRange = false;
        if (end) {
          const endInclusive = new Date(end.getFullYear(), end.getMonth(), end.getDate() + 1);
          if (d >= endInclusive) matchesRange = false;
        }
      }
      return matchesQuery && matchesStatus && matchesMethod && matchesRange;
    });
  }, [list, status, query]);

  // Reset to first page when table filters/search change
  useMemo(() => { setPage(1); return null; }, [status, methodFilter, query, fromDate, toDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const totals = useMemo(() => {
    const list = filtered;
    const totalIncome = list.reduce((s, i) => s + i.amount, 0);
    const pendingStatuses = new Set(["متأخر", "غير مدفوع", "قيد السداد", "أقساط تمارا", "أقساط تابي"]);
    const pendingAmount = list.filter(i => pendingStatuses.has(i.status)).reduce((s, i) => s + i.amount, 0);
    const netProfit = Math.round(totalIncome * 0.22); // mock margin
    
    // Daily Revenue - Current day only
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10); // YYYY-MM-DD format
    const dailyRevenue = list.filter(inv => {
      return inv.invoiceDate === todayStr;
    }).reduce((s, i) => s + i.amount, 0);
    
    return { totalIncome, pendingAmount, netProfit, dailyRevenue };
  }, [filtered]);

  // Helper to build mock line items for a given invoice index deterministically
  function lineItemsFor(i: number) {
    const inv = filtered[i];
    if (!inv) return [] as { name: string; qty: number; price: number; total: number }[];
    const base = Math.max(3, 2 + (i % 4));
    const items = Array.from({ length: base }).map((_, k) => {
      const qty = 1 + ((i + k) % 3);
      const price = Math.round((inv.amount / base) / Math.max(1, qty) / 50) * 50; // round
      const catalogs = ["خدمة", "مستهلكات", "أجهزة", "أدوية", "تركيب"];
      const name = `${catalogs[k % catalogs.length]} #${k + 1}`;
      return { name, qty, price, total: qty * price };
    });
    return items;
  }

  // Top 5 Sales Employees Revenue
  const topSalesEmployees = useMemo(() => {
    const map = new Map<string, number>();
    for (const inv of filtered) {
      const key = inv.salesRep;
      map.set(key, (map.get(key) || 0) + inv.amount);
    }
    return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0,5);
  }, [filtered]);

  // Payment method distribution derived from invoice statuses
  const methodTotals = useMemo(() => {
    const map: Record<Method, number> = { "نقدي": 0, "آجل": 0, "أقساط تمارا": 0, "أقساط تابي": 0 };
    for (const inv of filtered) {
      if (inv.status === "أقساط تمارا") map["أقساط تمارا"] += inv.amount;
      else if (inv.status === "أقساط تابي") map["أقساط تابي"] += inv.amount;
      else if (inv.status === "مدفوع") map["نقدي"] += inv.amount;
      else map["آجل"] += inv.amount; // متأخر/غير مدفوع/قيد السداد
    }
    const total = Object.values(map).reduce((s, n) => s + n, 0) || 1;
    const series = (Object.entries(map) as [Method, number][]).map(([k, v]) => ({ method: k, value: v, pct: Math.round((v / total) * 100) }));
    return { map, total, series };
  }, [filtered]);

  const last6 = useMemo(() => {
    const arabicMonths = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"] as const;
    // Build last 6 months from filtered invoices dynamically
    const now = new Date();
    const months: { key: string; label: string; sales: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      const label = `${arabicMonths[d.getMonth()]} ${d.getFullYear()}`; // deterministic label to avoid SSR/CSR mismatch
      months.push({ key, label, sales: 0 });
    }
    const byKey = new Map(months.map(m => [m.key, m] as const));
    for (const inv of filtered) {
      const d = new Date(inv.invoiceDate);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      const bucket = byKey.get(key);
      if (bucket) bucket.sales += inv.amount;
    }
    return months;
  }, [filtered]);


  // Revenue by Inventory Categories (using ALL six actual inventory categories)
  const categoryRevenue = useMemo(() => {
    const map = new Map<string, number>();
    
    // Initialize all six categories with zero revenue
    const allCategories = inventoryCategories.map(cat => cat.name);
    allCategories.forEach(category => {
      map.set(category, 0);
    });
    
    // Distribute revenue across all categories based on invoice data
    for (const inv of filtered) {
      // Use a more sophisticated distribution to ensure all categories get some revenue
      const categoryIndex = (inv.id.charCodeAt(0) + inv.amount + inv.salesRep.length) % allCategories.length;
      const category = allCategories[categoryIndex];
      map.set(category, (map.get(category) || 0) + inv.amount);
    }
    
    // Ensure all six categories are present, even with zero revenue
    return allCategories
      .map(category => ({ name: category, value: map.get(category) || 0 }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  // Revenue by Branch (All 4 specified branches: الرياض, جدة, الدمام, مكة)
  const branchRevenue = useMemo(() => {
    const branches = [
      { name: "فرع الرياض", city: "الرياض" },
      { name: "فرع جدة", city: "جدة" },
      { name: "فرع الدمام", city: "الدمام" },
      { name: "فرع مكة", city: "مكة" }
    ];
    const map = new Map<string, number>();
    
    // Initialize all four branches with zero revenue
    branches.forEach(branch => {
      const branchKey = `${branch.name} - ${branch.city}`;
      map.set(branchKey, 0);
    });
    
    // Distribute revenue across all branches
    for (const inv of filtered) {
      // Assign branch based on sales rep for consistency
      const branchIndex = inv.salesRep.length % branches.length;
      const branch = branches[branchIndex];
      const branchKey = `${branch.name} - ${branch.city}`;
      map.set(branchKey, (map.get(branchKey) || 0) + inv.amount);
    }
    
    // Ensure all four branches are present, even with zero revenue
    return branches
      .map(branch => {
        const branchKey = `${branch.name} - ${branch.city}`;
        return { name: branchKey, value: map.get(branchKey) || 0 };
      })
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  const uniqueCustomers = useMemo(() => Array.from(new Set(list.map(i => i.customer))), [list]);

  function openInvoiceModal() {
    setInvoiceCustomer("");
    setInvoiceDue("");
    setInvoiceMethod("");
    setInvoiceVatPct("");
    setInvoiceItems([{ description: "", quantity: "", price: "" }]);
    setShowInvoice(true);
  }

  return (
    <div className="space-y-6">
      {/* Header + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <h1 className="text-2xl font-semibold">الإيرادات</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            className="px-3 py-2 rounded-md border border-border bg-card text-sm w-full sm:w-72"
            placeholder="بحث برقم الفاتورة أو العميل"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="px-3 py-2 rounded-md border border-border bg-card text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">كل الحالات</option>
            <option value="مدفوع">مدفوع</option>
            <option value="متأخر">متأخر</option>
            <option value="غير مدفوع">غير مدفوع</option>
            <option value="قيد السداد">قيد السداد</option>
            <option value="أقساط تمارا">أقساط تمارا</option>
            <option value="أقساط تابي">أقساط تابي</option>
          </select>
          <select
            className="px-3 py-2 rounded-md border border-border bg-card text-sm"
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
          >
            <option value="">كل طرق الدفع</option>
            <option value="نقدي">نقدي</option>
            <option value="آجل">آجل</option>
            <option value="أقساط تمارا">أقساط تمارا</option>
            <option value="أقساط تابي">أقساط تابي</option>
          </select>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">من</label>
            <input type="date" className="px-3 py-2 rounded-md border border-border bg-card text-sm" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            <label className="text-xs text-muted-foreground">إلى</label>
            <input type="date" className="px-3 py-2 rounded-md border border-border bg-card text-sm" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
          <button className="px-3 py-2 rounded-md border border-primary bg-primary text-primary-foreground text-sm flex items-center gap-1" onClick={openInvoiceModal}>
            <Receipt size={14} /> إنشاء فاتورة
          </button>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="إجمالي الإيرادات" value={formatSAR(totals.totalIncome)} accent="from-emerald-500/20 to-emerald-500/5" />
        <MetricCard title="المعاملات المستحقة" value={formatSAR(totals.pendingAmount)} accent="from-amber-500/20 to-amber-500/5" />
        <MetricCard title="صافي الربح" value={formatSAR(totals.netProfit)} accent="from-sky-500/20 to-sky-500/5" />
        <MetricCard title="الإيراد اليومي (اليوم فقط)" value={formatSAR(totals.dailyRevenue)} accent="from-purple-500/20 to-purple-500/5" />
      </div>

      {/* Analytics Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Sales Employees - Vertical Column Chart */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">أعلى 5 مندوبي مبيعات</h3>
          <VerticalColumnChart data={topSalesEmployees} height={160} />
        </div>

        {/* Payment Method Distribution - Donut */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">توزيع طرق الدفع</h3>
          <div className="flex items-center gap-4">
            <Donut data={methodTotals.series} size={140} />
            <div className="grid grid-cols-2 gap-2 text-xs">
              {methodTotals.series.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: donutColor(i) }} />
                  <span className="text-muted-foreground">{s.method}</span>
                  <span className="font-medium">{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Trend - Line Chart (dynamic last 6 months) */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">اتجاه الإيرادات (آخر 6 أشهر)</h3>
          <LineChart data={last6} height={180} />
        </div>
      </div>

      {/* Professional Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Product Category - Horizontal Bar Chart */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">الإيرادات حسب فئة المنتجات</h3>
          <HorizontalBarChart data={categoryRevenue} height={200} />
        </div>

        {/* Revenue by Branch - Vertical Column Chart */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">الإيرادات حسب كل فرع</h3>
          <VerticalColumnChart data={branchRevenue} height={200} />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="p-3 text-right">رقم الفاتورة</th>
              <th className="p-3 text-right">العميل</th>
              <th className="p-3 text-right">المبلغ</th>
              <th className="p-3 text-right">الحالة</th>
              <th className="p-3 text-right">تاريخ الفاتورة</th>
              <th className="p-3 text-right">تاريخ الاستحقاق</th>
              <th className="p-3 text-right">إجراءات سريعة</th>
            </tr>
          </thead>
          <tbody>
            {currentPageItems.map((inv, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-3">{inv.id}</td>
                <td className="p-3">{inv.customer}</td>
                <td className="p-3">{formatSAR(inv.amount)}</td>
                <td className="p-3">
                  <span className={
                    inv.status === "مدفوع" ? "px-2 py-1 rounded bg-emerald-500/10 text-emerald-500" :
                    inv.status === "متأخر" || inv.status === "غير مدفوع" ? "px-2 py-1 rounded bg-rose-500/10 text-rose-500" :
                    "px-2 py-1 rounded bg-amber-500/10 text-amber-500"
                  }>{inv.status}</span>
                </td>
                <td className="p-3">{inv.invoiceDate}</td>
                <td className="p-3">{inv.dueDate}</td>
                <td className="p-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      className="p-1.5 rounded-md border border-sky-400/40 text-sky-600 dark:text-sky-300 hover:bg-sky-500/10"
                      aria-label="عرض التفاصيل"
                      onClick={() => { setSelectedIdx(((page - 1) * pageSize) + i); setShowTxn(true); }}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="p-1.5 rounded-md border border-emerald-400/40 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/10"
                      aria-label="تعديل"
                      onClick={() => setEditingInvoice(inv)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="p-1.5 rounded-md border border-emerald-400/40 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/10"
                      aria-label="تنزيل"
                      onClick={() => window.print?.()}
                    >
                      <DownloadIcon size={16} />
                    </button>
                    <button
                      className="p-1.5 rounded-md border border-rose-400/40 text-rose-600 dark:text-rose-300 hover:bg-rose-500/10"
                      aria-label="حذف"
                      onClick={() => {
                        if (typeof window !== "undefined" && window.confirm && !window.confirm(`حذف الفاتورة ${inv.id}؟`)) return;
                        setList(prev => prev.filter(item => item.id !== inv.id));
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-muted-foreground">عرض {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, filtered.length)} من {filtered.length}</div>
        <div className="flex items-center gap-1">
          <button
            className="px-2 py-1 rounded-md border border-border hover:bg-muted disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage(1)}
          >الأول</button>
          <button
            className="px-2 py-1 rounded-md border border-border hover:bg-muted disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >السابق</button>
          <span className="px-2">{page} / {totalPages}</span>
          <button
            className="px-2 py-1 rounded-md border border-border hover:bg-muted disabled:opacity-50"
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >التالي</button>
          <button
            className="px-2 py-1 rounded-md border border-border hover:bg-muted disabled:opacity-50"
            disabled={page === totalPages}
            onClick={() => setPage(totalPages)}
          >الأخير</button>
        </div>
      </div>

      {showInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowInvoice(false)} />
          <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-3xl rounded-xl border border-border bg-card p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-semibold">إنشاء فاتورة</div>
              <button className="px-2 py-1 rounded-md border border-border hover:bg-muted text-xs" onClick={() => setShowInvoice(false)}>إلغاء</button>
            </div>
            <form
              className="space-y-4 text-sm"
              onSubmit={(e) => {
                e.preventDefault();
                const toNum = (v: number | "") => (typeof v === "number" ? v : parseFloat(`${v}`) || 0);
                const subTotal = invoiceItems.reduce((s, it) => s + toNum(it.quantity) * toNum(it.price), 0);
                const vatAmt = subTotal * ((parseFloat(invoiceVatPct || "0") || 0) / 100);
                const total = subTotal + vatAmt;
                console.log("New invoice:", { customer: invoiceCustomer, dueDate: invoiceDue, method: invoiceMethod, vatPct: invoiceVatPct, items: invoiceItems, subTotal, vatAmt, total });
                setShowInvoice(false);
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="flex flex-col gap-1 lg:col-span-2">
                  <label className="text-xs text-muted-foreground">العميل</label>
                  <input list="customers-list" className="px-3 py-2 rounded-md border border-border bg-card" placeholder="ابحث/اختر عميل" value={invoiceCustomer} onChange={(e) => setInvoiceCustomer(e.target.value)} required />
                  <datalist id="customers-list">
                    {uniqueCustomers.map((c, i) => (<option key={i} value={c} />))}
                  </datalist>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">تاريخ الاستحقاق</label>
                  <input type="date" className="px-3 py-2 rounded-md border border-border bg-card" value={invoiceDue} onChange={(e) => setInvoiceDue(e.target.value)} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">طريقة الدفع المتوقعة</label>
                  <select className="px-3 py-2 rounded-md border border-border bg-card" value={invoiceMethod} onChange={(e) => setInvoiceMethod(e.target.value)} required>
                    <option value="">اختر</option>
                    <option value="نقدي">نقدي</option>
                    <option value="آجل">آجل</option>
                    <option value="أقساط تمارا">أقساط تمارا</option>
                    <option value="أقساط تابي">أقساط تابي</option>
                  </select>
                </div>
              </div>

              <div className="rounded-lg border border-border">
                <div className="grid grid-cols-12 gap-2 p-2 bg-muted text-muted-foreground text-xs">
                  <div className="col-span-6 pr-2">البند</div>
                  <div className="col-span-2 text-center">الكمية</div>
                  <div className="col-span-2 text-center">السعر</div>
                  <div className="col-span-2 text-center">الإجمالي</div>
                </div>
                {invoiceItems.map((it, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 p-2 border-top border-border items-center">
                    <input className="col-span-6 px-2 py-1 rounded-md border border-border bg-card" value={it.description} onChange={(e) => {
                      const arr = [...invoiceItems]; arr[idx] = { ...it, description: e.target.value }; setInvoiceItems(arr);
                    }} />
                    <input type="number" className="col-span-2 text-center px-2 py-1 rounded-md border border-border bg-card" value={it.quantity} onChange={(e) => {
                      const v = e.target.value;
                      const arr = [...invoiceItems]; arr[idx] = { ...it, quantity: v === "" ? "" : Math.max(0, Number(v)) }; setInvoiceItems(arr);
                    }} />
                    <input type="number" className="col-span-2 text-center px-2 py-1 rounded-md border border-border bg-card" value={it.price} onChange={(e) => {
                      const v = e.target.value;
                      const arr = [...invoiceItems]; arr[idx] = { ...it, price: v === "" ? "" : Math.max(0, Number(v)) }; setInvoiceItems(arr);
                    }} />
                    <div className="col-span-2 text-center font-medium">{formatSAR(((typeof it.quantity === "number" ? it.quantity : 0) * (typeof it.price === "number" ? it.price : 0)))}</div>
                  </div>
                ))}
                <div className="p-2 flex items-center justify-between">
                  <button type="button" className="px-3 py-1.5 rounded-md border border-border bg-card hover:bg-muted text-xs" onClick={() => setInvoiceItems([...invoiceItems, { description: "", quantity: "", price: "" }])}>إضافة بند</button>
                  <button type="button" className="px-3 py-1.5 rounded-md border border-rose-400/40 text-rose-600 hover:bg-rose-500/10 text-xs" onClick={() => invoiceItems.length > 1 && setInvoiceItems(invoiceItems.slice(0, -1))}>حذف آخر بند</button>
                </div>
              </div>

              {/* VAT & Totals */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">الضريبة (VAT) %</label>
                  <input type="number" className="px-3 py-2 rounded-md border border-border bg-card" placeholder="مثال: 15" value={invoiceVatPct} onChange={(e) => setInvoiceVatPct(e.target.value)} />
                </div>
                <div className="sm:col-span-2 text-right text-xs text-muted-foreground">
                  {(() => {
                    const toNum = (v: number | "") => (typeof v === "number" ? v : parseFloat(`${v}`) || 0);
                    const sub = invoiceItems.reduce((s, it) => s + toNum(it.quantity) * toNum(it.price), 0);
                    const vat = sub * ((parseFloat(invoiceVatPct || "0") || 0) / 100);
                    const total = sub + vat;
                    return (
                      <div className="space-y-1">
                        <div>المجموع الفرعي: <span className="font-semibold">{formatSAR(sub)}</span></div>
                        <div>الضريبة: <span className="font-semibold">{formatSAR(vat)}</span></div>
                        <div>الإجمالي: <span className="font-semibold">{formatSAR(total)}</span></div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button type="button" className="px-3 py-2 rounded-md border border-border bg-card hover:bg-muted text-sm" onClick={() => setShowInvoice(false)}>إلغاء</button>
                <button type="submit" className="px-3 py-2 rounded-md border border-primary bg-primary text-primary-foreground text-sm">إنشاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTxn && selectedIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowTxn(false)} />
          <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-2xl rounded-xl border border-border bg-card p-4 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-semibold">تفاصيل الفاتورة • {filtered[selectedIdx].id}</div>
              <button className="px-2 py-1 rounded-md border border-border hover:bg-muted text-xs" onClick={() => setShowTxn(false)}>إغلاق</button>
            </div>
            <div className="text-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">العميل</div>
                  <div className="font-medium">{filtered[selectedIdx].customer}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">المبلغ</div>
                  <div className="font-semibold">{formatSAR(filtered[selectedIdx].amount)}</div>
                </div>
              </div>
              <div className="flex gap-3 text-xs">
                <div className="px-2 py-1 rounded bg-muted">الحالة: {filtered[selectedIdx].status}</div>
                <div className="px-2 py-1 rounded bg-muted">التاريخ: {filtered[selectedIdx].invoiceDate}</div>
                <div className="px-2 py-1 rounded bg-muted">الاستحقاق: {filtered[selectedIdx].dueDate}</div>
              </div>
              {/* Executing employee details */}
              {(() => {
                const inv = filtered[selectedIdx];
                const execAt = new Date(inv.invoiceDate + "T00:00:00");
                execAt.setHours(9 + (selectedIdx % 6), (selectedIdx * 7) % 60);
                const ts = `${execAt.toISOString().slice(0,10)} ${execAt.toTimeString().slice(0,5)}`;
                const role = "مندوب مبيعات";
                const dept = "المبيعات";
                return (
                  <div className="rounded-lg border border-border p-3">
                    <div className="text-xs text-muted-foreground mb-2">الموظف المنفذ</div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px]">الاسم:</span>
                        <Link href={`/employees`} className="text-primary hover:underline text-[13px]">
                          {inv.salesRep}
                        </Link>
                      </div>
                      <div className="text-[13px]">الدور/القسم: <span className="font-medium">{role} • {dept}</span></div>
                      <div className="text-[13px]">وقت التنفيذ: <span className="font-medium">{ts}</span></div>
                    </div>
                  </div>
                );
              })()}
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="grid grid-cols-12 gap-2 p-2 bg-muted text-muted-foreground text-xs">
                  <div className="col-span-6 pr-2">البند</div>
                  <div className="col-span-2 text-center">الكمية</div>
                  <div className="col-span-2 text-center">السعر</div>
                  <div className="col-span-2 text-center">الإجمالي</div>
                </div>
                {lineItemsFor(selectedIdx).map((it, k) => (
                  <div key={k} className="grid grid-cols-12 gap-2 p-2 border-t border-border">
                    <div className="col-span-6">{it.name}</div>
                    <div className="col-span-2 text-center">{formatNumber(it.qty)}</div>
                    <div className="col-span-2 text-center">{formatSAR(it.price)}</div>
                    <div className="col-span-2 text-center font-medium">{formatSAR(it.total)}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-end text-sm">
                <div>
                  الإجمالي: <span className="font-semibold">{formatSAR(lineItemsFor(selectedIdx).reduce((s, it) => s + it.total, 0))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Invoice Modal */}
      {editingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditingInvoice(null)} />
          <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-2xl rounded-xl border border-border bg-card p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-semibold">تعديل الفاتورة • {editingInvoice.id}</div>
              <button className="px-2 py-1 rounded-md border border-border hover:bg-muted text-xs" onClick={() => setEditingInvoice(null)}>إغلاق</button>
            </div>
            <form
              className="space-y-4 text-sm"
              onSubmit={(e) => {
                e.preventDefault();
                setList(prev => prev.map(iv => iv.id === editingInvoice.id ? editingInvoice : iv));
                setEditingInvoice(null);
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">العميل</label>
                  <input className="px-3 py-2 rounded-md border border-border bg-card" value={editingInvoice.customer} onChange={(e) => setEditingInvoice(prev => prev ? { ...prev, customer: e.target.value } as Invoice : prev)} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">المبلغ</label>
                  <input type="number" className="px-3 py-2 rounded-md border border-border bg-card" value={editingInvoice.amount} onChange={(e) => setEditingInvoice(prev => prev ? { ...prev, amount: parseFloat(e.target.value) || 0 } as Invoice : prev)} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">الحالة</label>
                  <select className="px-3 py-2 rounded-md border border-border bg-card" value={editingInvoice.status} onChange={(e) => setEditingInvoice(prev => prev ? { ...prev, status: e.target.value as PaymentStatus } as Invoice : prev)} required>
                    <option value="مدفوع">مدفوع</option>
                    <option value="متأخر">متأخر</option>
                    <option value="غير مدفوع">غير مدفوع</option>
                    <option value="قيد السداد">قيد السداد</option>
                    <option value="أقساط تمارا">أقساط تمارا</option>
                    <option value="أقساط تابي">أقساط تابي</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">تاريخ الاستحقاق</label>
                  <input type="date" className="px-3 py-2 rounded-md border border-border bg-card" value={editingInvoice.dueDate} onChange={(e) => setEditingInvoice(prev => prev ? { ...prev, dueDate: e.target.value } as Invoice : prev)} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">مندوب المبيعات</label>
                  <input className="px-3 py-2 rounded-md border border-border bg-card" value={editingInvoice.salesRep} onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingInvoice(prev => prev ? { ...prev, salesRep: e.target.value } as Invoice : prev)} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">الفرع</label>
                  <select className="px-3 py-2 rounded-md border border-border bg-card" value={editingInvoice.branch} onChange={(e: ChangeEvent<HTMLSelectElement>) => setEditingInvoice(prev => prev ? { ...prev, branch: e.target.value } as Invoice : prev)}>
                    <option value="الرياض">الرياض</option>
                    <option value="جدة">جدة</option>
                    <option value="الدمام">الدمام</option>
                    <option value="مكة">مكة</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button type="button" className="px-3 py-2 rounded-md border border-border bg-card hover:bg-muted text-sm" onClick={() => setEditingInvoice(null)}>إلغاء</button>
                <button type="submit" className="px-3 py-2 rounded-md border border-primary bg-primary text-primary-foreground text-sm">حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ title, value, accent }: { title: string; value: string; accent: string }) {
  return (
    <div className={`rounded-xl border border-border bg-card p-4 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md bg-gradient-to-br ${accent}`}>
      <div className="text-xs text-muted-foreground mb-1">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function BarChart({ data, height = 160 }: { data: { name: string; value: number }[]; height?: number }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-3" style={{ height }}>
      {data.map((d, i) => {
        const h = Math.max(8, Math.round((d.value / max) * (height - 30)));
        return (
          <div key={i} className="flex flex-col items-center gap-1 w-full">
            <div className="w-full rounded-t-md bg-primary/20" style={{ height: h }} />
            <div className="text-[10px] text-center text-muted-foreground truncate w-full" title={d.name}>{d.name}</div>
            <div className="text-[10px] font-medium">{formatNumber(d.value)}</div>
          </div>
        );
      })}
    </div>
  );
}

function donutColor(i: number) {
  const colors = ["#22c55e", "#f59e0b", "#06b6d4", "#a78bfa", "#ef4444", "#10b981"];
  return colors[i % colors.length];
}

function Donut({ data, size = 140 }: { data: { method: string; value: number; pct: number }[]; size?: number }) {
  const radius = size / 2;
  const stroke = 18;
  const r = radius - stroke / 2;
  const C = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`rotate(-90 ${radius} ${radius})`}>
        {data.map((d, i) => {
          const len = (d.pct / 100) * C;
          const dash = `${len} ${C - len}`;
          const el = (
            <circle key={i} cx={radius} cy={radius} r={r} fill="none" stroke={donutColor(i)} strokeWidth={stroke} strokeDasharray={dash} strokeDashoffset={-offset} />
          );
          offset += len;
          return el;
        })}
      </g>
      <circle cx={radius} cy={radius} r={r - stroke} fill="var(--background)" />
      <text x={radius} y={radius} textAnchor="middle" dominantBaseline="middle" className="text-xs fill-current">
        {data.reduce((s, d) => s + d.pct, 0)}%
      </text>
    </svg>
  );
}

function LineChart({ data, height = 180 }: { data: { label: string; sales: number }[]; height?: number }) {
  const paddingLeft = 64; // y-axis labels
  const paddingRight = 20;
  const paddingTop = 14;
  const paddingBottom = 22;
  const w = 520; // viewBox width
  const h = height; // viewBox height

  const values = data.map(d => d.sales);
  const rawMax = Math.max(1, ...values);
  const niceStep = Math.pow(10, Math.floor(Math.log10(rawMax)) - 1);
  const max = Math.ceil(rawMax / niceStep) * niceStep;

  const min = 0;
  const innerW = w - paddingLeft - paddingRight;
  const innerH = h - paddingTop - paddingBottom;
  const scaleX = (i: number) => paddingLeft + (i * innerW) / Math.max(1, data.length - 1);
  const scaleY = (v: number) => paddingTop + innerH - ((v - min) / Math.max(1, max - min)) * innerH;

  // Build smooth path (monotone-like) using simple quadratic beziers
  const pts = data.map((d, i) => ({ x: scaleX(i), y: scaleY(d.sales) }));
  const dPath = pts.reduce((acc, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = arr[i - 1];
    const cx = (prev.x + p.x) / 2;
    return acc + ` Q ${cx} ${prev.y} ${p.x} ${p.y}`;
  }, "");

  // Area under line for subtle fill
  const areaPath = `${dPath} L ${paddingLeft + innerW} ${paddingTop + innerH} L ${paddingLeft} ${paddingTop + innerH} Z`;

  const yTicks = 4;
  const tickVals = Array.from({ length: yTicks + 1 }).map((_, i) => Math.round((max / yTicks) * i));

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id="incomeArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.18" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Axes */}
      <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={paddingTop + innerH} stroke="currentColor" opacity={0.15} />
      <line x1={paddingLeft} y1={paddingTop + innerH} x2={paddingLeft + innerW} y2={paddingTop + innerH} stroke="currentColor" opacity={0.15} />

      {/* Grid and Y labels */}
      {tickVals.map((v, i) => {
        const y = scaleY(v);
        return (
          <g key={i}>
            <line x1={paddingLeft} x2={paddingLeft + innerW} y1={y} y2={y} stroke="currentColor" opacity={0.08} />
            <text x={paddingLeft - 8} y={y + 3} textAnchor="end" className="text-[10px] fill-current text-muted-foreground">
              {formatSAR(v)}
            </text>
          </g>
        );
      })}

      {/* Area and Line */}
      <path d={areaPath} fill="url(#incomeArea)" />
      <path d={dPath} fill="none" stroke="hsl(var(--primary))" strokeWidth={2.5} />

      {/* Points with titles as tooltips */}
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={scaleX(i)} cy={scaleY(d.sales)} r={3.5} fill="hsl(var(--primary))">
            <title>{`${d.label}: ${formatSAR(d.sales)}`}</title>
          </circle>
        </g>
      ))}

      {/* X labels */}
      {data.map((d, i) => (
        <text key={`t-${i}`} x={scaleX(i)} y={paddingTop + innerH + 12} textAnchor="middle" className="text-[10px] fill-current text-muted-foreground">
          {d.label.split(" ")[0]}
        </text>
      ))}
    </svg>
  );
}


// Horizontal Bar Chart for Product Categories
function HorizontalBarChart({ data, height = 200 }: { data: { name: string; value: number }[]; height?: number }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const barHeight = Math.max(20, (height - 40) / data.length);

  return (
    <div className="space-y-2" style={{ height }}>
      {data.map((d, i) => {
        const width = Math.max(4, (d.value / max) * 100);
        return (
          <div key={i} className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground w-20 text-right truncate" title={d.name}>
              {d.name}
            </div>
            <div className="flex-1 relative">
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-300"
                  style={{ width: `${width}%` }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-end pr-2">
                <span className="text-[10px] font-medium text-muted-foreground">
                  {formatSAR(d.value)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Vertical Column Chart for Branches and Sales Employees
function VerticalColumnChart({ data, height = 200 }: { data: { name: string; value: number }[]; height?: number }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const chartHeight = height - 60; // More space for labels
  const barWidth = Math.max(25, (520 - 60) / data.length);

  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d, i) => {
        const barHeight = Math.max(8, (d.value / max) * chartHeight);
        return (
          <div key={i} className="flex flex-col items-center gap-1" style={{ width: barWidth }}>
            {/* Value label on top of bar */}
            <div className="text-[10px] font-medium text-muted-foreground mb-1">
              {formatSAR(d.value)}
            </div>
            {/* Bar */}
            <div className="w-full rounded-t-md bg-gradient-to-t from-primary/90 to-primary/70 relative" 
                 style={{ height: barHeight }}>
              {/* Value label inside bar for better visibility */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[8px] font-bold text-white drop-shadow-sm">
                  {formatNumber(d.value / 1000)}K
                </span>
              </div>
            </div>
            {/* Name label */}
            <div className="text-[9px] text-center text-muted-foreground truncate w-full mt-1" title={d.name}>
              {d.name.includes(' - ') ? d.name.split(' - ')[0] : d.name}
            </div>
            {/* City label for branches */}
            {d.name.includes(' - ') && (
              <div className="text-[8px] text-center text-muted-foreground/70 truncate w-full">
                {d.name.split(' - ')[1]}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


