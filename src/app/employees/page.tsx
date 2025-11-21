"use client";

import { useEffect, useMemo, useState } from "react";
import { employees, type Employee } from "@/lib/mockData";
import { formatNumber, formatSAR } from "@/lib/format";
import { Users, CalendarPlus, Wallet, BriefcaseBusiness, UserCheck, UserX, Filter, Search, Eye, UserMinus, Pencil } from "lucide-react";

export default function Page() {
  const [employeeList, setEmployeeList] = useState<Employee[]>(employees);
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState<string | "">("");
  const [title, setTitle] = useState<string | "">("");
  const [status, setStatus] = useState<string | "">("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [view, setView] = useState<"cards" | "table">("cards");
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selected, setSelected] = useState<Employee | null>(null);
  const rowsPerPage = 20;
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Deterministic helpers to avoid hydration issues
  function hashString(input: unknown): number {
    const s = String(input ?? "");
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h >>> 0;
  }
  function getManager(e: Employee): string {
    const managers = [
      "عبدالله الشمري",
      "نورة القحطاني",
      "سارة النعيمي",
      "محمد العتيبي",
      "خالد الغامدي",
    ];
    return managers[hashString(e.id) % managers.length];
  }
  function getLeaveBalance(e: Employee): number {
    return 10 + (hashString(e.id + e.name) % 21); // 10..30 يوم
  }
  function getKpis(e: Employee) {
    const base = hashString(e.id + e.department);
    const score = 60 + (base % 41); // 60..100
    const objectives = 3 + (base % 8); // 3..10
    const absenceRate = (base % 9) + 1; // 1..9 %
    return { score, objectives, absenceRate };
  }
  function getContacts(e: Employee) {
    const phone = `05${(hashString(e.name) % 900000000 + 100000000).toString().slice(0, 8)}`;
    const email = `${e.name.replace(/\s+/g, ".").toLowerCase()}@aldqqa.sa`;
    const emergency = `0${(hashString(e.id) % 900000000 + 100000000)}`;
    return { phone, email, emergency };
  }
  function getLeaveHistory(e: Employee) {
    const base = hashString(e.id);
    const items = [
      { date: "2025-09-10", type: "سنوية", days: 5 },
      { date: "2025-06-22", type: "طارئة", days: 2 },
      { date: "2025-02-14", type: "مرضية", days: 1 },
    ];
    // rotate deterministically
    const shift = base % items.length;
    return items.slice(shift).concat(items.slice(0, shift));
  }
  function getTrainingHistory(e: Employee) {
    const topics = [
      "إدارة الوقت",
      "خدمة العملاء",
      "أمان وسلامة",
      "المهارات القيادية",
      "التحول الرقمي",
    ];
    const base = hashString(e.department);
    return [0, 1, 2].map((i) => ({ topic: topics[(base + i) % topics.length], date: `2025-0${(i + 3)}-1${(base % 5)}` }));
  }

  const filtered = useMemo(() => {
    return employeeList.filter((e) => {
      const matchesQuery = [e.name, e.title, e.department].some((v) => v.includes(query));
      const matchesDept = department ? e.department === department : true;
      const matchesTitle = title ? e.title === title : true;
      const matchesStatus = status ? e.status === status : true;
      let matchesRange = true;
      if (fromDate || toDate) {
        const d = new Date(e.joined);
        const start = fromDate ? new Date(fromDate) : null;
        const end = toDate ? new Date(toDate) : null;
        if (start && d < start) matchesRange = false;
        if (end) {
          const endInclusive = new Date(end.getFullYear(), end.getMonth(), end.getDate() + 1);
          if (d >= endInclusive) matchesRange = false;
        }
      }
      return matchesQuery && matchesDept && matchesTitle && matchesStatus && matchesRange;
    });
  }, [employeeList, query, department, title, status, fromDate, toDate]);

  useEffect(() => setPage(1), [query, department, title, status, fromDate, toDate]);

  const metrics = useMemo(() => {
    const list = filtered;
    const total = list.length;
    const new30 = list.filter((e) => {
      const now = new Date();
      const d = new Date(e.joined);
      return now.getTime() - d.getTime() <= 30 * 24 * 60 * 60 * 1000;
    }).length;
    const active = list.filter((e) => e.status === "نشط").length;
    const vacation = list.filter((e) => e.status === "إجازة").length;
    const totalSalaries = list.reduce((sum, e) => sum + e.salary, 0);
    return { total, new30, active, vacation, totalSalaries };
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paged = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page]);

  return (
    <div className="space-y-4">
      {/* Top metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 transition hover:-translate-y-0.5 hover:shadow-lg">
          <div className="p-2 rounded-lg bg-primary/15 text-primary border border-primary/20">
            <Users size={18} />
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">إجمالي عدد العاملين</div>
            <div className="text-xl font-semibold">{formatNumber(metrics.total)}</div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 transition hover:-translate-y-0.5 hover:shadow-lg">
          <div className="p-2 rounded-lg bg-sky-500/15 text-sky-500 border border-sky-500/20">
            <CalendarPlus size={18} />
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">العاملون الجدد (30 يوم)</div>
            <div className="text-xl font-semibold">{formatNumber(metrics.new30)}</div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 transition hover:-translate-y-0.5 hover:shadow-lg">
          <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">
            <UserCheck size={18} />
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">نشط</div>
            <div className="text-xl font-semibold">{formatNumber(metrics.active)}</div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 transition hover:-translate-y-0.5 hover:shadow-lg">
          <div className="p-2 rounded-lg bg-amber-500/15 text-amber-500 border border-amber-500/20">
            <UserX size={18} />
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">إجازة</div>
            <div className="text-xl font-semibold">{formatNumber(metrics.vacation)}</div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 transition hover:-translate-y-0.5 hover:shadow-lg">
          <div className="p-2 rounded-lg bg-teal-500/15 text-teal-500 border border-teal-500/20">
            <Wallet size={18} />
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">إجمالي الرواتب الشهرية</div>
            <div className="text-xl font-semibold">{formatSAR(metrics.totalSalaries)}</div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 transition hover:-translate-y-0.5 hover:shadow-lg">
          <div className="p-2 rounded-lg bg-indigo-500/15 text-indigo-500 border border-indigo-500/20">
            <BriefcaseBusiness size={18} />
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">أقسام العمل</div>
            <div className="text-xl font-semibold">{formatNumber(new Set(employeeList.map((e) => e.department)).size)}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
        <h1 className="text-xl font-semibold">العاملين</h1>
        <div className="flex flex-wrap gap-2">
          <input className="px-3 py-2 rounded-md border border-border bg-card text-sm w-full sm:w-72 md:w-96 lg:w-[32rem]" placeholder="بحث بالاسم أو القسم" value={query} onChange={(e) => setQuery(e.target.value)} />
          <select className="px-3 py-2 rounded-md border border-border bg-card text-sm" value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">كل الأقسام</option>
            {Array.from(new Set(employeeList.map((e) => e.department))).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select className="px-3 py-2 rounded-md border border-border bg-card text-sm" value={title} onChange={(e) => setTitle(e.target.value)}>
            <option value="">كل المسميات</option>
            {Array.from(new Set(employeeList.map((e) => e.title))).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select className="px-3 py-2 rounded-md border border-border bg-card text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">كل الحالات</option>
            <option value="نشط">نشط</option>
            <option value="إجازة">إجازة</option>
          </select>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">من</label>
            <input type="date" className="px-3 py-2 rounded-md border border-border bg-card text-sm" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            <label className="text-xs text-muted-foreground">إلى</label>
            <input type="date" className="px-3 py-2 rounded-md border border-border bg-card text-sm" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
          <button className="px-3 py-2 rounded-md border border-primary bg-primary text-primary-foreground text-sm" onClick={() => setShowAddModal(true)}>إضافة موظف جديد</button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <button onClick={() => setView("cards")} className={`px-3 py-1.5 rounded-md border text-sm ${view === "cards" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-muted"}`}>عرض البطاقات</button>
        <button onClick={() => setView("table")} className={`px-3 py-1.5 rounded-md border text-sm ${view === "table" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-muted"}`}>عرض الجدول</button>
      </div>

      {view === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((e, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{e.name}</div>
                  <div className="text-xs text-muted-foreground">{e.department} • {e.title}</div>
                </div>
                <span className={`px-2.5 py-1 text-[11px] rounded-md border shadow-sm ${e.status === "نشط" ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30" : "bg-amber-500/15 text-amber-600 border-amber-500/30"}`}>
                  {e.status}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-teal-500/25 bg-teal-500/10 p-3">
                  <div className="text-xs text-teal-700 dark:text-teal-300">الراتب الشهري</div>
                  <div className="mt-1 font-semibold text-teal-800 dark:text-teal-200">{formatSAR(e.salary)}</div>
                </div>
                <div className="rounded-lg border border-sky-500/25 bg-sky-500/10 p-3">
                  <div className="text-xs text-sky-700 dark:text-sky-300">تاريخ الانضمام</div>
                  <div className="mt-1 font-semibold text-sky-800 dark:text-sky-200">{e.joined}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="p-2 sm:p-3 text-right">الاسم</th>
                  <th className="p-2 sm:p-3 text-right">المسمى الوظيفي</th>
                  <th className="p-2 sm:p-3 text-right">القسم</th>
                  <th className="p-2 sm:p-3 text-right">تاريخ التعيين</th>
                  <th className="p-2 sm:p-3 text-right">الراتب الشهري</th>
                  <th className="p-2 sm:p-3 text-right">رصيد الإجازات</th>
                  <th className="p-2 sm:p-3 text-right">المدير المباشر</th>
                  <th className="p-2 sm:p-3 text-right">الحالة الوظيفية</th>
                  <th className="p-2 sm:p-3 text-right">KPIs</th>
                  <th className="p-2 sm:p-3 text-right">إجراءات سريعة</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((e, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-2 sm:p-3 font-medium">{e.name}</td>
                    <td className="p-2 sm:p-3">{e.title}</td>
                    <td className="p-2 sm:p-3">{e.department}</td>
                    <td className="p-2 sm:p-3">{e.joined}</td>
                    <td className="p-2 sm:p-3">{formatSAR(e.salary)}</td>
                    <td className="p-2 sm:p-3">{formatNumber(getLeaveBalance(e))} يوم</td>
                    <td className="p-2 sm:p-3">{getManager(e)}</td>
                    <td className="p-2 sm:p-3">
                      <span className={`px-2 py-1 text-[11px] rounded-md border ${e.status === "نشط" ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" : "bg-amber-500/15 text-amber-600 border-amber-500/30"}`}>{e.status}</span>
                    </td>
                    <td className="p-2 sm:p-3">
                      {(() => {
                        const k = getKpis(e);
                        return (
                          <div className="flex items-center gap-3">
                            <div className="text-xs">{k.score}%</div>
                            <div className="w-24 h-2 rounded bg-muted overflow-hidden">
                              <div className={`h-2 ${k.score >= 80 ? "bg-emerald-500" : k.score >= 65 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${k.score}%` }} />
                            </div>
                            <div className="text-[11px] text-muted-foreground">أهداف: {k.objectives} • غياب: {k.absenceRate}%</div>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="p-2 sm:p-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-md border border-sky-400/40 text-sky-600 dark:text-sky-300 hover:bg-sky-500/10" onClick={() => { setSelected(e); setShowDetails(true); }} aria-label="عرض التفاصيل"><Eye size={16} /></button>
                        <button className="p-1.5 rounded-md border border-emerald-400/40 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/10" onClick={() => { setEditingEmployee(e); }} aria-label="تعديل"><Pencil size={16} /></button>
                        <button className="p-1.5 rounded-md border border-rose-400/40 text-rose-600 dark:text-rose-300 hover:bg-rose-500/10" onClick={() => { console.log("Terminate", e.id); }} aria-label="إنهاء"><UserMinus size={16} /></button>
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
              <button className="px-2 py-1 rounded-md border border-border bg-card hover:bg-muted disabled:opacity-50" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>السابق</button>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const p = idx + 1;
                return (
                  <button key={p} className={`px-2 py-1 rounded-md border text-xs ${p === page ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-muted"}`} onClick={() => setPage(p)}>{formatNumber(p)}</button>
                );
              })}
              <button className="px-2 py-1 rounded-md border border-border bg-card hover:bg-muted disabled:opacity-50" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>التالي</button>
            </div>
          </div>
        </>
      )}

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditingEmployee(null)} />
          <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">تعديل الموظف • {editingEmployee.name}</div>
              <button className="px-3 py-1 rounded-md border border-border hover:bg-muted text-xs" onClick={() => setEditingEmployee(null)}>إغلاق</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEmployeeList(prev => prev.map(emp => emp.id === editingEmployee.id ? editingEmployee : emp));
                setEditingEmployee(null);
              }}
              className="space-y-4 text-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">الاسم الكامل</label>
                  <input className="w-full px-3 py-2 rounded-md border border-border bg-input" value={editingEmployee.name} onChange={(e) => setEditingEmployee(prev => prev ? { ...prev, name: e.target.value } : prev)} required />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">القسم</label>
                  <input className="w-full px-3 py-2 rounded-md border border-border bg-input" value={editingEmployee.department} onChange={(e) => setEditingEmployee(prev => prev ? { ...prev, department: e.target.value } : prev)} required />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">المسمى الوظيفي</label>
                  <input className="w-full px-3 py-2 rounded-md border border-border bg-input" value={editingEmployee.title} onChange={(e) => setEditingEmployee(prev => prev ? { ...prev, title: e.target.value } : prev)} required />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">الراتب الشهري</label>
                  <input type="number" className="w-full px-3 py-2 rounded-md border border-border bg-input" value={editingEmployee.salary} onChange={(e) => setEditingEmployee(prev => prev ? { ...prev, salary: parseFloat(e.target.value) || 0 } : prev)} required />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">الحالة</label>
                  <select className="w-full px-3 py-2 rounded-md border border-border bg-input" value={editingEmployee.status} onChange={(e) => setEditingEmployee(prev => prev ? { ...prev, status: e.target.value as Employee["status"] } : prev)}>
                    <option value="نشط">نشط</option>
                    <option value="إجازة">إجازة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">تاريخ التعيين</label>
                  <input type="date" className="w-full px-3 py-2 rounded-md border border-border bg-input" value={editingEmployee.joined} onChange={(e) => setEditingEmployee(prev => prev ? { ...prev, joined: e.target.value } : prev)} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="px-3 py-2 rounded-md border border-border bg-card hover:bg-muted text-sm" onClick={() => setEditingEmployee(null)}>إلغاء</button>
                <button type="submit" className="px-3 py-2 rounded-md border border-primary bg-primary text-primary-foreground text-sm">حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">إضافة موظف جديد</div>
              <button className="px-3 py-1 rounded-md border border-border hover:bg-muted text-xs" onClick={() => setShowAddModal(false)}>إغلاق</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget as HTMLFormElement);
              const data = Object.fromEntries(fd.entries());
              console.log("New Employee:", data);
              setShowAddModal(false);
            }} className="space-y-6">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">الاسم الكامل</label>
                    <input name="name" required className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">رقم الهوية</label>
                    <input name="nationalId" className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">القسم</label>
                    <input name="department" className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">المسمى الوظيفي</label>
                    <input name="title" className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">الراتب الشهري (ريال)</label>
                    <input name="salary" type="number" step="0.01" className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">نوع العقد</label>
                    <select name="contractType" className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm">
                      <option value="دوام كامل">دوام كامل</option>
                      <option value="دوام جزئي">دوام جزئي</option>
                      <option value="مؤقت">مؤقت</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">تاريخ التعيين</label>
                    <input name="joined" type="date" className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">الحالة</label>
                    <select name="status" className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm">
                      <option value="نشط">نشط</option>
                      <option value="إجازة">إجازة</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">رقم الجوال</label>
                    <input name="phone" className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">البريد الإلكتروني</label>
                    <input name="email" type="email" className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-md border border-border bg-card text-sm hover:bg-muted">إلغاء</button>
                <button type="submit" className="px-4 py-2 rounded-md border border-primary bg-primary text-primary-foreground text-sm">إضافة</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employee Details Modal */}
      {showDetails && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDetails(false)} />
          <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-4xl rounded-xl border border-border bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">{selected.name}</div>
              <button className="px-3 py-1 rounded-md border border-border hover:bg-muted text-xs" onClick={() => setShowDetails(false)}>إغلاق</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">القسم</div>
                    <div className="font-medium">{selected.department}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">المسمى الوظيفي</div>
                    <div className="font-medium">{selected.title}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">تاريخ التعيين</div>
                    <div className="font-medium">{selected.joined}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">المدير المباشر</div>
                    <div className="font-medium">{getManager(selected)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">الراتب الشهري</div>
                    <div className="font-semibold">{formatSAR(selected.salary)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">رصيد الإجازات</div>
                    <div className="font-medium">{formatNumber(getLeaveBalance(selected))} يوم</div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                {(() => {
                  const k = getKpis(selected);
                  return (
                    <div>
                      <div className="text-sm font-semibold mb-3">أداء الموظف (KPIs)</div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-sm">التقييم: {k.score}%</div>
                        <div className="w-40 h-2 rounded bg-muted overflow-hidden">
                          <div className={`h-2 ${k.score >= 80 ? "bg-emerald-500" : k.score >= 65 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${k.score}%` }} />
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">الأهداف المكتملة: {k.objectives}</div>
                      <div className="text-sm text-muted-foreground">معدل الغياب/التأخير: {k.absenceRate}%</div>
                    </div>
                  );
                })()}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-lg border border-border bg-card">
                <div className="p-3 border-b border-border text-sm font-semibold">سجل الإجازات (آخر 3)</div>
                <table className="w-full text-sm">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="p-2 text-right">التاريخ</th>
                      <th className="p-2 text-right">النوع</th>
                      <th className="p-2 text-right">الأيام</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getLeaveHistory(selected).map((l, idx) => (
                      <tr key={idx} className="border-t border-border">
                        <td className="p-2">{l.date}</td>
                        <td className="p-2">{l.type}</td>
                        <td className="p-2">{formatNumber(l.days)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="rounded-lg border border-border bg-card">
                <div className="p-3 border-b border-border text-sm font-semibold">التدريب</div>
                <table className="w-full text-sm">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="p-2 text-right">الدورة</th>
                      <th className="p-2 text-right">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getTrainingHistory(selected).map((t, idx) => (
                      <tr key={idx} className="border-t border-border">
                        <td className="p-2">{t.topic}</td>
                        <td className="p-2">{t.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
              {(() => {
                const c = getContacts(selected);
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">الجوال</div>
                      <div className="font-medium">{c.phone}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">البريد الإلكتروني</div>
                      <div className="font-medium">{c.email}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">الاتصال بالطوارئ</div>
                      <div className="font-medium">{c.emergency}</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



