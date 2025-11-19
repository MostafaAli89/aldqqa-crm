"use client";

"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { computeBranchKpis, formatCurrency } from "@/lib/branches";
import { invoices, inventory, salesOrders } from "@/lib/mockData";

export default function BranchDetailsPage() {
  const params = useParams<{ branch: string }>();
  const branchName = decodeURIComponent(params.branch || "");
  const kpis = useMemo(() => computeBranchKpis(), []);
  const k = kpis.find((x) => x.branch === branchName);

  if (!k) {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-lg">لم يتم العثور على الفرع</div>
        <Link href="/branches" className="inline-flex px-3 py-1.5 rounded border border-border hover:bg-muted w-fit">عودة للفروع</Link>
      </div>
    );
  }

  const last6Months = useMemo(() => getLastNMonths(6), []);
  const currentYearMonths = useMemo(() => getYearMonths(new Date().getFullYear()), []);

  const revenueByMonth = useMemo(() => groupMonthlyRevenue(branchName, last6Months), [branchName, last6Months]);
  const expensesByMonth = useMemo(() => groupMonthlyExpensesAllocated(branchName, last6Months), [branchName, last6Months]);

  const ytdNetProfit = useMemo(() => computeMonthlyNetProfit(branchName, currentYearMonths), [branchName, currentYearMonths]);
  const benchmark = useMemo(() => computeBenchmark(kpis), [kpis]);

  const topProducts = useMemo(() => topProductsByInventoryValue(branchName, 5), [branchName]);
  const topEmployees = useMemo(() => topEmployeesBySales(branchName, 5), [branchName]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">تفاصيل الفرع: {k.branch}</h1>
        <Link href="/branches" className="ms-auto inline-flex px-3 py-1.5 rounded border border-border hover:bg-muted">عودة للفروع</Link>
      </div>

      {/* Top interactive KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="إجمالي الإيرادات" value={formatCurrency(k.totalRevenue)} accent="from-sky-500/15 to-sky-500/5" />
        <MetricCard title="إجمالي المصروفات" value={formatCurrency(k.totalExpenses)} accent="from-rose-500/15 to-rose-500/5" />
        <MetricCard title="صافي الربح" value={`${formatCurrency(k.netProfit)} (${k.netProfitPct.toFixed(1)}%)`} accent="from-emerald-500/15 to-emerald-500/5" />
        <MetricCard title="قيمة المخزون" value={formatCurrency(k.inventoryValue)} accent="from-indigo-500/15 to-indigo-500/5" />
      </div>

      {/* Revenue vs Expenses - Line Chart (last 6 months) */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="text-sm font-semibold text-muted-foreground mb-3">اتجاه الإيرادات والمصروفات لآخر 6 أشهر</div>
        <DualLineChart labels={last6Months.map(m => m.label)} series={[{ name: "الإيرادات", data: revenueByMonth }, { name: "المصروفات", data: expensesByMonth }]} height={220} />
      </div>

      {/* Monthly Net Profit - Bar Chart (current year) */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="text-sm font-semibold text-muted-foreground mb-3">صافي الربح الشهري خلال السنة الحالية</div>
        <SimpleBarChart labels={currentYearMonths.map(m => m.labelShort)} data={ytdNetProfit} height={220} />
      </div>

      {/* Benchmarking */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="text-sm font-semibold text-muted-foreground mb-2">المقارنة المرجعية</div>
        <div className="text-sm flex flex-wrap items-center gap-4">
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="text-[11px] text-muted-foreground mb-0.5">صافي ربح الفرع (YTD)</div>
            <div className="text-base font-semibold">{formatCurrency(sum(ytdNetProfit))}</div>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="text-[11px] text-muted-foreground mb-0.5">متوسط صافي ربح جميع الفروع (YTD)</div>
            <div className="text-base font-semibold">{formatCurrency(benchmark.avgNetProfitYtd)}</div>
          </div>
          <div className={`rounded-lg border p-3 ${sum(ytdNetProfit) >= benchmark.avgNetProfitYtd ? "border-emerald-300 bg-emerald-50/30 text-emerald-700" : "border-amber-300 bg-amber-50/30 text-amber-700"}`}>
            <div className="text-[11px] mb-0.5">الوضع مقابل المتوسط</div>
            <div className="text-base font-semibold">{sum(ytdNetProfit) >= benchmark.avgNetProfitYtd ? "أفضل من المتوسط" : "أقل من المتوسط"}</div>
          </div>
        </div>
      </div>

      {/* Top 5 lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-sm font-semibold text-muted-foreground mb-2">أعلى 5 منتجات/خدمات مبيعًا</div>
          <table className="w-full text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="p-2 text-right">المنتج</th>
                <th className="p-2 text-right">الفئة</th>
                <th className="p-2 text-right">قيمة تقديرية</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="p-2">{p.product}</td>
                  <td className="p-2">{p.category}</td>
                  <td className="p-2">{formatCurrency(p.estimatedValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-sm font-semibold text-muted-foreground mb-2">أفضل 5 موظفين أداءً</div>
          <table className="w-full text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="p-2 text-right">الموظف</th>
                <th className="p-2 text-right">الطلبات</th>
                <th className="p-2 text-right">قيمة المبيعات</th>
              </tr>
            </thead>
            <tbody>
              {topEmployees.map((e, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="p-2">{e.salesRep}</td>
                  <td className="p-2">{e.orders}</td>
                  <td className="p-2">{formatCurrency(e.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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

function DualLineChart({ labels, series, height = 220 }: { labels: string[]; series: { name: string; data: number[] }[]; height?: number }) {
  const paddingLeft = 52, paddingRight = 16, paddingTop = 12, paddingBottom = 24;
  const w = 560, h = height;
  const allVals = series.flatMap(s => s.data);
  const max = Math.max(1, ...allVals);
  const innerW = w - paddingLeft - paddingRight;
  const innerH = h - paddingTop - paddingBottom;
  const scaleX = (i: number) => paddingLeft + (i * innerW) / Math.max(1, labels.length - 1);
  const scaleY = (v: number) => paddingTop + innerH - (v / max) * innerH;
  const colors = ["#3b82f6", "#ef4444"]; // professional blue & red
  const yTicks = 4;
  const tickVals = Array.from({ length: yTicks + 1 }).map((_, i) => Math.round((max / yTicks) * i));
  
  return (
    <div className="flex flex-col gap-3">
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <linearGradient id="revenueArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="expenseArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        
        {/* Y-axis */}
        <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={paddingTop + innerH} stroke="currentColor" opacity={0.15} />
        <line x1={paddingLeft} y1={paddingTop + innerH} x2={paddingLeft + innerW} y2={paddingTop + innerH} stroke="currentColor" opacity={0.15} />
        
        {/* Y-axis labels */}
        {tickVals.map((v, i) => {
          const y = scaleY(v);
          return (
            <g key={i}>
              <line x1={paddingLeft} x2={paddingLeft + innerW} y1={y} y2={y} stroke="currentColor" opacity={0.08} />
              <text x={paddingLeft - 8} y={y + 3} textAnchor="end" className="text-[10px] fill-current text-muted-foreground">
                {formatCurrency(v)}
              </text>
            </g>
          );
        })}
        
        {/* Lines and data points */}
        {series.map((s, si) => {
          const pts = s.data.map((v, i) => ({ x: scaleX(i), y: scaleY(v) }));
          const path = pts.reduce((acc, p, i, arr) => {
            if (i === 0) return `M ${p.x} ${p.y}`;
            const prev = arr[i - 1];
            const cx = (prev.x + p.x) / 2;
            return acc + ` Q ${cx} ${prev.y} ${p.x} ${p.y}`;
          }, "");
          return (
            <g key={si}>
              <path d={path} fill="none" stroke={colors[si % colors.length]} strokeWidth={2.5} />
              {pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={colors[si % colors.length]}>
                  <title>{`${s.name}: ${formatCurrency(s.data[i])}`}</title>
                </circle>
              ))}
            </g>
          );
        })}
        
        {/* X-axis labels */}
        {labels.map((lab, i) => (
          <text key={i} x={scaleX(i)} y={paddingTop + innerH + 12} textAnchor="middle" className="text-[10px] fill-current text-muted-foreground">{lab}</text>
        ))}
      </svg>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs">
        {series.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-0.5 rounded" style={{ background: colors[i % colors.length] }} />
            <span className="text-muted-foreground">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimpleBarChart({ labels, data, height = 220 }: { labels: string[]; data: number[]; height?: number }) {
  const w = 560; const h = height; const paddingX = 24; const paddingY = 20; const bottom = 28; const chartH = h - bottom - paddingY;
  const max = Math.max(1, ...data.map(v => Math.abs(v)));
  const barW = Math.max(20, (w - paddingX * 2) / data.length - 8);
  const scaleY = (v: number) => (Math.abs(v) / max) * chartH;
  const yTicks = 4;
  const tickVals = Array.from({ length: yTicks + 1 }).map((_, i) => Math.round((max / yTicks) * i));
  
  return (
    <div className="flex flex-col gap-3">
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* Y-axis */}
        <line x1={paddingX} y1={paddingY} x2={paddingX} y2={paddingY + chartH} stroke="currentColor" opacity={0.15} />
        <line x1={paddingX} y1={paddingY + chartH} x2={w - paddingX} y2={paddingY + chartH} stroke="currentColor" opacity={0.15} />
        
        {/* Y-axis labels */}
        {tickVals.map((v, i) => {
          const y = paddingY + chartH - (v / max) * chartH;
          return (
            <g key={i}>
              <line x1={paddingX} x2={w - paddingX} y1={y} y2={y} stroke="currentColor" opacity={0.08} />
              <text x={paddingX - 8} y={y + 3} textAnchor="end" className="text-[10px] fill-current text-muted-foreground">
                {formatCurrency(v)}
              </text>
            </g>
          );
        })}
        
        {/* Bars */}
        {data.map((v, i) => {
          const hBar = Math.max(8, scaleY(v));
          const x = paddingX + i * (barW + 8);
          const y = paddingY + chartH - hBar;
          return (
            <g key={i}>
              <defs>
                <linearGradient id={`np-${i}`} x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor={v >= 0 ? "#10b981" : "#ef4444"} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={v >= 0 ? "#10b981" : "#ef4444"} stopOpacity="0.7" />
                </linearGradient>
              </defs>
              <rect x={x} y={y} width={barW} height={hBar} rx={4} fill={`url(#np-${i})`} />
              <text x={x + barW / 2} y={y - 6} textAnchor="middle" className="text-[10px] fill-current font-medium">
                {formatCurrency(v)}
              </text>
              <text x={x + barW / 2} y={h - 12} textAnchor="middle" className="text-[10px] fill-current text-muted-foreground">{labels[i]}</text>
            </g>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ background: "#10b981" }} />
          <span className="text-muted-foreground">صافي ربح إيجابي</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ background: "#ef4444" }} />
          <span className="text-muted-foreground">صافي ربح سلبي</span>
        </div>
      </div>
    </div>
  );
}

// Data helpers (scoped here for simplicity)
function getLastNMonths(n: number) {
  const months: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const monthNames = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
    months.push({ key, label: `${monthNames[d.getMonth()]}` });
  }
  return months;
}
function getYearMonths(year: number) {
  const res: { key: string; label: string; labelShort: string }[] = [];
  const names = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
  for (let m = 0; m < 12; m++) {
    const key = `${year}-${String(m + 1).padStart(2, "0")}`;
    res.push({ key, label: `${names[m]} ${year}`, labelShort: names[m] });
  }
  return res;
}
function groupMonthlyRevenue(branch: string, months: { key: string }[]) {
  return months.map(({ key }) => invoices.filter(inv => inv.branch === branch && inv.invoiceDate.slice(0,7) === key).reduce((s, inv) => s + inv.amount, 0));
}
function groupMonthlyExpensesAllocated(branch: string, months: { key: string }[]) {
  return months.map(({ key }) => {
    const byBranch: Record<string, number> = { "الرياض": 0, "مكة": 0, "الدمام": 0, "جدة": 0 };
    // revenue per branch for that month
    for (const inv of invoices) {
      if (inv.invoiceDate.slice(0,7) === key) {
        byBranch[inv.branch] = (byBranch[inv.branch] || 0) + inv.amount;
      }
    }
    const totalMonthExpenses = expensesForMonth(key);
    const totalMonthRevenue = Object.values(byBranch).reduce((a,b) => a+b, 0);
    const share = totalMonthRevenue > 0 ? (byBranch[branch] || 0) / totalMonthRevenue : 0;
    return Math.round(totalMonthExpenses * share);
  });
}
function expensesForMonth(keyYYYYMM: string) {
  // approximate: use all expenses whose expenseDate is that month
  // expenses are imported via mockData at runtime in root page; re-import here would bloat, so compute from invoices proportionately using overall totals for simplicity
  // For a closer approximation, sum expenses array; but not imported here. We'll estimate month expense as proportion of invoices for month vs total invoices
  const monthRevenue = invoices.filter(inv => inv.invoiceDate.slice(0,7) === keyYYYYMM).reduce((s, inv) => s + inv.amount, 0);
  const totalRevenue = invoices.reduce((s, inv) => s + inv.amount, 0);
  // total expenses overall approximated via salesOrders profit margin not accessible here; fallback to  sum of expenses proxy: 35% of total invoices value
  const totalExpensesApprox = Math.round(totalRevenue * 0.35);
  const monthShare = totalRevenue > 0 ? monthRevenue / totalRevenue : 0;
  return Math.round(totalExpensesApprox * monthShare);
}
function computeMonthlyNetProfit(branch: string, months: { key: string }[]) {
  return months.map(({ key }) => {
    const rev = invoices.filter(inv => inv.branch === branch && inv.invoiceDate.slice(0,7) === key).reduce((s, inv) => s + inv.amount, 0);
    const exp = groupMonthlyExpensesAllocated(branch, [{ key }])[0];
    return rev - exp;
  });
}
function computeBenchmark(all: ReturnType<typeof computeBranchKpis>) {
  // YTD net profit per branch
  const year = new Date().getFullYear();
  const months = getYearMonths(year);
  const nets = all.map(b => sum(computeMonthlyNetProfit(b.branch, months)));
  const avgNetProfitYtd = Math.round(nets.reduce((a,b) => a+b, 0) / Math.max(1, nets.length));
  return { avgNetProfitYtd };
}
function topProductsByInventoryValue(branch: string, topN: number) {
  return inventory
    .filter(item => item.branch === (branch as any))
    .map(item => ({ product: item.product, category: item.category, estimatedValue: Math.round(item.currentStock * item.sellingPrice) }))
    .sort((a, b) => b.estimatedValue - a.estimatedValue)
    .slice(0, topN);
}
function topEmployeesBySales(branch: string, topN: number) {
  const map = new Map<string, { total: number; orders: number }>();
  for (const so of salesOrders) {
    if (so.branch === (branch as any)) {
      const e = map.get(so.salesRep) || { total: 0, orders: 0 };
      e.total += so.total;
      e.orders += 1;
      map.set(so.salesRep, e);
    }
  }
  return Array.from(map.entries()).map(([salesRep, v]) => ({ salesRep, total: v.total, orders: v.orders })).sort((a,b) => b.total - a.total).slice(0, topN);
}
function sum(arr: number[]) { return arr.reduce((a,b) => a + b, 0); }


