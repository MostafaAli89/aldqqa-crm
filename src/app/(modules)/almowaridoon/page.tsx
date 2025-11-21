"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { suppliers, type Supplier } from "@/lib/mockData";
import { formatNumber, formatSAR } from "@/lib/format";
import { 
  Truck, 
  Star, 
  CalendarPlus, 
  Phone, 
  Receipt, 
  HandCoins, 
  Trophy, 
  PieChart, 
  Wallet, 
  Eye, 
  Trash2, 
  Download as DownloadIcon,
  Building2,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Pencil
} from "lucide-react";

function classificationTag(c: Supplier["classification"]) {
  switch (c) {
    case "Key":
      return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
    case "Critical":
      return "bg-amber-500/15 text-amber-500 border-amber-500/30";
    case "Regular":
      return "bg-blue-500/15 text-blue-500 border-blue-500/30";
  }
}

function statusTag(s: Supplier["status"]) {
  switch (s) {
    case "Active":
      return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
    case "Suspended":
      return "bg-rose-500/15 text-rose-500 border-rose-500/30";
  }
}

function LargePie({ keyPct, criticalPct, regularPct }: { keyPct: number; criticalPct: number; regularPct: number }) {
  const total = keyPct + criticalPct + regularPct;
  const keyAngle = (keyPct / total) * 360;
  const criticalAngle = (criticalPct / total) * 360;
  const regularAngle = (regularPct / total) * 360;
  
  return (
    <div className="w-12 h-12 relative">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#10b981"
          strokeWidth="20"
          strokeDasharray={`${(keyAngle / 360) * 251.2} 251.2`}
          strokeDashoffset="0"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="20"
          strokeDasharray={`${(criticalAngle / 360) * 251.2} 251.2`}
          strokeDashoffset={`-${(keyAngle / 360) * 251.2}`}
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="20"
          strokeDasharray={`${(regularAngle / 360) * 251.2} 251.2`}
          strokeDashoffset={`-${((keyAngle + criticalAngle) / 360) * 251.2}`}
        />
      </svg>
    </div>
  );
}

export default function Page() {
  const [supplierList, setSupplierList] = useState<Supplier[]>(suppliers);
  const [city, setCity] = useState<string | "">("");
  const [classification, setClassification] = useState<string | "">("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | "">("");
  const [view, setView] = useState<"cards" | "table">("cards");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [selected, setSelected] = useState<Supplier | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [originalName, setOriginalName] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return supplierList.filter((s) => {
      const matchesQuery = [s.name, s.contactName, s.productCategory].some((v) => v.includes(query));
      const matchesCity = city ? s.city === city : true;
      const matchesClassification = classification ? s.classification === classification : true;
      const matchesStatus = status ? s.status === status : true;
      let matchesRange = true;
      if (fromDate || toDate) {
        const d = new Date(s.lastOrderDate);
        const start = fromDate ? new Date(fromDate) : null;
        const end = toDate ? new Date(toDate) : null;
        if (start && d < start) matchesRange = false;
        if (end) {
          const endInclusive = new Date(end.getFullYear(), end.getMonth(), end.getDate() + 1);
          if (d >= endInclusive) matchesRange = false;
        }
      }
      return matchesQuery && matchesCity && matchesClassification && matchesStatus && matchesRange;
    });
  }, [supplierList, query, city, classification, status, fromDate, toDate]);

  useEffect(() => {
    setPage(1);
  }, [query, city, classification, status, fromDate, toDate]);

  const metrics = useMemo(() => {
    const list = filtered;
    const total = list.length;
    const active = list.filter((s) => s.status === "Active").length;
    const suspended = list.filter((s) => s.status === "Suspended").length;
    const key = list.filter((s) => s.classification === "Key").length;
    const critical = list.filter((s) => s.classification === "Critical").length;
    const regular = list.filter((s) => s.classification === "Regular").length;
    const totalPurchaseValue = list.reduce((sum, s) => sum + s.totalPurchaseValue, 0);
    const totalCreditLimit = list.reduce((sum, s) => sum + s.creditLimit, 0);
    const now = new Date();
    const new30Count = list.filter((s) => {
      const d = new Date(s.lastOrderDate);
      return now.getTime() - d.getTime() <= 30 * 24 * 60 * 60 * 1000;
    }).length;
    const avgRating = list.length > 0 ? list.reduce((sum, s) => sum + s.rating, 0) / list.length : 0;
    const pendingOrders = list.reduce((sum, s) => sum + s.pendingOrders, 0);
    const avgDeliveryTime = list.length > 0 ? list.reduce((sum, s) => sum + s.avgDeliveryTime, 0) / list.length : 0;

    return { 
      total, 
      active, 
      suspended, 
      key, 
      critical, 
      regular, 
      totalPurchaseValue, 
      totalCreditLimit, 
      new30Count, 
      avgRating, 
      pendingOrders, 
      avgDeliveryTime 
    };
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paged = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page]);

  const uniqueCities = useMemo(() => {
    const cities = new Set(supplierList.map(s => s.city));
    return Array.from(cities);
  }, [supplierList]);

  const uniqueClassifications = useMemo(() => {
    const classifications = new Set(supplierList.map(s => s.classification));
    return Array.from(classifications);
  }, [supplierList]);

  return (
    <div className="space-y-4">
      {/* Top Metrics - 8 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/15 text-primary border border-primary/20">
              <Truck size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">إجمالي عدد الموردين</div>
              <div className="text-xl font-semibold">{formatNumber(metrics.total)}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">
              <CheckCircle size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">الموردون النشطون</div>
              <div className="text-xl font-semibold">{formatNumber(metrics.active)}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/15 text-rose-500 border border-rose-500/20">
              <XCircle size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">الموردون المعلقون</div>
              <div className="text-xl font-semibold">{formatNumber(metrics.suspended)}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/15 text-violet-500 border border-violet-500/20">
              <Receipt size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">إجمالي أوامر الشراء</div>
              <div className="text-xl font-semibold">{formatSAR(metrics.totalPurchaseValue)}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/15 text-sky-500 border border-sky-500/20">
              <CalendarPlus size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">موردون جدد آخر 30 يوم</div>
              <div className="text-xl font-semibold">{formatNumber(metrics.new30Count)}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/15 text-amber-500 border border-amber-500/20">
              <Wallet size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">إجمالي حدود الائتمان</div>
              <div className="text-xl font-semibold">{formatSAR(metrics.totalCreditLimit)}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/15 text-indigo-500 border border-indigo-500/20">
              <Trophy size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">متوسط التقييم</div>
              <div className="text-xl font-semibold">{metrics.avgRating.toFixed(1)}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/15 text-indigo-500 border border-indigo-500/20">
              <PieChart size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">تصنيف الموردين</div>
              <div className="text-xl font-semibold">{formatNumber(metrics.key)} / {formatNumber(metrics.critical)} / {formatNumber(metrics.regular)}</div>
              <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Key</span>
                <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500"></span> Critical</span>
                <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500"></span> Regular</span>
              </div>
            </div>
          </div>
          <div className="shrink-0">
            <LargePie keyPct={metrics.key} criticalPct={metrics.critical} regularPct={metrics.regular} />
          </div>
        </div>
      </div>

      {/* Filters + Actions */}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
        <h1 className="text-xl font-semibold">الموردون</h1>
        <div className="flex flex-wrap gap-2">
          <input
            className="px-3 py-2 rounded-md border border-border bg-card text-sm w-full sm:w-72 md:w-96 lg:w-[32rem]"
            placeholder="بحث بالاسم أو المنتج"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="px-3 py-2 rounded-md border border-border bg-card text-sm"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">كل المدن</option>
            {uniqueCities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
          <select
            className="px-3 py-2 rounded-md border border-border bg-card text-sm"
            value={classification}
            onChange={(e) => setClassification(e.target.value)}
          >
            <option value="">كل التصنيفات</option>
            {uniqueClassifications.map(cls => <option key={cls} value={cls}>{cls}</option>)}
          </select>
          <select
            className="px-3 py-2 rounded-md border border-border bg-card text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">كل الحالات</option>
            <option value="Active">نشط</option>
            <option value="Suspended">معلق</option>
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
            onClick={() => setShowAddSupplierModal(true)}
          >
            إضافة مورد جديد
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
          {filtered.map((s, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.productCategory} • {s.city}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className={`px-2.5 py-1 text-[11px] rounded-md border shadow-sm ${classificationTag(s.classification)}`}>
                    {s.classification}
                  </span>
                  <span className={`px-2.5 py-1 text-[11px] rounded-md border shadow-sm ${statusTag(s.status)}`}>
                    {s.status === "Active" ? "نشط" : "معلق"}
                  </span>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-violet-500/25 bg-violet-500/10 p-3">
                  <div className="flex items-center gap-2 text-xs text-violet-600 dark:text-violet-300"><Receipt size={14} /> إجمالي المشتريات</div>
                  <div className="mt-1 font-semibold text-violet-700 dark:text-violet-300">{formatSAR(s.totalPurchaseValue)}</div>
                </div>
                <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 p-3">
                  <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-300"><Wallet size={14} /> حد الائتمان</div>
                  <div className="mt-1 font-semibold text-amber-700 dark:text-amber-300">{formatSAR(s.creditLimit)}</div>
                </div>
                <div className="rounded-lg border border-sky-500/25 bg-sky-500/10 p-3">
                  <div className="flex items-center gap-2 text-xs text-sky-600 dark:text-sky-300"><Phone size={14} /> {s.contactName}</div>
                  <div className="mt-1 font-semibold text-sky-700 dark:text-sky-300">{s.contactPhone}</div>
                </div>
                <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-3">
                  <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-300"><Star size={14} /> التقييم</div>
                  <div className="mt-1 font-semibold text-emerald-700 dark:text-emerald-300">{s.rating.toFixed(1)}</div>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button 
                  className="px-3 py-1.5 rounded-md border border-border hover:bg-muted text-xs"
                  onClick={() => {
                    setSelected(s);
                    setShowModal(true);
                  }}
                >
                  عرض التفاصيل
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="p-2 sm:p-3 text-right">الاسم</th>
                <th className="p-2 sm:p-3 text-right">المدينة</th>
                <th className="p-2 sm:p-3 text-right">التصنيف</th>
                <th className="p-2 sm:p-3 text-right">الحالة</th>
                <th className="p-2 sm:p-3 text-right">فئة المنتج</th>
                <th className="p-2 sm:p-3 text-right">إجمالي المشتريات</th>
                <th className="p-2 sm:p-3 text-right">حد الائتمان</th>
                <th className="p-2 sm:p-3 text-right">التقييم</th>
                <th className="p-2 sm:p-3 text-right">آخر طلبية</th>
                <th className="p-2 sm:p-3 text-right">إجراءات سريعة</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((s, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="p-2 sm:p-3">{s.name}</td>
                  <td className="p-2 sm:p-3">{s.city}</td>
                  <td className="p-2 sm:p-3">
                    <span className={`px-2 py-1 text-[11px] rounded-md border ${classificationTag(s.classification)}`}>
                      {s.classification}
                    </span>
                  </td>
                  <td className="p-2 sm:p-3">
                    <span className={`px-2 py-1 text-[11px] rounded-md border ${statusTag(s.status)}`}>
                      {s.status === "Active" ? "نشط" : "معلق"}
                    </span>
                  </td>
                  <td className="p-2 sm:p-3">{s.productCategory}</td>
                  <td className="p-2 sm:p-3">{formatSAR(s.totalPurchaseValue)}</td>
                  <td className="p-2 sm:p-3">{formatSAR(s.creditLimit)}</td>
                  <td className="p-2 sm:p-3">{s.rating.toFixed(1)}</td>
                  <td className="p-2 sm:p-3">{s.lastOrderDate}</td>
                  <td className="p-2 sm:p-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1.5 rounded-md border border-sky-400/40 text-sky-600 dark:text-sky-300 hover:bg-sky-500/10"
                        aria-label="عرض سريع"
                        onClick={() => {
                          setSelected(s);
                          setShowModal(true);
                        }}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-1.5 rounded-md border border-emerald-400/40 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/10"
                        aria-label="تعديل"
                        onClick={() => { setEditingSupplier(s); setOriginalName(s.name); }}
                      >
                        <Pencil size={16} />
                      </button>
                      <button className="p-1.5 rounded-md border border-rose-400/40 text-rose-600 dark:text-rose-300 hover:bg-rose-500/10" aria-label="حذف">
                        <Trash2 size={16} />
                      </button>
                      <button className="p-1.5 rounded-md border border-emerald-400/40 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/10" aria-label="تنزيل">
                        <DownloadIcon size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Component */}
          <div className="flex items-center justify-between p-2 sm:p-3 border-t border-border">
            <div className="text-sm text-muted-foreground">
              عرض {formatNumber(paged.length)} من {formatNumber(filtered.length)} مورد
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-md border border-border bg-card text-sm disabled:opacity-50"
              >
                السابق
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1.5 rounded-md border text-sm ${
                    page === p ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-muted"
                  }`}
                >
                  {formatNumber(p)}
                </button>
              ))}
              <button
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-md border border-border bg-card text-sm disabled:opacity-50"
              >
                التالي
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
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
                  <div className="text-xs text-muted-foreground">{selected.productCategory} • {selected.city}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className={`px-2.5 py-1 text-[11px] rounded-md border shadow-sm ${classificationTag(selected.classification)}`}>
                    {selected.classification}
                  </span>
                  <span className={`px-2.5 py-1 text-[11px] rounded-md border shadow-sm ${statusTag(selected.status)}`}>
                    {selected.status === "Active" ? "نشط" : "معلق"}
                  </span>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-violet-500/25 bg-violet-500/10 p-3">
                  <div className="flex items-center gap-2 text-xs text-violet-600 dark:text-violet-300"><Receipt size={14} /> إجمالي المشتريات</div>
                  <div className="mt-1 font-semibold text-violet-700 dark:text-violet-300">{formatSAR(selected.totalPurchaseValue)}</div>
                </div>
                <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 p-3">
                  <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-300"><Wallet size={14} /> حد الائتمان</div>
                  <div className="mt-1 font-semibold text-amber-700 dark:text-amber-300">{formatSAR(selected.creditLimit)}</div>
                </div>
                <div className="rounded-lg border border-sky-500/25 bg-sky-500/10 p-3">
                  <div className="flex items-center gap-2 text-xs text-sky-600 dark:text-sky-300"><Phone size={14} /> {selected.contactName}</div>
                  <div className="mt-1 font-semibold text-sky-700 dark:text-sky-300">{selected.contactPhone}</div>
                </div>
                <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-3">
                  <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-300"><Star size={14} /> التقييم</div>
                  <div className="mt-1 font-semibold text-emerald-700 dark:text-emerald-300">{selected.rating.toFixed(1)}</div>
                </div>
                <div className="rounded-lg border border-indigo-500/25 bg-indigo-500/10 p-3">
                  <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-300"><Clock size={14} /> متوسط التسليم</div>
                  <div className="mt-1 font-semibold text-indigo-700 dark:text-indigo-300">{selected.avgDeliveryTime} يوم</div>
                </div>
                <div className="rounded-lg border border-rose-500/25 bg-rose-500/10 p-3">
                  <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-300"><AlertTriangle size={14} /> طلبات معلقة</div>
                  <div className="mt-1 font-semibold text-rose-700 dark:text-rose-300">{selected.pendingOrders}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Supplier Modal */}
      {showAddSupplierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddSupplierModal(false)} />
          <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">إضافة مورد جديد</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newSupplier = {
                name: formData.get("name"),
                city: formData.get("city"),
                classification: formData.get("classification"),
                status: formData.get("status"),
                productCategory: formData.get("productCategory"),
                contactName: formData.get("contactName"),
                contactPhone: formData.get("contactPhone"),
                creditLimit: formData.get("creditLimit"),
                paymentTerms: formData.get("paymentTerms"),
              };
              console.log("New Supplier Data:", newSupplier);
              setShowAddSupplierModal(false);
            }} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">اسم المورد</label>
                <input type="text" id="name" name="name" className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm" required />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-foreground mb-1">المدينة</label>
                <select id="city" name="city" className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm" required>
                  <option value="">اختر مدينة</option>
                  <option value="الرياض">الرياض</option>
                  <option value="جدة">جدة</option>
                  <option value="الدمام">الدمام</option>
                  <option value="مكة">مكة</option>
                  <option value="دولي">دولي</option>
                </select>
              </div>
              <div>
                <label htmlFor="classification" className="block text-sm font-medium text-foreground mb-1">التصنيف</label>
                <select id="classification" name="classification" className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm" required>
                  <option value="">اختر تصنيف</option>
                  <option value="Key">Key</option>
                  <option value="Critical">Critical</option>
                  <option value="Regular">Regular</option>
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-foreground mb-1">الحالة</label>
                <select id="status" name="status" className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm" required>
                  <option value="">اختر حالة</option>
                  <option value="Active">نشط</option>
                  <option value="Suspended">معلق</option>
                </select>
              </div>
              <div>
                <label htmlFor="productCategory" className="block text-sm font-medium text-foreground mb-1">فئة المنتج</label>
                <select id="productCategory" name="productCategory" className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm" required>
                  <option value="">اختر فئة المنتج</option>
                  <option value="أجهزة طبية">أجهزة طبية</option>
                  <option value="مستلزمات جراحية">مستلزمات جراحية</option>
                  <option value="أدوية">أدوية</option>
                  <option value="معدات تعقيم">معدات تعقيم</option>
                  <option value="قساطر">قساطر</option>
                  <option value="مختبرات">مختبرات</option>
                </select>
              </div>
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-foreground mb-1">اسم المسؤول</label>
                <input type="text" id="contactName" name="contactName" className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm" />
              </div>
              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-foreground mb-1">رقم الهاتف</label>
                <input type="tel" id="contactPhone" name="contactPhone" className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm" />
              </div>
              <div>
                <label htmlFor="creditLimit" className="block text-sm font-medium text-foreground mb-1">حد الائتمان</label>
                <input type="number" id="creditLimit" name="creditLimit" className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm" />
              </div>
              <div>
                <label htmlFor="paymentTerms" className="block text-sm font-medium text-foreground mb-1">شروط الدفع</label>
                <input type="text" id="paymentTerms" name="paymentTerms" className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm" />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowAddSupplierModal(false)} className="px-4 py-2 rounded-md border border-border bg-card text-sm hover:bg-muted">إلغاء</button>
                <button type="submit" className="px-4 py-2 rounded-md border border-primary bg-primary text-primary-foreground text-sm">إضافة</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Supplier Modal */}
      {editingSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditingSupplier(null)} />
          <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-2xl rounded-xl border border-border bg-card p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-semibold">تعديل المورد • {editingSupplier.name}</div>
              <button className="px-2 py-1 rounded-md border border-border hover:bg-muted text-xs" onClick={() => setEditingSupplier(null)}>إغلاق</button>
            </div>
            <form
              className="space-y-4 text-sm"
              onSubmit={(e) => {
                e.preventDefault();
                setSupplierList(prev => {
                  const idx = prev.findIndex(s => s.name === originalName);
                  if (idx === -1) return prev;
                  const copy = [...prev];
                  copy[idx] = editingSupplier;
                  return copy;
                });
                setEditingSupplier(null);
                setOriginalName(null);
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">اسم المورد</label>
                  <input className="px-3 py-2 rounded-md border border-border bg-card" value={editingSupplier.name} onChange={(e) => setEditingSupplier(prev => prev ? { ...prev, name: e.target.value } as Supplier : prev)} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">المدينة</label>
                  <select className="px-3 py-2 rounded-md border border-border bg-card" value={editingSupplier.city} onChange={(e: ChangeEvent<HTMLSelectElement>) => setEditingSupplier(prev => prev ? { ...prev, city: e.target.value } as Supplier : prev)} required>
                    <option value="الرياض">الرياض</option>
                    <option value="جدة">جدة</option>
                    <option value="الدمام">الدمام</option>
                    <option value="مكة">مكة</option>
                    <option value="دولي">دولي</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">التصنيف</label>
                  <select className="px-3 py-2 rounded-md border border-border bg-card" value={editingSupplier.classification} onChange={(e: ChangeEvent<HTMLSelectElement>) => setEditingSupplier(prev => prev ? { ...prev, classification: e.target.value } as Supplier : prev)} required>
                    <option value="Key">Key</option>
                    <option value="Critical">Critical</option>
                    <option value="Regular">Regular</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">الحالة</label>
                  <select className="px-3 py-2 rounded-md border border-border bg-card" value={editingSupplier.status} onChange={(e: ChangeEvent<HTMLSelectElement>) => setEditingSupplier(prev => prev ? { ...prev, status: e.target.value } as Supplier : prev)} required>
                    <option value="Active">نشط</option>
                    <option value="Suspended">معلق</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">فئة المنتج</label>
                  <select className="px-3 py-2 rounded-md border border-border bg-card" value={editingSupplier.productCategory} onChange={(e: ChangeEvent<HTMLSelectElement>) => setEditingSupplier(prev => prev ? { ...prev, productCategory: e.target.value } as Supplier : prev)} required>
                    <option value="أجهزة طبية">أجهزة طبية</option>
                    <option value="مستلزمات جراحية">مستلزمات جراحية</option>
                    <option value="أدوية">أدوية</option>
                    <option value="معدات تعقيم">معدات تعقيم</option>
                    <option value="قساطر">قساطر</option>
                    <option value="مختبرات">مختبرات</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">اسم المسؤول</label>
                  <input className="px-3 py-2 rounded-md border border-border bg-card" value={editingSupplier.contactName} onChange={(e) => setEditingSupplier(prev => prev ? { ...prev, contactName: e.target.value } as Supplier : prev)} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">رقم الهاتف</label>
                  <input className="px-3 py-2 rounded-md border border-border bg-card" value={editingSupplier.contactPhone} onChange={(e) => setEditingSupplier(prev => prev ? { ...prev, contactPhone: e.target.value } as Supplier : prev)} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">حد الائتمان</label>
                  <input type="number" className="px-3 py-2 rounded-md border border-border bg-card" value={editingSupplier.creditLimit} onChange={(e) => setEditingSupplier(prev => prev ? { ...prev, creditLimit: parseFloat(e.target.value) || 0 } as Supplier : prev)} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">شروط الدفع</label>
                  <input className="px-3 py-2 rounded-md border border-border bg-card" value={editingSupplier.paymentTerms} onChange={(e) => setEditingSupplier(prev => prev ? { ...prev, paymentTerms: e.target.value } as Supplier : prev)} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">آخر طلبية</label>
                  <input type="date" className="px-3 py-2 rounded-md border border-border bg-card" value={editingSupplier.lastOrderDate} onChange={(e) => setEditingSupplier(prev => prev ? { ...prev, lastOrderDate: e.target.value } as Supplier : prev)} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">التقييم</label>
                  <input type="number" step="0.1" className="px-3 py-2 rounded-md border border-border bg-card" value={editingSupplier.rating} onChange={(e) => setEditingSupplier(prev => prev ? { ...prev, rating: parseFloat(e.target.value) || 0 } as Supplier : prev)} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">طلبات معلقة</label>
                  <input type="number" className="px-3 py-2 rounded-md border border-border bg-card" value={editingSupplier.pendingOrders} onChange={(e) => setEditingSupplier(prev => prev ? { ...prev, pendingOrders: parseInt(e.target.value || "0", 10) } as Supplier : prev)} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">متوسط التسليم (يوم)</label>
                  <input type="number" className="px-3 py-2 rounded-md border border-border bg-card" value={editingSupplier.avgDeliveryTime} onChange={(e) => setEditingSupplier(prev => prev ? { ...prev, avgDeliveryTime: parseInt(e.target.value || "0", 10) } as Supplier : prev)} />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button type="button" className="px-3 py-2 rounded-md border border-border bg-card hover:bg-muted text-sm" onClick={() => setEditingSupplier(null)}>إلغاء</button>
                <button type="submit" className="px-3 py-2 rounded-md border border-primary bg-primary text-primary-foreground text-sm">حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}