import { customers, inventory, invoices, expenses, salesOrders } from "./mockData";

export type BranchName = "الرياض" | "جدة" | "الدمام" | "مكة";

export type BranchKpis = {
  branch: BranchName;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  netProfitPct: number;
  clientsCount: number;
  inventoryValue: number;
  performance: "ممتاز" | "جيد" | "متوسط" | "منخفض";
};

const BRANCHES: BranchName[] = ["الرياض", "مكة", "الدمام", "جدة"];

export function getBranches(): BranchName[] {
  return BRANCHES;
}

function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

export function computeRevenueByBranch(): Record<BranchName, number> {
  const byBranch = {
    الرياض: 0,
    جدة: 0,
    الدمام: 0,
    مكة: 0,
  } as Record<BranchName, number>;
  for (const inv of invoices) {
    byBranch[inv.branch as BranchName] += inv.amount;
  }
  return byBranch;
}

export function computeInventoryValueByBranch(): Record<BranchName, number> {
  const byBranch = {
    الرياض: 0,
    جدة: 0,
    الدمام: 0,
    مكة: 0,
  } as Record<BranchName, number>;
  for (const item of inventory) {
    byBranch[item.branch as BranchName] += item.currentStock * item.unitCost;
  }
  return byBranch;
}

export function computeClientsCountByBranch(): Record<BranchName, number> {
  const byBranch = {
    الرياض: 0,
    جدة: 0,
    الدمام: 0,
    مكة: 0,
  } as Record<BranchName, number>;
  for (const c of customers) {
    byBranch[c.city as BranchName] += 1;
  }
  return byBranch;
}

// Allocate total expenses across branches proportionally to revenue share
export function allocateExpensesByBranch(revenueByBranch: Record<BranchName, number>): Record<BranchName, number> {
  const totalExpenses = sum(expenses.map((e) => e.amount));
  const totalRevenue = sum(Object.values(revenueByBranch));
  if (totalRevenue === 0) {
    const equal = totalExpenses / BRANCHES.length;
    return {
      الرياض: equal,
      جدة: equal,
      الدمام: equal,
      مكة: equal,
    } as Record<BranchName, number>;
  }
  const byBranch = {
    الرياض: 0,
    جدة: 0,
    الدمام: 0,
    مكة: 0,
  } as Record<BranchName, number>;
  for (const b of BRANCHES) {
    const share = revenueByBranch[b] / totalRevenue;
    byBranch[b] = Math.round(totalExpenses * share);
  }
  return byBranch;
}

export function computeBranchKpis(): BranchKpis[] {
  const revenueByBranch = computeRevenueByBranch();
  const invValueByBranch = computeInventoryValueByBranch();
  const clientsByBranch = computeClientsCountByBranch();
  const expensesByBranch = allocateExpensesByBranch(revenueByBranch);

  return getBranches().map((b) => {
    const totalRevenue = revenueByBranch[b] || 0;
    const totalExpenses = expensesByBranch[b] || 0;
    const netProfit = totalRevenue - totalExpenses;
    const netProfitPct = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 1000) / 10 : 0;
    const clientsCount = clientsByBranch[b] || 0;
    const inventoryValue = invValueByBranch[b] || 0;
    const performance: BranchKpis["performance"] = netProfitPct >= 20 ? "ممتاز" : netProfitPct >= 10 ? "جيد" : netProfitPct >= 0 ? "متوسط" : "منخفض";
    return { branch: b, totalRevenue, totalExpenses, netProfit, netProfitPct, clientsCount, inventoryValue, performance };
  });
}

export function formatCurrency(amount: number): string {
  return `SAR ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(amount)}`;
}

export type BranchProfile = {
  branch: BranchName;
  manager: string;
  email: string;
  phone: string;
  address: string;
  openingHours: string; // e.g. "9:00 ص - 6:00 م"
  establishedAt: string; // YYYY-MM-DD
  employeesCount: number;
};

const profiles: BranchProfile[] = [
  { branch: "الرياض", manager: "فهد العتيبي", email: "riyadh@aldqqa.sa", phone: "+966 11 123 4567", address: "طريق الملك فهد، حي العليا، الرياض", openingHours: "9:00 ص - 6:00 م", establishedAt: "2018-04-15", employeesCount: 18 },
  { branch: "مكة", manager: "سعود القحطاني", email: "makkah@aldqqa.sa", phone: "+966 12 234 5678", address: "طريق المسجد الحرام، مكة المكرمة", openingHours: "9:00 ص - 5:00 م", establishedAt: "2019-06-20", employeesCount: 12 },
  { branch: "الدمام", manager: "نورة الشهري", email: "dammam@aldqqa.sa", phone: "+966 13 345 6789", address: "طريق الملك عبدالعزيز، الدمام", openingHours: "9:00 ص - 6:00 م", establishedAt: "2020-02-10", employeesCount: 14 },
  { branch: "جدة", manager: "خالد الغامدي", email: "jeddah@aldqqa.sa", phone: "+966 12 456 7890", address: "طريق الملك، حي الشاطئ، جدة", openingHours: "9:00 ص - 6:00 م", establishedAt: "2017-09-01", employeesCount: 16 },
];

export function getBranchProfiles(): BranchProfile[] {
  return profiles;
}

export function computeAvgOrderValueByBranch(): Record<BranchName, number> {
  const sums = { الرياض: 0, جدة: 0, الدمام: 0, مكة: 0 } as Record<BranchName, number>;
  const counts = { الرياض: 0, جدة: 0, الدمام: 0, مكة: 0 } as Record<BranchName, number>;
  for (const so of salesOrders) {
    const b = so.branch as BranchName;
    sums[b] += so.total;
    counts[b] += 1;
  }
  const result = { الرياض: 0, جدة: 0, الدمام: 0, مكة: 0 } as Record<BranchName, number>;
  for (const b of BRANCHES) {
    result[b] = counts[b] ? Math.round(sums[b] / counts[b]) : 0;
  }
  return result;
}

// Monthly change based on last 30 days vs previous 30 days net profit approximation
export function computeMonthlyChangePct(): Record<BranchName, number> {
  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;
  const last30Start = new Date(now.getTime() - 30 * dayMs);
  const prev30Start = new Date(now.getTime() - 60 * dayMs);

  const lastByBranch = { الرياض: 0, جدة: 0, الدمام: 0, مكة: 0 } as Record<BranchName, number>;
  const prevByBranch = { الرياض: 0, جدة: 0, الدمام: 0, مكة: 0 } as Record<BranchName, number>;

  // revenue windows
  for (const inv of invoices) {
    const d = new Date(inv.invoiceDate);
    const b = inv.branch as BranchName;
    if (d >= last30Start && d <= now) lastByBranch[b] += inv.amount;
    else if (d >= prev30Start && d < last30Start) prevByBranch[b] += inv.amount;
  }
  // allocate expenses proportionally per window
  const lastExp = allocateExpensesByBranch(lastByBranch);
  const prevExp = allocateExpensesByBranch(prevByBranch);

  const changePct = { الرياض: 0, جدة: 0, الدمام: 0, مكة: 0 } as Record<BranchName, number>;
  for (const b of BRANCHES) {
    const lastNet = (lastByBranch[b] || 0) - (lastExp[b] || 0);
    const prevNet = (prevByBranch[b] || 0) - (prevExp[b] || 0);
    if (prevNet === 0) {
      changePct[b] = lastNet > 0 ? 100 : 0;
    } else {
      changePct[b] = Math.round(((lastNet - prevNet) / Math.abs(prevNet)) * 1000) / 10;
    }
  }
  return changePct;
}

export function totalEmployees(): number {
  return profiles.reduce((s, p) => s + p.employeesCount, 0);
}

// Compute a target achievement rate per branch relative to the top revenue branch (soft, bounded)
export function computeTargetAchievementByBranch(): Record<BranchName, number> {
  const revenue = computeRevenueByBranch();
  const max = Math.max(...Object.values(revenue));
  const result = { الرياض: 0, جدة: 0, الدمام: 0, مكة: 0 } as Record<BranchName, number>;
  for (const b of getBranches()) {
    const ratio = max > 0 ? revenue[b] / max : 0;
    // map ratio to 60% - 120% band for a friendly target visualization
    const pct = Math.round((0.6 + ratio * 0.6) * 100);
    result[b] = Math.max(0, Math.min(150, pct));
  }
  return result;
}


