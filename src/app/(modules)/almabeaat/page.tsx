"use client";

import { useEffect, useMemo, useState } from "react";
import { salesOrders, invoices, monthlySalesTrend, customers, type SalesOrder, type Invoice, type Customer } from "@/lib/mockData";
import { formatNumber, formatSAR } from "@/lib/format";
import { 
  ShoppingCart, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  PieChart, 
  BarChart3,
  Eye,
  Phone,
  Calendar,
  Target,
  Percent,
  Activity,
  Pencil,
  Trash2
} from "lucide-react";

function statusTag(s: SalesOrder["status"]) {
  switch (s) {
    case "قيد التنفيذ":
      return "bg-blue-500/15 text-blue-500 border-blue-500/30";
    case "مكتمل":
      return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
    case "بانتظار التسليم":
      return "bg-amber-500/15 text-amber-500 border-amber-500/30";
    case "ملغي":
      return "bg-rose-500/15 text-rose-500 border-rose-500/30";
    case "معلق":
      return "bg-gray-500/15 text-gray-500 border-gray-500/30";
  }
}

function paymentStatusTag(s: Invoice["status"]) {
  switch (s) {
    case "مدفوع":
      return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
    case "متأخر":
      return "bg-rose-500/15 text-rose-500 border-rose-500/30";
    case "أقساط تمارا":
      return "bg-purple-500/15 text-purple-500 border-purple-500/30";
    case "أقساط تابي":
      return "bg-indigo-500/15 text-indigo-500 border-indigo-500/30";
    case "قيد السداد":
      return "bg-amber-500/15 text-amber-500 border-amber-500/30";
    case "غير مدفوع":
      return "bg-gray-500/15 text-gray-500 border-gray-500/30";
  }
}

function classificationTag(c: "VIP" | "High Value" | "Risk") {
  switch (c) {
    case "VIP":
      return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
    case "High Value":
      return "bg-blue-500/15 text-blue-500 border-blue-500/30";
    case "Risk":
      return "bg-rose-500/15 text-rose-500 border-rose-500/30";
  }
}

// Sales Trend Chart Component
function SalesTrendChart() {
  const maxSales = Math.max(...monthlySalesTrend.map(m => m.sales));
  
  return (
    <div className="h-64 w-full">
      <svg viewBox="0 0 800 200" className="w-full h-full">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y, i) => (
          <line
            key={i}
            x1="50"
            y1={40 + (y / 100) * 120}
            x2="750"
            y2={40 + (y / 100) * 120}
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.2"
          />
        ))}
        
        {/* Sales line */}
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          points={monthlySalesTrend.map((month, i) => 
            `${50 + (i * 700) / (monthlySalesTrend.length - 1)},${160 - (month.sales / maxSales) * 120}`
          ).join(" ")}
        />
        
        {/* Data points */}
        {monthlySalesTrend.map((month, i) => (
          <circle
            key={i}
            cx={50 + (i * 700) / (monthlySalesTrend.length - 1)}
            cy={160 - (month.sales / maxSales) * 120}
            r="4"
            fill="#3b82f6"
          />
        ))}
        
        {/* Month labels */}
        {monthlySalesTrend.map((month, i) => (
          <text
            key={i}
            x={50 + (i * 700) / (monthlySalesTrend.length - 1)}
            y="190"
            textAnchor="middle"
            className="text-xs fill-current"
            transform={`rotate(-45 ${50 + (i * 700) / (monthlySalesTrend.length - 1)} 190)`}
          >
            {month.month.split(' ')[0]}
          </text>
        ))}
      </svg>
    </div>
  );
}

// Customer Segmentation Pie Chart
function CustomerSegmentationChart({ vip, highValue, risk }: { vip: number; highValue: number; risk: number }) {
  const total = vip + highValue + risk;
  const vipAngle = (vip / total) * 360;
  const highValueAngle = (highValue / total) * 360;
  const riskAngle = (risk / total) * 360;
  
  return (
    <div className="w-32 h-32 relative">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#10b981"
          strokeWidth="20"
          strokeDasharray={`${(vipAngle / 360) * 251.2} 251.2`}
          strokeDashoffset="0"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="20"
          strokeDasharray={`${(highValueAngle / 360) * 251.2} 251.2`}
          strokeDashoffset={`-${(vipAngle / 360) * 251.2}`}
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#ef4444"
          strokeWidth="20"
          strokeDasharray={`${(riskAngle / 360) * 251.2} 251.2`}
          strokeDashoffset={`-${((vipAngle + highValueAngle) / 360) * 251.2}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold">{formatNumber(total)}</div>
          <div className="text-xs text-muted-foreground">إجمالي</div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [orders, setOrders] = useState<SalesOrder[]>(salesOrders);
  const [salesRep, setSalesRep] = useState<string | "">("");
  const [status, setStatus] = useState<string | "">("");
  const [customer, setCustomer] = useState<string | "">("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showEditOrderModal, setShowEditOrderModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<SalesOrder | null>(null);
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [newOrder, setNewOrder] = useState({
    customer: "",
    salesRep: "",
    status: "قيد التنفيذ" as SalesOrder["status"],
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: "",
    branch: "الرياض" as "الرياض" | "جدة" | "الدمام" | "مكة",
    items: [{ product: "", quantity: 1, unitPrice: 0 }]
  });

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSalesRep = salesRep ? order.salesRep === salesRep : true;
      const matchesStatus = status ? order.status === status : true;
      const matchesCustomer = customer ? order.customer.includes(customer) : true;
      let matchesRange = true;
      if (fromDate || toDate) {
        const d = new Date(order.orderDate);
        const start = fromDate ? new Date(fromDate) : null;
        const end = toDate ? new Date(toDate) : null;
        if (start && d < start) matchesRange = false;
        if (end) {
          const endInclusive = new Date(end.getFullYear(), end.getMonth(), end.getDate() + 1);
          if (d >= endInclusive) matchesRange = false;
        }
      }
      return matchesSalesRep && matchesStatus && matchesCustomer && matchesRange;
    });
  }, [orders, salesRep, status, customer, fromDate, toDate]);

  const metrics = useMemo(() => {
    const orders = filteredOrders;
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    const completedOrders = orders.filter(o => o.status === "مكتمل").length;
    const pendingOrders = orders.filter(o => o.status === "قيد التنفيذ" || o.status === "بانتظار التسليم").length;
    const totalProfit = orders.reduce((sum, order) => sum + (order.total * order.profitMargin), 0);
    const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
    
    // Customer classification breakdown
    const vipOrders = orders.filter(o => o.customerClassification === "VIP");
    const highValueOrders = orders.filter(o => o.customerClassification === "High Value");
    const riskOrders = orders.filter(o => o.customerClassification === "Risk");
    
    const vipSales = vipOrders.reduce((sum, o) => sum + o.total, 0);
    const highValueSales = highValueOrders.reduce((sum, o) => sum + o.total, 0);
    const riskSales = riskOrders.reduce((sum, o) => sum + o.total, 0);

    return { 
      totalSales, 
      totalOrders, 
      avgOrderValue, 
      completedOrders, 
      pendingOrders, 
      totalProfit, 
      profitMargin,
      vipSales,
      highValueSales,
      riskSales,
      vipCount: vipOrders.length,
      highValueCount: highValueOrders.length,
      riskCount: riskOrders.length
    };
  }, [filteredOrders]);

  const overdueInvoices = useMemo(() => {
    return invoices.filter(invoice => invoice.status === "متأخر").slice(0, 8);
  }, []);

  const uniqueSalesReps = useMemo(() => {
    const reps = new Set(orders.map(o => o.salesRep));
    return Array.from(reps);
  }, [orders]);

  const uniqueCustomers = useMemo(() => {
    const customers = new Set(orders.map(o => o.customer));
    return Array.from(customers);
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Top Metrics - 8 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/15 text-primary border border-primary/20">
              <ShoppingCart size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">إجمالي المبيعات</div>
              <div className="text-xl font-semibold">{formatSAR(metrics.totalSales)}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">
              <TrendingUp size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">متوسط قيمة الطلب</div>
              <div className="text-xl font-semibold">{formatSAR(metrics.avgOrderValue)}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/15 text-violet-500 border border-violet-500/20">
              <Percent size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">هامش الربح الإجمالي</div>
              <div className="text-xl font-semibold">{metrics.profitMargin.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/15 text-amber-500 border border-amber-500/20">
              <Clock size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">عدد الطلبات المفتوحة</div>
              <div className="text-xl font-semibold">{formatNumber(metrics.pendingOrders)}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/15 text-sky-500 border border-sky-500/20">
              <CheckCircle size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">الطلبات المكتملة</div>
              <div className="text-xl font-semibold">{formatNumber(metrics.completedOrders)}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/15 text-indigo-500 border border-indigo-500/20">
              <DollarSign size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">إجمالي الأرباح</div>
              <div className="text-xl font-semibold">{formatSAR(metrics.totalProfit)}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/15 text-rose-500 border border-rose-500/20">
              <AlertTriangle size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">فواتير متأخرة</div>
              <div className="text-xl font-semibold">{formatNumber(overdueInvoices.length)}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">
              <Target size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">معدل الإنجاز</div>
              <div className="text-xl font-semibold">{metrics.totalOrders > 0 ? Math.round((metrics.completedOrders / metrics.totalOrders) * 100) : 0}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
        <h1 className="text-xl font-semibold">المبيعات</h1>
        <div className="flex flex-wrap gap-2">
          <input
            className="px-3 py-2 rounded-md border border-border bg-card text-sm w-full sm:w-72 md:w-96 lg:w-[32rem]"
            placeholder="بحث بالعميل"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          />
          <select
            className="px-3 py-2 rounded-md border border-border bg-card text-sm"
            value={salesRep}
            onChange={(e) => setSalesRep(e.target.value)}
          >
            <option value="">كل مندوبي المبيعات</option>
            {uniqueSalesReps.map(rep => <option key={rep} value={rep}>{rep}</option>)}
          </select>
          <select
            className="px-3 py-2 rounded-md border border-border bg-card text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">كل الحالات</option>
            <option value="قيد التنفيذ">قيد التنفيذ</option>
            <option value="مكتمل">مكتمل</option>
            <option value="بانتظار التسليم">بانتظار التسليم</option>
            <option value="ملغي">ملغي</option>
            <option value="معلق">معلق</option>
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
            onClick={() => setShowAddOrderModal(true)}
          >
            إضافة طلبية جديدة
          </button>
        </div>
      </div>

      {/* Analytical Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Panel 1: Sales Trend Chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 size={20} />
              المبيعات الشهرية
            </h3>
            <div className="text-sm text-muted-foreground">آخر 12 شهر</div>
          </div>
          <SalesTrendChart />
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-semibold text-emerald-500">{formatSAR(monthlySalesTrend[monthlySalesTrend.length - 1].sales)}</div>
              <div className="text-xs text-muted-foreground">هذا الشهر</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-blue-500">{formatNumber(monthlySalesTrend[monthlySalesTrend.length - 1].orders)}</div>
              <div className="text-xs text-muted-foreground">عدد الطلبات</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-violet-500">{formatSAR(monthlySalesTrend[monthlySalesTrend.length - 1].profit)}</div>
              <div className="text-xs text-muted-foreground">الربح</div>
            </div>
          </div>
        </div>

        {/* Panel 2: Customer Segmentation */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <PieChart size={20} />
              توزيع المبيعات حسب تصنيف العميل
            </h3>
          </div>
          <div className="flex items-center justify-center mb-4">
            <CustomerSegmentationChart 
              vip={metrics.vipCount} 
              highValue={metrics.highValueCount} 
              risk={metrics.riskCount} 
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-medium">VIP</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatSAR(metrics.vipSales)}</div>
                <div className="text-xs text-muted-foreground">{formatNumber(metrics.vipCount)} طلبية</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium">High Value</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatSAR(metrics.highValueSales)}</div>
                <div className="text-xs text-muted-foreground">{formatNumber(metrics.highValueCount)} طلبية</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <span className="text-sm font-medium">Risk</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatSAR(metrics.riskSales)}</div>
                <div className="text-xs text-muted-foreground">{formatNumber(metrics.riskCount)} طلبية</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel 3: Overdue Collections */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle size={20} className="text-rose-500" />
            فواتير متأخرة - متابعة فورية
          </h3>
          <div className="text-sm text-muted-foreground">أولوية عالية</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {overdueInvoices.map((invoice, i) => (
            <div key={i} className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium text-sm">{invoice.customer}</div>
                  <div className="text-xs text-muted-foreground">{invoice.id}</div>
                </div>
                <span className={`px-2 py-1 text-[10px] rounded-md border ${classificationTag(invoice.customerClassification)}`}>
                  {invoice.customerClassification}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">المبلغ</span>
                  <span className="font-semibold text-sm">{formatSAR(invoice.amount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">متأخر</span>
                  <span className="text-rose-500 font-semibold text-sm">{invoice.overdueDays} يوم</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">مندوب المبيعات</span>
                  <span className="text-xs">{invoice.salesRep}</span>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="flex-1 px-2 py-1 rounded-md border border-rose-500/40 text-rose-600 dark:text-rose-300 hover:bg-rose-500/10 text-xs">
                  <Phone size={12} className="inline mr-1" />
                  اتصال
                </button>
                <button 
                  className="flex-1 px-2 py-1 rounded-md border border-blue-500/40 text-blue-600 dark:text-blue-300 hover:bg-blue-500/10 text-xs"
                  onClick={() => {
                    setSelectedInvoice(invoice);
                    setShowInvoiceModal(true);
                  }}
                >
                  <Eye size={12} className="inline mr-1" />
                  عرض
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Activity size={20} />
            الطلبات الأخيرة
          </h3>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="p-3 text-right">رقم الطلبية</th>
                <th className="p-3 text-right">العميل</th>
                <th className="p-3 text-right">مندوب المبيعات</th>
                <th className="p-3 text-right">الحالة</th>
                <th className="p-3 text-right">المبلغ</th>
                <th className="p-3 text-right">هامش الربح</th>
                <th className="p-3 text-right">تاريخ الطلب</th>
                <th className="p-3 text-right">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.slice(0, 10).map((order, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="p-3 font-mono text-xs">{order.id}</td>
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{order.customer}</div>
                      <span className={`px-2 py-1 text-[10px] rounded-md border ${classificationTag(order.customerClassification)}`}>
                        {order.customerClassification}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">{order.salesRep}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-[11px] rounded-md border ${statusTag(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 font-semibold">{formatSAR(order.total)}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <span className="text-emerald-500 font-semibold">{(order.profitMargin * 100).toFixed(1)}%</span>
                      <span className="text-xs text-muted-foreground">({formatSAR(order.total * order.profitMargin)})</span>
                    </div>
                  </td>
                  <td className="p-3">{order.orderDate}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1.5 rounded-md border border-sky-400/40 text-sky-600 dark:text-sky-300 hover:bg-sky-500/10"
                        title="عرض"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-1.5 rounded-md border border-amber-400/40 text-amber-600 dark:text-amber-300 hover:bg-amber-500/10"
                        title="تعديل"
                        onClick={() => {
                          setEditingOrder(order);
                          setShowEditOrderModal(true);
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="p-1.5 rounded-md border border-rose-400/40 text-rose-600 dark:text-rose-300 hover:bg-rose-500/10"
                        title="حذف"
                        onClick={() => {
                          if (window.confirm(`هل تريد حذف الطلبية ${order.id} نهائيًا؟`)) {
                            setOrders(prev => prev.filter(o => o.id !== order.id));
                            if (selectedOrder?.id === order.id) {
                              setShowOrderModal(false);
                              setSelectedOrder(null);
                            }
                          }
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
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowOrderModal(false)} />
          <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-4xl rounded-xl border border-border bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="text-xl font-semibold">تفاصيل الطلبية - {selectedOrder.id}</div>
              <button className="px-4 py-2 rounded-md border border-border hover:bg-muted text-sm" onClick={() => setShowOrderModal(false)}>إغلاق</button>
            </div>
            
            {/* Order Header */}
            <div className="rounded-lg border border-border bg-muted/30 p-4 mb-6">
              <h3 className="text-lg font-semibold mb-4">معلومات الطلبية</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">رقم الطلب</label>
                  <div className="font-mono font-semibold text-primary">{selectedOrder.id}</div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">العميل</label>
                  <div className="font-medium">{selectedOrder.customer}</div>
                  <span className={`inline-block px-2 py-1 text-[10px] rounded-md border mt-1 ${classificationTag(selectedOrder.customerClassification)}`}>
                    {selectedOrder.customerClassification}
                  </span>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">تاريخ الطلب</label>
                  <div className="font-medium">{selectedOrder.orderDate}</div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">إجمالي الفاتورة</label>
                  <div className="font-bold text-xl text-primary">{formatSAR(selectedOrder.total)}</div>
                </div>
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">مندوب المبيعات</label>
                  <div className="font-medium">{selectedOrder.salesRep}</div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">الفرع</label>
                  <div className="font-medium">{selectedOrder.branch}</div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">تاريخ التسليم المتوقع</label>
                  <div className="font-medium">{selectedOrder.deliveryDate}</div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">حالة الطلب</label>
                  <div>
                    <span className={`px-3 py-1 text-sm rounded-md border ${statusTag(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">هامش الربح</label>
                  <div className="font-semibold text-emerald-500 text-lg">{(selectedOrder.profitMargin * 100).toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">({formatSAR(selectedOrder.total * selectedOrder.profitMargin)})</div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">عدد الأصناف</label>
                  <div className="font-medium">{selectedOrder.items}</div>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="rounded-lg border border-border bg-card">
              <div className="p-4 border-b border-border">
                <h3 className="text-lg font-semibold">أصناف الطلبية</h3>
              </div>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="p-3 text-right">المنتج</th>
                      <th className="p-3 text-right">الكمية</th>
                      <th className="p-3 text-right">سعر الوحدة</th>
                      <th className="p-3 text-right">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Mock line items - in real app, this would come from the order data */}
                    {Array.from({ length: selectedOrder.items }, (_, i) => {
                      const mockProducts = [
                        "قفازات فحص نيتريل", "كمامات جراحية", "محاليل تعقيم", "قسطرة قلبية", 
                        "جهاز قياس الضغط", "ميزان حرارة رقمي", "سماعة طبية", "مصباح طبي"
                      ];
                      const product = mockProducts[i % mockProducts.length];
                      const quantity = Math.floor(Math.random() * 10) + 1;
                      const unitPrice = Math.floor(Math.random() * 500) + 50;
                      const total = quantity * unitPrice;
                      
                      return (
                        <tr key={i} className="border-t border-border">
                          <td className="p-3 font-medium">{product}</td>
                          <td className="p-3">{formatNumber(quantity)}</td>
                          <td className="p-3">{formatSAR(unitPrice)}</td>
                          <td className="p-3 font-semibold">{formatSAR(total)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-muted/50">
                    <tr>
                      <td colSpan={3} className="p-3 text-right font-semibold">الإجمالي</td>
                      <td className="p-3 font-bold text-lg text-primary">{formatSAR(selectedOrder.total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Payment Status (if applicable) */}
            {(() => {
              const relatedInvoice = invoices.find(inv => inv.customer === selectedOrder.customer && Math.abs(new Date(inv.invoiceDate).getTime() - new Date(selectedOrder.orderDate).getTime()) < 7 * 24 * 60 * 60 * 1000);
              if (relatedInvoice) {
                return (
                  <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
                    <h3 className="text-lg font-semibold mb-3">حالة الدفع</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-muted-foreground mb-1">رقم الفاتورة</label>
                        <div className="font-mono font-semibold">{relatedInvoice.id}</div>
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-1">حالة الدفع</label>
                        <div>
                          <span className={`px-3 py-1 text-sm rounded-md border ${paymentStatusTag(relatedInvoice.status)}`}>
                            {relatedInvoice.status}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-1">تاريخ الاستحقاق</label>
                        <div className="font-medium">{relatedInvoice.dueDate}</div>
                        {relatedInvoice.overdueDays > 0 && (
                          <div className="text-rose-500 text-sm">متأخر {relatedInvoice.overdueDays} يوم</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <button
                onClick={() => setShowOrderModal(false)}
                className="px-6 py-2 rounded-md border border-border bg-card text-sm hover:bg-muted"
              >
                إغلاق
              </button>
              <button className="px-6 py-2 rounded-md border border-primary bg-primary text-primary-foreground text-sm hover:bg-primary/90">
                طباعة الطلبية
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Order Modal */}
      {showAddOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddOrderModal(false)} />
          <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-4xl rounded-xl border border-border bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">إضافة طلبية جديدة</h2>
              <button className="px-2 py-1 rounded-md border border-border hover:bg-muted text-xs" onClick={() => setShowAddOrderModal(false)}>إغلاق</button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const total = newOrder.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
              const orderData = {
                ...newOrder,
                total,
                profitMargin: 0.20, // Default profit margin
                items: newOrder.items.length
              };
              const newIdSuffix = Math.floor(Math.random() * 90000) + 10000;
              const newId = `SO-${newIdSuffix}`;
              const customerClassification = ((): SalesOrder["customerClassification"] => {
                const base = customers.find(c => c.name === newOrder.customer)?.classification;
                return (base || "High Value") as SalesOrder["customerClassification"];
              })();
              const created: SalesOrder = {
                id: newId,
                customer: newOrder.customer,
                customerClassification,
                salesRep: newOrder.salesRep as SalesOrder["salesRep"],
                status: newOrder.status,
                total: orderData.total,
                profitMargin: 0.20,
                orderDate: newOrder.orderDate,
                deliveryDate: newOrder.deliveryDate,
                items: newOrder.items.length,
                branch: newOrder.branch
              };
              setOrders(prev => [created, ...prev]);
              setShowAddOrderModal(false);
              // Reset form
              setNewOrder({
                customer: "",
                salesRep: "",
                status: "قيد التنفيذ",
                orderDate: new Date().toISOString().split('T')[0],
                deliveryDate: "",
                branch: "الرياض",
                items: [{ product: "", quantity: 1, unitPrice: 0 }]
              });
            }} className="space-y-6">
              
              {/* Order Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="customer" className="block text-sm font-medium text-foreground mb-1">العميل *</label>
                  <select
                    id="customer"
                    value={newOrder.customer}
                    onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm"
                    required
                  >
                    <option value="">اختر العميل</option>
                    {uniqueCustomers.map(customer => (
                      <option key={customer} value={customer}>{customer}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="salesRep" className="block text-sm font-medium text-foreground mb-1">مندوب المبيعات *</label>
                  <select
                    id="salesRep"
                    value={newOrder.salesRep}
                    onChange={(e) => setNewOrder({...newOrder, salesRep: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm"
                    required
                  >
                    <option value="">اختر مندوب المبيعات</option>
                    {uniqueSalesReps.map(rep => (
                      <option key={rep} value={rep}>{rep}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="orderDate" className="block text-sm font-medium text-foreground mb-1">تاريخ الطلب *</label>
                  <input
                    type="date"
                    id="orderDate"
                    value={newOrder.orderDate}
                    onChange={(e) => setNewOrder({...newOrder, orderDate: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="deliveryDate" className="block text-sm font-medium text-foreground mb-1">تاريخ التسليم المتوقع</label>
                  <input
                    type="date"
                    id="deliveryDate"
                    value={newOrder.deliveryDate}
                    onChange={(e) => setNewOrder({...newOrder, deliveryDate: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-foreground mb-1">حالة الطلب *</label>
                  <select
                    id="status"
                    value={newOrder.status}
                    onChange={(e) => setNewOrder({...newOrder, status: e.target.value as SalesOrder["status"]})}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm"
                    required
                  >
                    <option value="قيد التنفيذ">قيد التنفيذ</option>
                    <option value="مكتمل">مكتمل</option>
                    <option value="بانتظار التسليم">بانتظار التسليم</option>
                    <option value="معلق">معلق</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="branch" className="block text-sm font-medium text-foreground mb-1">الفرع *</label>
                  <select
                    id="branch"
                    value={newOrder.branch}
                    onChange={(e) => setNewOrder({...newOrder, branch: e.target.value as "الرياض" | "جدة" | "الدمام" | "مكة"})}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm"
                    required
                  >
                    <option value="الرياض">الرياض</option>
                    <option value="جدة">جدة</option>
                    <option value="الدمام">الدمام</option>
                    <option value="مكة">مكة</option>
                  </select>
                </div>
              </div>

              {/* Items Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">الأصناف</h3>
                  <button
                    type="button"
                    onClick={() => setNewOrder({
                      ...newOrder,
                      items: [...newOrder.items, { product: "", quantity: 1, unitPrice: 0 }]
                    })}
                    className="px-3 py-1.5 rounded-md border border-primary bg-primary text-primary-foreground text-sm"
                  >
                    إضافة صنف
                  </button>
                </div>
                
                <div className="space-y-3">
                  {newOrder.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 rounded-lg border border-border bg-muted/30">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">اسم المنتج *</label>
                        <input
                          type="text"
                          value={item.product}
                          onChange={(e) => {
                            const newItems = [...newOrder.items];
                            newItems[index].product = e.target.value;
                            setNewOrder({...newOrder, items: newItems});
                          }}
                          className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm"
                          placeholder="اسم المنتج"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">الكمية *</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const newItems = [...newOrder.items];
                            newItems[index].quantity = parseInt(e.target.value) || 1;
                            setNewOrder({...newOrder, items: newItems});
                          }}
                          className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">سعر الوحدة (ريال) *</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => {
                            const newItems = [...newOrder.items];
                            newItems[index].unitPrice = parseFloat(e.target.value) || 0;
                            setNewOrder({...newOrder, items: newItems});
                          }}
                          className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm"
                          required
                        />
                      </div>
                      
                      <div className="flex items-end">
                        <div className="w-full">
                          <label className="block text-sm font-medium text-foreground mb-1">المجموع</label>
                          <div className="px-3 py-2 rounded-md border border-border bg-muted text-sm font-semibold">
                            {formatSAR(item.quantity * item.unitPrice)}
                          </div>
                        </div>
                        {newOrder.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = newOrder.items.filter((_, i) => i !== index);
                              setNewOrder({...newOrder, items: newItems});
                            }}
                            className="ml-2 p-2 rounded-md border border-rose-500/40 text-rose-600 dark:text-rose-300 hover:bg-rose-500/10"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <h3 className="text-lg font-semibold mb-3">ملخص الطلبية</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">عدد الأصناف</label>
                    <div className="text-lg font-semibold">{newOrder.items.length}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">إجمالي الكمية</label>
                    <div className="text-lg font-semibold">{newOrder.items.reduce((sum, item) => sum + item.quantity, 0)}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">الإجمالي</label>
                    <div className="text-2xl font-bold text-primary">
                      {formatSAR(newOrder.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddOrderModal(false)}
                  className="px-6 py-2 rounded-md border border-border bg-card text-sm hover:bg-muted"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-md border border-primary bg-primary text-primary-foreground text-sm hover:bg-primary/90"
                >
                  إضافة الطلبية
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Details Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowInvoiceModal(false)} />
          <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-4xl rounded-xl border border-border bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="text-xl font-semibold">تفاصيل الفاتورة - {selectedInvoice.id}</div>
              <button className="px-4 py-2 rounded-md border border-border hover:bg-muted text-sm" onClick={() => setShowInvoiceModal(false)}>إغلاق</button>
            </div>
            
            {/* Invoice Header */}
            <div className="rounded-lg border border-border bg-muted/30 p-4 mb-6">
              <h3 className="text-lg font-semibold mb-4">معلومات الفاتورة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">رقم الفاتورة</label>
                  <div className="font-mono font-semibold text-primary">{selectedInvoice.id}</div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">العميل</label>
                  <div className="font-medium">{selectedInvoice.customer}</div>
                  <span className={`inline-block px-2 py-1 text-[10px] rounded-md border mt-1 ${classificationTag(selectedInvoice.customerClassification)}`}>
                    {selectedInvoice.customerClassification}
                  </span>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">تاريخ الفاتورة</label>
                  <div className="font-medium">{selectedInvoice.invoiceDate}</div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">مبلغ الفاتورة</label>
                  <div className="font-bold text-xl text-primary">{formatSAR(selectedInvoice.amount)}</div>
                </div>
              </div>
            </div>

            {/* Invoice Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">مندوب المبيعات</label>
                  <div className="font-medium">{selectedInvoice.salesRep}</div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">الفرع</label>
                  <div className="font-medium">{selectedInvoice.branch}</div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">تاريخ الاستحقاق</label>
                  <div className="font-medium">{selectedInvoice.dueDate}</div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">حالة الدفع</label>
                  <div>
                    <span className={`px-3 py-1 text-sm rounded-md border ${paymentStatusTag(selectedInvoice.status)}`}>
                      {selectedInvoice.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">أيام التأخير</label>
                  <div className={`font-semibold text-lg ${selectedInvoice.overdueDays > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {selectedInvoice.overdueDays > 0 ? `${selectedInvoice.overdueDays} يوم` : 'غير متأخر'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">نوع الدفع</label>
                  <div className="font-medium">
                    {selectedInvoice.status === "أقساط تمارا" ? "أقساط تمارا" : 
                     selectedInvoice.status === "أقساط تابي" ? "أقساط تابي" : 
                     selectedInvoice.status === "مدفوع" ? "نقدي/تحويل" : "غير محدد"}
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Items Table */}
            <div className="rounded-lg border border-border bg-card">
              <div className="p-4 border-b border-border">
                <h3 className="text-lg font-semibold">أصناف الفاتورة</h3>
              </div>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="p-3 text-right">المنتج</th>
                      <th className="p-3 text-right">الكمية</th>
                      <th className="p-3 text-right">سعر الوحدة</th>
                      <th className="p-3 text-right">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Mock invoice items - in real app, this would come from the invoice data */}
                    {Array.from({ length: Math.floor(selectedInvoice.amount / 10000) + 1 }, (_, i) => {
                      const mockProducts = [
                        "قفازات فحص نيتريل", "كمامات جراحية", "محاليل تعقيم", "قسطرة قلبية", 
                        "جهاز قياس الضغط", "ميزان حرارة رقمي", "سماعة طبية", "مصباح طبي"
                      ];
                      const product = mockProducts[i % mockProducts.length];
                      const quantity = Math.floor(Math.random() * 10) + 1;
                      const unitPrice = Math.floor(Math.random() * 500) + 50;
                      const total = quantity * unitPrice;
                      
                      return (
                        <tr key={i} className="border-t border-border">
                          <td className="p-3 font-medium">{product}</td>
                          <td className="p-3">{formatNumber(quantity)}</td>
                          <td className="p-3">{formatSAR(unitPrice)}</td>
                          <td className="p-3 font-semibold">{formatSAR(total)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-muted/50">
                    <tr>
                      <td colSpan={3} className="p-3 text-right font-semibold">الإجمالي</td>
                      <td className="p-3 font-bold text-lg text-primary">{formatSAR(selectedInvoice.amount)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Payment Actions */}
            <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
              <h3 className="text-lg font-semibold mb-3">إجراءات الدفع</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">المبلغ المستحق</div>
                  <div className="font-bold text-xl text-primary">{formatSAR(selectedInvoice.amount)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">حالة التحصيل</div>
                  <div className={`font-semibold ${selectedInvoice.status === "مدفوع" ? "text-emerald-500" : "text-rose-500"}`}>
                    {selectedInvoice.status === "مدفوع" ? "تم التحصيل" : "لم يتم التحصيل"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">أولوية المتابعة</div>
                  <div className={`font-semibold ${selectedInvoice.overdueDays > 30 ? "text-rose-500" : selectedInvoice.overdueDays > 0 ? "text-amber-500" : "text-emerald-500"}`}>
                    {selectedInvoice.overdueDays > 30 ? "عاجل" : selectedInvoice.overdueDays > 0 ? "متوسط" : "عادي"}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="px-6 py-2 rounded-md border border-border bg-card text-sm hover:bg-muted"
              >
                إغلاق
              </button>
              <button className="px-6 py-2 rounded-md border border-amber-500 bg-amber-500 text-white text-sm hover:bg-amber-600">
                إرسال تذكير
              </button>
              <button className="px-6 py-2 rounded-md border border-emerald-500 bg-emerald-500 text-white text-sm hover:bg-emerald-600">
                تسجيل دفعة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditOrderModal && editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowEditOrderModal(false)} />
          <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-3xl rounded-xl border border-border bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">تعديل الطلبية - {editingOrder.id}</h2>
              <button className="px-2 py-1 rounded-md border border-border hover:bg-muted text-xs" onClick={() => setShowEditOrderModal(false)}>إغلاق</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setOrders(prev => prev.map(o => o.id === editingOrder.id ? editingOrder : o));
              if (selectedOrder && selectedOrder.id === editingOrder.id) {
                setSelectedOrder(editingOrder);
              }
              setShowEditOrderModal(false);
            }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">العميل</label>
                  <input disabled value={editingOrder.customer} className="w-full px-3 py-2 rounded-md border border-border bg-muted text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">مندوب المبيعات</label>
                  <select
                    value={editingOrder.salesRep}
                    onChange={(e) => setEditingOrder({ ...editingOrder, salesRep: e.target.value as SalesOrder["salesRep"] })}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm"
                  >
                    {uniqueSalesReps.map(rep => (
                      <option key={rep} value={rep}>{rep}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">الحالة</label>
                  <select
                    value={editingOrder.status}
                    onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value as SalesOrder["status"] })}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm"
                  >
                    <option value="قيد التنفيذ">قيد التنفيذ</option>
                    <option value="مكتمل">مكتمل</option>
                    <option value="بانتظار التسليم">بانتظار التسليم</option>
                    <option value="ملغي">ملغي</option>
                    <option value="معلق">معلق</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">الفرع</label>
                  <select
                    value={editingOrder.branch}
                    onChange={(e) => setEditingOrder({ ...editingOrder, branch: e.target.value as SalesOrder["branch"] })}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm"
                  >
                    <option value="الرياض">الرياض</option>
                    <option value="جدة">جدة</option>
                    <option value="الدمام">الدمام</option>
                    <option value="مكة">مكة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">تاريخ الطلب</label>
                  <input
                    type="date"
                    value={editingOrder.orderDate}
                    onChange={(e) => setEditingOrder({ ...editingOrder, orderDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">تاريخ التسليم المتوقع</label>
                  <input
                    type="date"
                    value={editingOrder.deliveryDate}
                    onChange={(e) => setEditingOrder({ ...editingOrder, deliveryDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">المبلغ</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingOrder.total}
                    onChange={(e) => setEditingOrder({ ...editingOrder, total: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">عدد الأصناف</label>
                  <input
                    type="number"
                    min="1"
                    value={editingOrder.items}
                    onChange={(e) => setEditingOrder({ ...editingOrder, items: Math.max(1, parseInt(e.target.value) || editingOrder.items) })}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button type="button" onClick={() => setShowEditOrderModal(false)} className="px-6 py-2 rounded-md border border-border bg-card text-sm hover:bg-muted">إلغاء</button>
                <button type="submit" className="px-6 py-2 rounded-md border border-primary bg-primary text-primary-foreground text-sm hover:bg-primary/90">حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}