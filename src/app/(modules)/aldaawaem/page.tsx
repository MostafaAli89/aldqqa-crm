"use client";

import { expenseSummary } from "@/lib/mockData";

export default function Page() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">المصروفات والتكاليف</h1>
        <button className="px-3 py-2 rounded-md border border-primary bg-primary text-primary-foreground text-sm">إضافة مصروف</button>
      </div>

      <div className="overflow-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="p-3 text-right">البند</th>
              <th className="p-3 text-right">الشهر</th>
              <th className="p-3 text-right">المبلغ</th>
            </tr>
          </thead>
          <tbody>
            {expenseSummary.map((e, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-3">{e.category}</td>
                <td className="p-3">{e.month}</td>
                <td className="p-3">SAR {e.amount.toLocaleString('en-US')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


