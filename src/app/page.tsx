"use client";

import { useMemo, useState, useEffect } from "react";
import { type LucideIcon } from "lucide-react";
import { type TimePeriod } from "@/lib/types";
import { TimeFilter } from "@/components/TimeFilter";
import {
  customers, 
  salesOrders, 
  invoices, 
  expenses, 
  inventory, 
  employees,
  type Customer,
  type SalesOrder,
  type Invoice,
  type Expense,
  type InventoryItem,
  type Employee
} from "@/lib/mockData";
import { worstProducts, worstEmployees, worstCustomers } from "@/lib/worstPerformersData";
import { formatSAR, formatNumber } from "@/lib/format";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Target,
  Building2,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Star,
  Award,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Filter,
  RefreshCw
} from "lucide-react";

// Enhanced KPI Card Component with professional animations
function KPICard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  color = "bg-blue-500",
  subtitle
}: { 
  title: string;
  value: string;
  change: number;
  changeType: "positive" | "negative";
  icon: LucideIcon;
  color?: string;
  subtitle?: string;
}) {
  const getChangeBg = () => changeType === "positive" ? "bg-emerald-50" : "bg-rose-50";
  const getChangeColor = () => changeType === "positive" ? "text-emerald-600" : "text-rose-600";
  const getTextColor = () => "text-foreground";
  const getSubtitleColor = () => "text-muted-foreground";

  return (
    <div className="group p-6 rounded-xl border-0 bg-gradient-to-br hover:shadow-xl active:scale-95 hover:scale-105 cursor-pointer transform transition-all duration-200 ease-in-out" style={{
        background: color === 'bg-blue-500' ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.03) 100%)' :
                   color === 'bg-green-500' ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(22, 163, 74, 0.03) 100%)' :
                   color === 'bg-purple-500' ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(147, 51, 234, 0.03) 100%)' :
                   color === 'bg-yellow-500' ? 'linear-gradient(135deg, rgba(234, 179, 8, 0.08) 0%, rgba(202, 138, 4, 0.03) 100%)' :
                   color === 'bg-indigo-500' ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(79, 70, 229, 0.03) 100%)' :
                   color === 'bg-cyan-500' ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(8, 145, 178, 0.03) 100%)' :
                   color === 'bg-rose-500' ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.08) 0%, rgba(225, 29, 72, 0.03) 100%)' :
                   color === 'bg-amber-500' ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.03) 100%)' : ''
      }}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{
          background: color === 'bg-blue-500' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' :
                     color === 'bg-green-500' ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' :
                     color === 'bg-purple-500' ? 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)' :
                     color === 'bg-yellow-500' ? 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)' :
                     color === 'bg-indigo-500' ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' :
                     color === 'bg-cyan-500' ? 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' :
                     color === 'bg-rose-500' ? 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' :
                     color === 'bg-amber-500' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : color
        }}>
          <Icon size={24} className="text-white group-hover:rotate-12 transition-transform duration-300" />
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getChangeBg()} ${getChangeColor()} shadow-sm group-hover:scale-105 transition-all duration-300`}>
          {change > 0 ? "+" : ""}{change}%
        </div>
      </div>
      <div className="space-y-1">
        <div className={`text-2xl font-bold ${getTextColor()} group-hover:text-blue-600 transition-colors duration-300`}>
          {value}
        </div>
        <div className={`text-sm ${getSubtitleColor()} group-hover:text-foreground transition-colors duration-300`}>
          {title}
        </div>
        {subtitle && (
          <div className={`text-xs ${getSubtitleColor()} group-hover:text-muted-foreground/80 transition-colors duration-300`}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}// Branch Summary Card Component
function BranchSummaryCard({ 
  branch, 
  revenue, 
  profit, 
  customers, 
  employees, 
  performance 
}: { 
  branch: string; 
  revenue: number; 
  profit: number; 
  customers: number; 
  employees: number; 
  performance: string; 
}) {
  const profitMargin = ((profit / revenue) * 100).toFixed(1);
  const isHighPerformer = profit > 100000;
  
  return (
    <div className="rounded-xl border border-black/[0.03] dark:border-white/[0.04] bg-gradient-to-br from-white/5 to-emerald-500/[0.02] dark:from-white/[0.04] dark:to-emerald-900/[0.03] p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${
            isHighPerformer 
              ? 'from-emerald-500/90 to-emerald-600/90 dark:from-emerald-400 dark:to-emerald-500' 
              : 'from-blue-500/90 to-blue-600/90 dark:from-blue-400 dark:to-blue-500'
          } transition-transform duration-200 hover:scale-110 shadow-sm`}>
            <Building2 size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg dark:text-white">{branch}</h3>
            <p className="text-sm text-muted-foreground dark:text-white/80">{performance}</p>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-br shadow-sm ${
          isHighPerformer 
            ? 'from-emerald-50 to-emerald-100/80 text-emerald-700 dark:from-emerald-400/10 dark:to-emerald-400/20 dark:text-emerald-200' 
            : 'from-blue-50 to-blue-100/80 text-blue-700 dark:from-blue-400/10 dark:to-blue-400/20 dark:text-blue-200'
        }`}>
          {profitMargin}% هامش ربح
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground dark:text-white/70">الإيرادات</div>
          <div className="text-lg font-bold text-blue-600 dark:text-blue-300">{formatSAR(revenue)}</div>
        </div>
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground dark:text-white/70">الربح</div>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-300">{formatSAR(profit)}</div>
        </div>
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground dark:text-white/70">العملاء</div>
          <div className="text-sm font-semibold dark:text-white">{formatNumber(customers)}</div>
        </div>
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground dark:text-white/70">الموظفين</div>
          <div className="text-sm font-semibold dark:text-white">{formatNumber(employees)}</div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Horizontal Bar Chart Component
function RevenueChart({ data }: { data: { month: string; revenue: number; expenses: number }[] }) {
  const max = Math.max(...data.map(d => Math.max(d.revenue, d.expenses)));
  const width = 600;
  const barHeight = 25;
  const gap = 12;
  const labelWidth = 80;
  const barAreaHeight = data.length * (barHeight * 2 + gap) - gap;
  const height = barAreaHeight + 60; // 60px for top/bottom padding
  const topPadding = 30;
  const leftPadding = labelWidth + 20;
  const barMaxWidth = width - leftPadding - 40; // 40px right padding

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">الإيرادات مقابل المصروفات</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>الإيرادات</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <span>المصروفات</span>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <svg width={width} height={height} className="overflow-visible">
          {data.map((d, i) => {
            const y = topPadding + i * (barHeight * 2 + gap);
            const revenueWidth = (d.revenue / max) * barMaxWidth;
            const expenseWidth = (d.expenses / max) * barMaxWidth;
            return (
              <g key={i}>
                {/* Month label pushed even closer to the bars */}
                <text x={labelWidth - 40} y={y + barHeight/2 + 5} textAnchor="end" className="text-sm fill-muted-foreground font-medium">
                  {d.month}
                </text>

                {/* Revenue bar */}
                <rect x={leftPadding} y={y} width={revenueWidth} height={barHeight}
                      fill="#3b82f6" opacity="0.8" rx="6" />
                {/* Revenue value pushed even further outside bar */}
                <text x={leftPadding + revenueWidth + 80} y={y + barHeight/2 + 5} textAnchor="start"
                      className="text-xs fill-blue-700 font-bold">
                  {formatSAR(d.revenue)}
                </text>

                {/* Expense bar */}
                <rect x={leftPadding} y={y + barHeight + 6} width={expenseWidth} height={barHeight}
                      fill="#ef4444" opacity="0.8" rx="6" />
                {/* Expense value pushed even further outside bar */}
                <text x={leftPadding + expenseWidth + 80} y={y + barHeight + 6 + barHeight/2 + 5} textAnchor="start"
                      className="text-xs fill-rose-700 font-bold">
                  {formatSAR(d.expenses)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// Best Branch Details Component
function BestBranchDetails({ data }: { data: { branch: string; revenue: number; profit: number }[] }) {
  const bestBranch = data.reduce((best, current) => 
    current.profit > best.profit ? current : best
  );
  
  const profitMargin = ((bestBranch.profit / bestBranch.revenue) * 100).toFixed(1);
  const monthlyGrowth = 15.2; // Simulated growth percentage
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">أفضل فرع هذا الشهر</h3>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
          <Star size={16} />
          الأفضل
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-white/5 to-emerald-500/[0.02] dark:from-white/[0.04] dark:to-emerald-900/[0.03] rounded-xl p-6 border border-black/[0.03] dark:border-white/[0.04] transition-all duration-300 transform hover:scale-[1.02] hover:from-white/[0.06] hover:to-emerald-500/[0.03] dark:hover:from-white/[0.05] dark:hover:to-emerald-900/[0.04] hover:shadow-md shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 rounded-xl shadow-lg transition-transform duration-200 hover:scale-110">
            <Building2 size={24} className="text-white dark:text-white" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-emerald-700 dark:text-white">{bestBranch.branch}</h4>
            <p className="text-sm text-muted-foreground dark:text-white/90">الفرع الأكثر ربحية هذا الشهر</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600 dark:text-white mb-1">{formatSAR(bestBranch.revenue)}</div>
            <div className="text-sm text-muted-foreground dark:text-white/80">إجمالي الإيرادات</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-white mb-1">{formatSAR(bestBranch.profit)}</div>
            <div className="text-sm text-muted-foreground dark:text-white/80">صافي الربح</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-white mb-1">{profitMargin}%</div>
            <div className="text-sm text-muted-foreground dark:text-white/80">هامش الربح</div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-white/[0.04] to-emerald-500/[0.01] dark:from-white/[0.03] dark:to-emerald-900/[0.02] rounded-lg p-4 transition-all duration-300 transform hover:scale-[1.02] hover:from-white/[0.05] hover:to-emerald-500/[0.02] dark:hover:from-white/[0.04] dark:hover:to-emerald-900/[0.03] shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-emerald-600 dark:text-emerald-300" />
              <span className="text-sm font-medium dark:text-white">النمو الشهري</span>
            </div>
            <div className="text-lg font-bold text-emerald-600 dark:text-white">+{monthlyGrowth}%</div>
          </div>
          <div className="bg-gradient-to-br from-white/[0.04] to-emerald-500/[0.01] dark:from-white/[0.03] dark:to-emerald-900/[0.02] rounded-lg p-4 transition-all duration-300 transform hover:scale-[1.02] hover:from-white/[0.05] hover:to-emerald-500/[0.02] dark:hover:from-white/[0.04] dark:hover:to-emerald-900/[0.03] shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="text-blue-600 dark:text-blue-300" />
              <span className="text-sm font-medium dark:text-white">العملاء النشطين</span>
            </div>
            <div className="text-lg font-bold text-blue-600">1,247</div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
            <Award size={16} />
            حقق الهدف الشهري بنسبة 105%
          </div>
        </div>
      </div>
    </div>
  );
}

function TopPerformers({ title, data, type }: { title: string; data: any[]; type: "employees" | "customers" | "products" }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="space-y-3">
        {data.slice(0, 5).map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i === 0 ? 'bg-yellow-100 text-yellow-600' :
                i === 1 ? 'bg-gray-100 text-gray-600' :
                i === 2 ? 'bg-orange-100 text-orange-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {i + 1}
              </div>
              <div>
                <div className="font-medium text-sm">{item.name}</div>
                {type === "employees" && <div className="text-xs text-muted-foreground">{item.department}</div>}
                {type === "customers" && <div className="text-xs text-muted-foreground">{item.city}</div>}
                {type === "products" && <div className="text-xs text-muted-foreground">{item.category}</div>}
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-sm">{formatSAR(item.value)}</div>
              <div className="text-xs text-muted-foreground">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorstPerformers({ title, data, type }: { title: string; data: any[]; type: "employees" | "customers" | "products" }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-300">{title}</h3>
      <div className="space-y-3">
        {[...data]
          .sort((a, b) => a.value - b.value)
          .slice(0, 5)
          .map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-rose-50/[0.04] to-rose-100/[0.02] dark:from-rose-500/[0.03] dark:to-rose-900/[0.02] border border-black/[0.02] dark:border-white/[0.03] shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
                  i === 0 ? 'bg-gradient-to-br from-rose-100 to-rose-50 dark:from-rose-400/20 dark:to-rose-300/20 text-rose-600 dark:text-rose-200' :
                  i === 1 ? 'bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-400/20 dark:to-orange-300/20 text-orange-600 dark:text-orange-200' :
                  i === 2 ? 'bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-400/20 dark:to-yellow-300/20 text-yellow-600 dark:text-yellow-200' :
                  'bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-400/20 dark:to-gray-300/20 text-gray-600 dark:text-gray-200'
                }`}>
                  {i + 1}
                </div>
                <div>
                  <div className="font-medium text-sm dark:text-white">{item.name}</div>
                  {type === "employees" && <div className="text-xs text-muted-foreground dark:text-white/70">{item.department}</div>}
                  {type === "customers" && <div className="text-xs text-muted-foreground dark:text-white/70">{item.city}</div>}
                  {type === "products" && <div className="text-xs text-muted-foreground dark:text-white/70">{item.category}</div>}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-sm text-rose-600 dark:text-rose-300">{formatSAR(item.value)}</div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function AlertCard({ alert }: { alert: { type: "warning" | "success" | "info" | "error"; title: string; message: string; time: string } }) {
  const colors = {
    warning: {
      light: "from-yellow-50/[0.04] to-yellow-100/[0.02] border-black/[0.02] text-yellow-800",
      dark: "dark:from-yellow-500/[0.03] dark:to-yellow-900/[0.02] dark:border-white/[0.03] dark:text-yellow-300"
    },
    success: {
      light: "from-emerald-50/[0.04] to-emerald-100/[0.02] border-black/[0.02] text-emerald-800",
      dark: "dark:from-emerald-500/[0.03] dark:to-emerald-900/[0.02] dark:border-white/[0.03] dark:text-emerald-300"
    },
    info: {
      light: "from-blue-50/[0.04] to-blue-100/[0.02] border-black/[0.02] text-blue-800",
      dark: "dark:from-blue-500/[0.03] dark:to-blue-900/[0.02] dark:border-white/[0.03] dark:text-blue-300"
    },
    error: {
      light: "from-rose-50/[0.04] to-rose-100/[0.02] border-black/[0.02] text-rose-800",
      dark: "dark:from-rose-500/[0.03] dark:to-rose-900/[0.02] dark:border-white/[0.03] dark:text-rose-300"
    }
  };
  
  const icons = {
    warning: AlertTriangle,
    success: CheckCircle,
    info: Activity,
    error: AlertTriangle
  };
  
  const Icon = icons[alert.type];
  
  return (
    <div className={`p-4 rounded-lg border bg-gradient-to-br shadow-sm ${colors[alert.type].light} ${colors[alert.type].dark}`}>
      <div className="flex items-start gap-3">
        <Icon size={20} className="mt-0.5" />
        <div className="flex-1">
          <div className="font-medium text-sm dark:text-white">{alert.title}</div>
          <div className="text-xs mt-1 opacity-80 dark:text-white/80">{alert.message}</div>
          <div className="text-xs mt-2 opacity-60 dark:text-white/60">{alert.time}</div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "quarter" | "year">("month");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [isClient, setIsClient] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    // In a real app, you would refetch data here
  };

  const handlePeriodChange = (period: "week" | "month" | "quarter" | "year") => {
    setSelectedPeriod(period);
    // In a real app, you would filter data based on period
  };

  // Calculate comprehensive KPIs
  const kpis = useMemo(() => {
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const netProfit = totalRevenue - totalExpenses;
    const totalCustomers = customers.length;
    const totalEmployees = employees.length;
    const totalInventory = inventory.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0);
    const activeOrders = salesOrders.filter(order => order.status === "قيد التنفيذ").length;
    const overdueInvoices = invoices.filter(inv => inv.overdueDays > 0).length;
    
    // Calculate growth rates (simulated)
    const revenueGrowth = 12.5;
    const profitGrowth = 8.3;
    const customerGrowth = 15.2;
    const employeeGrowth = 5.1;
    
    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      totalCustomers,
      totalEmployees,
      totalInventory,
      activeOrders,
      overdueInvoices,
      revenueGrowth,
      profitGrowth,
      customerGrowth,
      employeeGrowth
    };
  }, []);

  // Generate chart data for last 6 months (deterministic to avoid hydration issues)
  const revenueData = useMemo(() => {
    const currentDate = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", 
                         "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
      months.push(monthNames[date.getMonth()]);
    }
    
    return months.map((month, i) => ({
      month,
      revenue: 450000 + (i * 25000) + (i * 10000), // Deterministic calculation
      expenses: 280000 + (i * 15000) + (i * 5000)   // Deterministic calculation
    }));
  }, []);

  const branchData = useMemo(() => {
    const branches = ["الرياض", "جدة", "الدمام", "مكة"];
    return branches.map((branch, i) => ({
      branch,
      revenue: 200000 + (i * 80000), // Deterministic calculation
      profit: 80000 + (i * 30000)     // Deterministic calculation
    }));
  }, []);

  // Top performers data (deterministic to avoid hydration issues)
  const topEmployees = useMemo(() => {
    return employees.slice(0, 5).map((emp, i) => ({
      name: emp.name,
      department: emp.department,
      value: 150000 + (i * 40000), // Deterministic calculation
      label: "مبيعات"
    }));
  }, []);

  const topCustomers = useMemo(() => {
    return customers.slice(0, 5).map((cust, i) => ({
      name: cust.name,
      city: cust.city,
      value: cust.last6moTotal,
      label: "إجمالي"
    }));
  }, []);

  const topProducts = useMemo(() => {
    return inventory.slice(0, 5).map((item, i) => ({
      name: item.product,
      category: item.category,
      value: item.currentStock * item.sellingPrice,
      label: "قيمة"
    }));
  }, []);

  // Alerts data
  const alerts = useMemo(() => [
    {
      type: "warning" as const,
      title: "مخزون منخفض",
      message: "منتج (قفازات طبية) ينتهي خلال 30 يومًا",
      time: "منذ ساعتين"
    },
    {
      type: "error" as const,
      title: "دفعة متأخرة",
      message: "عميل مستشفى خاص - تأخير 15 يومًا",
      time: "منذ 4 ساعات"
    },
    {
      type: "success" as const,
      title: "هدف محقق",
      message: "فرع الرياض حقق الهدف الشهري بنسبة 105%",
      time: "منذ 6 ساعات"
    },
    {
      type: "info" as const,
      title: "طلب جديد",
      message: "طلب مبيعات جديد بقيمة 45,000 ريال",
      time: "منذ 8 ساعات"
    }
  ], []);

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">لوحة التحكم</h1>
          <p className="text-muted-foreground mt-1">نظرة شاملة على أداء الشركة</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePeriodChange("week")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === "week" 
                  ? "bg-blue-500 text-white" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              هذا الأسبوع
            </button>
            <button
              onClick={() => handlePeriodChange("month")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === "month" 
                  ? "bg-blue-500 text-white" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              هذا الشهر
            </button>
            <button
              onClick={() => handlePeriodChange("quarter")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === "quarter" 
                  ? "bg-blue-500 text-white" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              هذا الربع
            </button>
            <button
              onClick={() => handlePeriodChange("year")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === "year" 
                  ? "bg-blue-500 text-white" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              هذا العام
            </button>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard
          title="إجمالي الإيرادات"
          value={formatSAR(kpis.totalRevenue)}
          change={kpis.revenueGrowth}
          changeType="positive"
          icon={DollarSign}
          color="bg-blue-500"
          subtitle="هذا الشهر"
          onClick={() => console.log('Revenue card clicked')}
        />
        <KPICard
          title="صافي الربح"
          value={formatSAR(kpis.netProfit)}
          change={kpis.profitGrowth}
          changeType="positive"
          icon={TrendingUp}
          color="bg-emerald-500"
          subtitle="معدل النمو"
          onClick={() => console.log('Profit card clicked')}
        />
        <KPICard
          title="إجمالي العملاء"
          value={formatNumber(kpis.totalCustomers)}
          change={kpis.customerGrowth}
          changeType="positive"
          icon={Users}
          color="bg-purple-500"
          subtitle="عملاء نشطين"
          onClick={() => console.log('Customers card clicked')}
        />
        <KPICard
          title="قيمة المخزون"
          value={formatSAR(kpis.totalInventory)}
          change={5.2}
          changeType="positive"
          icon={Package}
          color="bg-orange-500"
          subtitle="إجمالي القيمة"
          onClick={() => console.log('Inventory card clicked')}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard
          title="الموظفين"
          value={formatNumber(kpis.totalEmployees)}
          change={kpis.employeeGrowth}
          changeType="positive"
          icon={Users}
          color="bg-indigo-500"
          subtitle="موظفين نشطين"
          onClick={() => console.log('Employees card clicked')}
        />
        <KPICard
          title="الطلبات النشطة"
          value={formatNumber(kpis.activeOrders)}
          change={-2.1}
          changeType="negative"
          icon={ShoppingCart}
          color="bg-cyan-500"
          subtitle="قيد التنفيذ"
          onClick={() => console.log('Active orders card clicked')}
        />
        <KPICard
          title="الفواتير المتأخرة"
          value={formatNumber(kpis.overdueInvoices)}
          change={-8.5}
          changeType="positive"
          icon={AlertTriangle}
          color="bg-rose-500"
          subtitle="تحتاج متابعة"
          onClick={() => console.log('Overdue invoices card clicked')}
        />
        <KPICard
          title="المصروفات"
          value={formatSAR(kpis.totalExpenses)}
          change={3.2}
          changeType="negative"
          icon={TrendingDown}
          color="bg-amber-500"
          subtitle="هذا الشهر"
          onClick={() => console.log('Expenses card clicked')}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6">
          {isClient ? <RevenueChart data={revenueData} /> : <div className="h-[300px] flex items-center justify-center text-muted-foreground">جاري التحميل...</div>}
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          {isClient ? <BestBranchDetails data={branchData} /> : <div className="h-[300px] flex items-center justify-center text-muted-foreground">جاري التحميل...</div>}
        </div>
      </div>

      {/* Branch Summary Cards */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">ملخص الفروع</h2>
          <button className="text-sm text-muted-foreground hover:text-foreground">
            عرض التفاصيل
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {branchData.map((branch, i) => (
            <BranchSummaryCard
              key={i}
              branch={branch.branch}
              revenue={branch.revenue}
              profit={branch.profit}
              customers={Math.floor(50 + i * 15)}
              employees={Math.floor(8 + i * 3)}
              performance={branch.profit > 150000 ? "أداء ممتاز" : branch.profit > 100000 ? "أداء جيد" : "أداء متوسط"}
            />
          ))}
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <TopPerformers title="أفضل الموظفين" data={topEmployees} type="employees" />
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <TopPerformers title="أفضل العملاء" data={topCustomers} type="customers" />
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <TopPerformers title="أفضل المنتجات" data={topProducts} type="products" />
        </div>
      </div>

      {/* Worst Performers */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="rounded-xl border border-black/[0.03] dark:border-white/[0.04] bg-gradient-to-br from-rose-50/[0.03] to-rose-100/[0.02] dark:from-rose-500/[0.02] dark:to-rose-900/[0.03] p-6 shadow-sm">
          <WorstPerformers title="أضعف الموظفين" data={worstEmployees} type="employees" />
        </div>
        <div className="rounded-xl border border-black/[0.03] dark:border-white/[0.04] bg-gradient-to-br from-rose-50/[0.03] to-rose-100/[0.02] dark:from-rose-500/[0.02] dark:to-rose-900/[0.03] p-6 shadow-sm">
          <WorstPerformers title="أضعف العملاء" data={worstCustomers} type="customers" />
        </div>
        <div className="rounded-xl border border-black/[0.03] dark:border-white/[0.04] bg-gradient-to-br from-rose-50/[0.03] to-rose-100/[0.02] dark:from-rose-500/[0.02] dark:to-rose-900/[0.03] p-6 shadow-sm">
          <WorstPerformers title="أضعف المنتجات" data={worstProducts} type="products" />
        </div>
      </div>

      {/* Alerts Section */}
      <div className="rounded-xl border border-black/[0.03] dark:border-white/[0.04] bg-gradient-to-br from-white/5 to-slate-500/[0.02] dark:from-white/[0.04] dark:to-slate-900/[0.03] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold dark:text-white">التنبيهات والمتابعة</h2>
          <button className="text-sm text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white">
            عرض الكل
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert, i) => (
            <AlertCard key={i} alert={alert} />
          ))}
        </div>
      </div>
    </div>
  );
}