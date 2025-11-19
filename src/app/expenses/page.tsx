"use client";

import { useMemo, useState } from "react";
import { expenses, monthlyBudgets, type Expense, type ExpenseCategory, type ExpenseStatus } from "@/lib/mockData";
import { formatSAR, formatNumber } from "@/lib/format";
import { Eye, Trash2, Pencil, Plus } from "lucide-react";

export default function Page() {
  const [expenseList, setExpenseList] = useState<Expense[]>(expenses);
  const [status, setStatus] = useState<string | "">("");
  const [category, setCategory] = useState<string | "">("");
  const [query, setQuery] = useState("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [showExpense, setShowExpense] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Form states for new expense
  const [newExpense, setNewExpense] = useState({
    description: "",
    category: "" as ExpenseCategory,
    channel: "تحويل بنكي" as const,
    amount: "",
    vendor: "",
    department: "",
    approvedBy: "",
    dueDate: ""
  });

  // Derived aggregates
  const filtered = useMemo(() => {
    return expenseList.filter((exp) => {
      const matchesQuery = [exp.id, exp.description, exp.vendor].some((v) => v.includes(query));
      const matchesStatus = status ? exp.status === status : true;
      const matchesCategory = category ? exp.category === category : true;
      let matchesRange = true;
      if (fromDate || toDate) {
        const d = new Date(exp.expenseDate);
        const start = fromDate ? new Date(fromDate) : null;
        const end = toDate ? new Date(toDate) : null;
        if (start && d < start) matchesRange = false;
        if (end) {
          const endInclusive = new Date(end.getFullYear(), end.getMonth(), end.getDate() + 1);
          if (d >= endInclusive) matchesRange = false;
        }
      }
      return matchesQuery && matchesStatus && matchesCategory && matchesRange;
    });
  }, [expenseList, status, category, query, fromDate, toDate]);

  // Reset to first page when filters/search change
  useMemo(() => { setPage(1); return null; }, [status, category, query, fromDate, toDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const totals = useMemo(() => {
    const list = filtered;
    const todayStr = new Date().toISOString().slice(0, 10);
    const todaysExpense = list.filter(i => i.expenseDate === todayStr).reduce((s, i) => s + i.amount, 0);
    const paidExpenses = list.filter(i => i.status === "مدفوع").reduce((s, i) => s + i.amount, 0);
    const dueExpenses = list.filter(i => i.status === "مستحق" || i.status === "متأخر").reduce((s, i) => s + i.amount, 0);
    const totalBudget = monthlyBudgets.reduce((s, b) => s + b.budget, 0);
    const totalSpent = monthlyBudgets.reduce((s, b) => s + b.spent, 0);
    const remainingBudget = totalBudget - totalSpent;
    return { todaysExpense, paidExpenses, dueExpenses, remainingBudget };
  }, [filtered]);

  // 6-month expenses trend (all expenses)
  const sixMonthTrend = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }).map((_, idx) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      // Arabic month short names
      const monthNames = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
      return { key, label: `${monthNames[d.getMonth()]} ${String(d.getFullYear())}` };
    });
    const sums = months.map(m => {
      const sum = expenseList.reduce((acc, e) => {
        const ym = e.expenseDate.slice(0, 7);
        return acc + (ym === m.key ? e.amount : 0);
      }, 0);
      return { label: m.label, value: sum };
    });
    return sums;
  }, [expenseList]);

  // Branch expense comparison (deterministic assignment for visualization)
  const branchComparison = useMemo(() => {
    const branches = ["الرياض", "مكة", "الدمام", "جدة"] as const;
    const totalsBy = new Map<string, number>(branches.map(b => [b, 0]));
    for (const e of expenseList) {
      const num = parseInt(e.id.replace(/\D/g, "")) || 0;
      const branch = branches[num % branches.length];
      totalsBy.set(branch, (totalsBy.get(branch) || 0) + e.amount);
    }
    return branches.map(b => ({ name: b, value: totalsBy.get(b) || 0 }));
  }, [expenseList]);

  // Expense by Category
  const categoryExpenses = useMemo(() => {
    const map = new Map<string, number>();
    for (const exp of filtered) {
      map.set(exp.category, (map.get(exp.category) || 0) + exp.amount);
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  // Expense by Channel
  const channelExpenses = useMemo(() => {
    const map = new Map<string, number>();
    for (const exp of filtered) {
      map.set(exp.channel, (map.get(exp.channel) || 0) + exp.amount);
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  // Budget Status
  const budgetStatus = useMemo(() => {
    return monthlyBudgets.map(budget => ({
      ...budget,
      percentage: Math.round((budget.spent / budget.budget) * 100),
      status: budget.spent > budget.budget ? "exceeded" : budget.spent > budget.budget * 0.8 ? "warning" : "good"
    }));
  }, []);

  function openExpenseModal() {
    setNewExpense({
      description: "",
      category: "رواتب",
      channel: "تحويل بنكي",
      amount: "",
      vendor: "",
      department: "المالية",
      approvedBy: "",
      dueDate: ""
    });
    setShowExpense(true);
  }

  function handleCreateExpense(e: React.FormEvent) {
    e.preventDefault();
    const now = new Date();
    const newExp: Expense = {
      id: `EXP-${String(expenseList.length + 1).padStart(4, '0')}`,
      description: newExpense.description,
      category: newExpense.category,
      channel: newExpense.channel,
      amount: parseFloat(newExpense.amount) || 0,
      status: "مستحق",
      expenseDate: now.toISOString().slice(0, 10),
      dueDate: newExpense.dueDate,
      vendor: newExpense.vendor,
      department: newExpense.department,
      approvedBy: newExpense.approvedBy
    };
    setExpenseList(prev => [...prev, newExp]);
    setShowExpense(false);
  }

  function handleDeleteExpense(id: string) {
    if (window.confirm("هل أنت متأكد من حذف هذا المصروف؟")) {
      setExpenseList(prev => prev.filter(exp => exp.id !== id));
      if (showExpenseModal) setShowExpenseModal(false);
    }
  }

  function handleEditExpense(expense: Expense) {
    setEditingExpense(expense);
    setShowExpenseModal(true);
  }

  function handleUpdateExpense(updatedExpense: Expense) {
    setExpenseList(prev => prev.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp));
    setShowExpenseModal(false);
    setEditingExpense(null);
  }

  return (
    <div className="space-y-6">
      {/* Header + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <h1 className="text-2xl font-semibold">المصروفات والتكاليف</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            className="px-3 py-2 rounded-md border border-border bg-card text-sm w-full sm:w-72"
            placeholder="بحث برقم المصروف أو الوصف"
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
            <option value="مستحق">مستحق</option>
            <option value="متأخر">متأخر</option>
            <option value="ملغي">ملغي</option>
          </select>
          <select
            className="px-3 py-2 rounded-md border border-border bg-card text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">كل الفئات</option>
            <option value="رواتب">رواتب</option>
            <option value="إيجار">إيجار</option>
            <option value="تسويق">تسويق</option>
            <option value="معدات">معدات</option>
            <option value="نقل">نقل</option>
            <option value="مرافق">مرافق</option>
            <option value="صيانة">صيانة</option>
            <option value="تدريب">تدريب</option>
            <option value="تأمين">تأمين</option>
            <option value="أخرى">أخرى</option>
          </select>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">من</label>
            <input type="date" className="px-3 py-2 rounded-md border border-border bg-card text-sm" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            <label className="text-xs text-muted-foreground">إلى</label>
            <input type="date" className="px-3 py-2 rounded-md border border-border bg-card text-sm" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
          <button className="px-3 py-2 rounded-md border border-primary bg-primary text-primary-foreground text-sm flex items-center gap-1" onClick={openExpenseModal}>
            <Plus size={14} /> إضافة مصروف
          </button>
        </div>
      </div>

      {/* Top Metrics */
      }
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="مصروف اليوم" value={formatSAR(totals.todaysExpense)} accent="from-rose-500/20 to-rose-500/5" />
        <MetricCard title="إجمالي المصروفات (مدفوع)" value={formatSAR(totals.paidExpenses)} accent="from-green-500/20 to-green-500/5" />
        <MetricCard title="المصروفات المستحقة" value={formatSAR(totals.dueExpenses)} accent="from-amber-500/20 to-amber-500/5" />
        <MetricCard title="الميزانية المتبقية" value={formatSAR(totals.remainingBudget)} accent="from-blue-500/20 to-blue-500/5" />
      </div>

      {/* Analytics Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense by Category - Horizontal Bar Chart */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">المصروفات حسب الفئة</h3>
          <HorizontalBarChart data={categoryExpenses} height={200} />
        </div>

        {/* Expense by Channel - Vertical Column Chart */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">المصروفات حسب القناة</h3>
          <VerticalColumnChart data={channelExpenses} height={200} />
        </div>

        {/* 6-Month Trend - Line Chart */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">اتجاه المصروفات لآخر 6 أشهر</h3>
          <LineChart data={sixMonthTrend} height={200} />
        </div>
      </div>

      {/* Branch Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">مقارنة المصروفات بين الفروع</h3>
          <BranchColumnChart data={branchComparison} height={220} />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="p-3 text-right">رقم المصروف</th>
              <th className="p-3 text-right">الوصف</th>
              <th className="p-3 text-right">الفئة</th>
              <th className="p-3 text-right">المبلغ</th>
              <th className="p-3 text-right">الحالة</th>
              <th className="p-3 text-right">تاريخ المصروف</th>
              <th className="p-3 text-right">تاريخ الاستحقاق</th>
              <th className="p-3 text-right">المورد</th>
              <th className="p-3 text-right">إجراءات سريعة</th>
            </tr>
          </thead>
          <tbody>
            {currentPageItems.map((exp, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-3">{exp.id}</td>
                <td className="p-3">{exp.description}</td>
                <td className="p-3">{exp.category}</td>
                <td className="p-3">{formatSAR(exp.amount)}</td>
                <td className="p-3">
                  <span className={
                    exp.status === "مدفوع" ? "px-2 py-1 rounded bg-green-500/10 text-green-500" :
                    exp.status === "مستحق" ? "px-2 py-1 rounded bg-blue-500/10 text-blue-500" :
                    exp.status === "متأخر" ? "px-2 py-1 rounded bg-red-500/10 text-red-500" :
                    "px-2 py-1 rounded bg-gray-500/10 text-gray-500"
                  }>{exp.status}</span>
                </td>
                <td className="p-3">{exp.expenseDate}</td>
                <td className="p-3">{exp.dueDate}</td>
                <td className="p-3">{exp.vendor}</td>
                <td className="p-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      className="p-1.5 rounded-md border border-sky-400/40 text-sky-600 dark:text-sky-300 hover:bg-sky-500/10"
                      aria-label="عرض التفاصيل"
                      onClick={() => { setSelectedIdx(((page - 1) * pageSize) + i); setShowExpenseModal(true); }}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="p-1.5 rounded-md border border-emerald-400/40 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/10"
                      aria-label="تعديل"
                      onClick={() => handleEditExpense(exp)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="p-1.5 rounded-md border border-rose-400/40 text-rose-600 dark:text-rose-300 hover:bg-rose-500/10"
                      aria-label="حذف"
                      onClick={() => handleDeleteExpense(exp.id)}
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

      {/* Add Expense Modal */}
      {showExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowExpense(false)} />
          <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-2xl rounded-xl border border-border bg-card p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-semibold">إضافة مصروف جديد</div>
              <button className="px-2 py-1 rounded-md border border-border hover:bg-muted text-xs" onClick={() => setShowExpense(false)}>إلغاء</button>
            </div>
            <form onSubmit={handleCreateExpense} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">الوصف</label>
                  <input className="px-3 py-2 rounded-md border border-border bg-card" value={newExpense.description} onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">الفئة</label>
                  <select className="px-3 py-2 rounded-md border border-border bg-card" value={newExpense.category} onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value as ExpenseCategory }))} required>
                    <option value="رواتب">رواتب</option>
                    <option value="إيجار">إيجار</option>
                    <option value="تسويق">تسويق</option>
                    <option value="معدات">معدات</option>
                    <option value="نقل">نقل</option>
                    <option value="مرافق">مرافق</option>
                    <option value="صيانة">صيانة</option>
                    <option value="تدريب">تدريب</option>
                    <option value="تأمين">تأمين</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">المبلغ</label>
                  <input type="number" className="px-3 py-2 rounded-md border border-border bg-card" value={newExpense.amount} onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">المورد</label>
                  <input className="px-3 py-2 rounded-md border border-border bg-card" value={newExpense.vendor} onChange={(e) => setNewExpense(prev => ({ ...prev, vendor: e.target.value }))} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">القسم</label>
                  <select className="px-3 py-2 rounded-md border border-border bg-card" value={newExpense.department} onChange={(e) => setNewExpense(prev => ({ ...prev, department: e.target.value }))} required>
                    <option value="المالية">المالية</option>
                    <option value="المبيعات">المبيعات</option>
                    <option value="المخزون">المخزون</option>
                    <option value="المشتريات">المشتريات</option>
                    <option value="الدعم">الدعم</option>
                    <option value="التسويق">التسويق</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">تاريخ الاستحقاق</label>
                  <input type="date" className="px-3 py-2 rounded-md border border-border bg-card" value={newExpense.dueDate} onChange={(e) => setNewExpense(prev => ({ ...prev, dueDate: e.target.value }))} required />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button type="button" className="px-3 py-2 rounded-md border border-border bg-card hover:bg-muted text-sm" onClick={() => setShowExpense(false)}>إلغاء</button>
                <button type="submit" className="px-3 py-2 rounded-md border border-primary bg-primary text-primary-foreground text-sm">إضافة</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View/Edit Expense Modal */}
      {showExpenseModal && (selectedIdx !== null || editingExpense) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowExpenseModal(false)} />
          <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-2xl rounded-xl border border-border bg-card p-4 shadow-xl">
            {editingExpense ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-lg font-semibold">تعديل المصروف • {editingExpense.id}</div>
                  <button className="px-2 py-1 rounded-md border border-border hover:bg-muted text-xs" onClick={() => { setShowExpenseModal(false); setEditingExpense(null); }}>إلغاء</button>
                </div>
                <form
                  onSubmit={(e) => { e.preventDefault(); handleUpdateExpense(editingExpense); }}
                  className="space-y-4 text-sm"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">الوصف</label>
                      <input className="px-3 py-2 rounded-md border border-border bg-card" value={editingExpense.description} onChange={(e) => setEditingExpense(prev => prev ? { ...prev, description: e.target.value } : prev)} required />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">الفئة</label>
                      <select className="px-3 py-2 rounded-md border border-border bg-card" value={editingExpense.category} onChange={(e) => setEditingExpense(prev => prev ? { ...prev, category: e.target.value as ExpenseCategory } : prev)} required>
                        <option value="رواتب">رواتب</option>
                        <option value="إيجار">إيجار</option>
                        <option value="تسويق">تسويق</option>
                        <option value="معدات">معدات</option>
                        <option value="نقل">نقل</option>
                        <option value="مرافق">مرافق</option>
                        <option value="صيانة">صيانة</option>
                        <option value="تدريب">تدريب</option>
                        <option value="تأمين">تأمين</option>
                        <option value="أخرى">أخرى</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">القناة</label>
                      <select className="px-3 py-2 rounded-md border border-border bg-card" value={editingExpense.channel} onChange={(e) => setEditingExpense(prev => prev ? { ...prev, channel: e.target.value as any } : prev)} required>
                        <option value="نقدي">نقدي</option>
                        <option value="تحويل بنكي">تحويل بنكي</option>
                        <option value="بطاقة ائتمان">بطاقة ائتمان</option>
                        <option value="شيك">شيك</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">المبلغ</label>
                      <input type="number" className="px-3 py-2 rounded-md border border-border bg-card" value={editingExpense.amount} onChange={(e) => setEditingExpense(prev => prev ? { ...prev, amount: parseFloat(e.target.value) || 0 } : prev)} required />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">الحالة</label>
                      <select className="px-3 py-2 rounded-md border border-border bg-card" value={editingExpense.status} onChange={(e) => setEditingExpense(prev => prev ? { ...prev, status: e.target.value as ExpenseStatus } : prev)} required>
                        <option value="مدفوع">مدفوع</option>
                        <option value="مستحق">مستحق</option>
                        <option value="متأخر">متأخر</option>
                        <option value="ملغي">ملغي</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">تاريخ المصروف</label>
                      <input type="date" className="px-3 py-2 rounded-md border border-border bg-card" value={editingExpense.expenseDate} onChange={(e) => setEditingExpense(prev => prev ? { ...prev, expenseDate: e.target.value } : prev)} required />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">تاريخ الاستحقاق</label>
                      <input type="date" className="px-3 py-2 rounded-md border border-border bg-card" value={editingExpense.dueDate} onChange={(e) => setEditingExpense(prev => prev ? { ...prev, dueDate: e.target.value } : prev)} required />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">المورد</label>
                      <input className="px-3 py-2 rounded-md border border-border bg-card" value={editingExpense.vendor} onChange={(e) => setEditingExpense(prev => prev ? { ...prev, vendor: e.target.value } : prev)} required />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">القسم</label>
                      <input className="px-3 py-2 rounded-md border border-border bg-card" value={editingExpense.department} onChange={(e) => setEditingExpense(prev => prev ? { ...prev, department: e.target.value } : prev)} required />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">المعتمد من</label>
                      <input className="px-3 py-2 rounded-md border border-border bg-card" value={editingExpense.approvedBy} onChange={(e) => setEditingExpense(prev => prev ? { ...prev, approvedBy: e.target.value } : prev)} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">رقم الإيصال (اختياري)</label>
                      <input className="px-3 py-2 rounded-md border border-border bg-card" value={editingExpense.receiptNumber || ""} onChange={(e) => setEditingExpense(prev => prev ? { ...prev, receiptNumber: e.target.value || undefined } : prev)} />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button type="button" className="px-3 py-2 rounded-md border border-border bg-card hover:bg-muted text-sm" onClick={() => { setShowExpenseModal(false); setEditingExpense(null); }}>إلغاء</button>
                    <button type="submit" className="px-3 py-2 rounded-md border border-primary bg-primary text-primary-foreground text-sm">حفظ</button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-lg font-semibold">تفاصيل المصروف • {selectedIdx !== null ? filtered[selectedIdx].id : ""}</div>
                  <button className="px-2 py-1 rounded-md border border-border hover:bg-muted text-xs" onClick={() => setShowExpenseModal(false)}>إغلاق</button>
                </div>
                {selectedIdx !== null && (
                  <div className="text-sm space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground">الوصف</div>
                        <div className="font-medium">{filtered[selectedIdx].description}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">المبلغ</div>
                        <div className="font-semibold">{formatSAR(filtered[selectedIdx].amount)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">الفئة</div>
                        <div className="font-medium">{filtered[selectedIdx].category}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">المورد</div>
                        <div className="font-medium">{filtered[selectedIdx].vendor}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">القسم</div>
                        <div className="font-medium">{filtered[selectedIdx].department}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">المعتمد من</div>
                        <div className="font-medium">{filtered[selectedIdx].approvedBy}</div>
                      </div>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <div className="px-2 py-1 rounded bg-muted">الحالة: {filtered[selectedIdx].status}</div>
                      <div className="px-2 py-1 rounded bg-muted">التاريخ: {filtered[selectedIdx].expenseDate}</div>
                      <div className="px-2 py-1 rounded bg-muted">الاستحقاق: {filtered[selectedIdx].dueDate}</div>
                      <div className="px-2 py-1 rounded bg-muted">القناة: {filtered[selectedIdx].channel}</div>
                    </div>
                    {filtered[selectedIdx].receiptNumber && (
                      <div className="rounded-lg border border-border p-3">
                        <div className="text-xs text-muted-foreground mb-1">رقم الإيصال</div>
                        <div className="font-medium">{filtered[selectedIdx].receiptNumber}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
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

// Horizontal Bar Chart for Expense Categories
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
                  className="h-full bg-gradient-to-r from-red-500/80 to-red-500 rounded-full transition-all duration-300"
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

// Vertical Column Chart for Expense Channels
function VerticalColumnChart({ data, height = 200 }: { data: { name: string; value: number }[]; height?: number }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const chartHeight = height - 60;
  const barWidth = Math.max(25, (520 - 60) / data.length);

  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d, i) => {
        const barHeight = Math.max(8, (d.value / max) * chartHeight);
        return (
          <div key={i} className="flex flex-col items-center gap-1" style={{ width: barWidth }}>
            <div className="text-[10px] font-medium text-muted-foreground mb-1">
              {formatSAR(d.value)}
            </div>
            <div className="w-full rounded-t-md bg-gradient-to-t from-cyan-500/90 to-cyan-500/70 relative" 
                 style={{ height: barHeight }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[8px] font-bold text-white drop-shadow-sm">
                  {formatNumber(d.value / 1000)}K
                </span>
              </div>
            </div>
            <div className="text-[9px] text-center text-muted-foreground truncate w-full mt-1" title={d.name}>
              {d.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Branch-specific professional bar colors (blue/teal palette)
function BranchColumnChart({ data, height = 220 }: { data: { name: string; value: number }[]; height?: number }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const chartHeight = height - 60;
  const barWidth = Math.max(28, (520 - 60) / data.length);
  const colors = [
    { from: "from-sky-500/90", to: "to-sky-500/70" },
    { from: "from-cyan-500/90", to: "to-cyan-500/70" },
    { from: "from-teal-500/90", to: "to-teal-500/70" },
    { from: "from-indigo-500/90", to: "to-indigo-500/70" },
  ];
  return (
    <div className="flex items-end gap-3" style={{ height }}>
      {data.map((d, i) => {
        const barHeight = Math.max(10, (d.value / max) * chartHeight);
        const c = colors[i % colors.length];
        return (
          <div key={i} className="flex flex-col items-center gap-1" style={{ width: barWidth }}>
            <div className="text-[10px] font-medium text-muted-foreground mb-1">
              {formatSAR(d.value)}
            </div>
            <div className={`w-full rounded-t-md bg-gradient-to-t ${c.from} ${c.to} relative`} style={{ height: barHeight }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[8px] font-bold text-white drop-shadow-sm">
                  {formatNumber(d.value / 1000)}K
                </span>
              </div>
            </div>
            <div className="text-[9px] text-center text-muted-foreground truncate w-full mt-1" title={d.name}>
              {d.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Professional Line Chart (matches income module style)
function LineChart({ data, height = 180 }: { data: { label: string; value: number }[]; height?: number }) {
  const paddingLeft = 64;
  const paddingRight = 20;
  const paddingTop = 14;
  const paddingBottom = 22;
  const w = 520;
  const h = height;

  const values = data.map(d => d.value);
  const rawMax = Math.max(1, ...values);
  const niceStep = Math.pow(10, Math.floor(Math.log10(rawMax)) - 1);
  const max = Math.ceil(rawMax / Math.max(1, niceStep)) * Math.max(1, niceStep);
  const min = 0;

  const innerW = w - paddingLeft - paddingRight;
  const innerH = h - paddingTop - paddingBottom;
  const scaleX = (i: number) => paddingLeft + (i * innerW) / Math.max(1, data.length - 1);
  const scaleY = (v: number) => paddingTop + innerH - ((v - min) / Math.max(1, max - min)) * innerH;

  const pts = data.map((d, i) => ({ x: scaleX(i), y: scaleY(d.value) }));
  const dPath = pts.reduce((acc, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = arr[i - 1];
    const cx = (prev.x + p.x) / 2;
    return acc + ` Q ${cx} ${prev.y} ${p.x} ${p.y}`;
  }, "");
  const areaPath = `${dPath} L ${paddingLeft + innerW} ${paddingTop + innerH} L ${paddingLeft} ${paddingTop + innerH} Z`;

  const yTicks = 4;
  const tickVals = Array.from({ length: yTicks + 1 }).map((_, i) => Math.round((max / yTicks) * i));

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id="expenseArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.18" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={paddingTop + innerH} stroke="currentColor" opacity={0.15} />
      <line x1={paddingLeft} y1={paddingTop + innerH} x2={paddingLeft + innerW} y2={paddingTop + innerH} stroke="currentColor" opacity={0.15} />

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

      <path d={areaPath} fill="url(#expenseArea)" />
      <path d={dPath} fill="none" stroke="hsl(var(--primary))" strokeWidth={2.5} />

      {data.map((d, i) => (
        <g key={i}>
          <circle cx={scaleX(i)} cy={scaleY(d.value)} r={3.5} fill="hsl(var(--primary))">
            <title>{`${d.label}: ${formatSAR(d.value)}`}</title>
          </circle>
        </g>
      ))}

      {data.map((d, i) => (
        <text key={`t-${i}`} x={scaleX(i)} y={paddingTop + innerH + 12} textAnchor="middle" className="text-[10px] fill-current text-muted-foreground">
          {d.label.split(" ")[0]}
        </text>
      ))}
    </svg>
  );
}
