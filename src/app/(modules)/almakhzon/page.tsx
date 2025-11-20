"use client";

import { useMemo, useState, useEffect, type ChangeEvent } from "react";
import { inventory, inventoryCategories, inventoryMovements, type InventoryItem, type InventoryMovement } from "@/lib/mockData";
import { formatNumber, formatSAR } from "@/lib/format";
import { 
  Boxes, 
  AlertTriangle, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Clock, 
  ShoppingCart, 
  Activity,
  Plus,
  Eye,
  Truck,
  Zap,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  FileText,
  Pencil,
  Printer,
  BarChart3
} from "lucide-react";

function statusTag(status: InventoryItem["status"]) {
  switch (status) {
    case "متوفر":
      return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
    case "منخفض":
      return "bg-amber-500/15 text-amber-500 border-amber-500/30";
    case "نفد":
      return "bg-rose-500/15 text-rose-500 border-rose-500/30";
    case "منتهي الصلاحية":
      return "bg-red-500/15 text-red-500 border-red-500/30";
  }
}

function conditionTag(condition: InventoryItem["condition"]) {
  switch (condition) {
    case "سليم":
      return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
    case "تالف":
      return "bg-rose-500/15 text-rose-500 border-rose-500/30";
    case "منتهي الصلاحية":
      return "bg-red-500/15 text-red-500 border-red-500/30";
    case "مشكوك فيه":
      return "bg-amber-500/15 text-amber-500 border-amber-500/30";
  }
}

function movementTypeTag(type: InventoryMovement["type"]) {
  switch (type) {
    case "دخول":
      return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
    case "خروج":
      return "bg-rose-500/15 text-rose-500 border-rose-500/30";
    case "تعديل":
      return "bg-blue-500/15 text-blue-500 border-blue-500/30";
    case "نقل":
      return "bg-purple-500/15 text-purple-500 border-purple-500/30";
    case "تلف":
      return "bg-red-500/15 text-red-500 border-red-500/30";
  }
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "مستهلكات طبية":
      return <Package size={24} className="text-blue-500" />;
    case "أجهزة طبية":
      return <Activity size={24} className="text-emerald-500" />;
    case "لوازم مكتبية":
      return <Boxes size={24} className="text-purple-500" />;
    case "أدوية":
      return <Zap size={24} className="text-amber-500" />;
    case "معدات تعقيم":
      return <AlertTriangle size={24} className="text-rose-500" />;
    case "قساطر وأدوات":
      return <Truck size={24} className="text-indigo-500" />;
    default:
      return <Boxes size={24} className="text-gray-500" />;
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case "مستهلكات طبية":
      return "border-blue-500/20 bg-blue-500/5";
    case "أجهزة طبية":
      return "border-emerald-500/20 bg-emerald-500/5";
    case "لوازم مكتبية":
      return "border-purple-500/20 bg-purple-500/5";
    case "أدوية":
      return "border-amber-500/20 bg-amber-500/5";
    case "معدات تعقيم":
      return "border-rose-500/20 bg-rose-500/5";
    case "قساطر وأدوات":
      return "border-indigo-500/20 bg-indigo-500/5";
    default:
      return "border-gray-500/20 bg-gray-500/5";
  }
}

// Progress Bar Component
function ProgressBar({ percentage, color = "bg-blue-500" }: { percentage: number; color?: string }) {
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <div 
        className={`h-2 rounded-full transition-all duration-300 ${color}`}
        style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
      />
    </div>
  );
}

export default function Page() {
  const [items, setItems] = useState<InventoryItem[]>(inventory);
  const [selectedCategory, setSelectedCategory] = useState<string | "">("");
  const [selectedBranch, setSelectedBranch] = useState<string | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalValue = items.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0);
    const lowStockItems = items.filter(item => item.status === "منخفض" || item.status === "نفد").length;
    const slowMovingItems = items.filter(item => item.slowMoving).length;
    const criticalItems = items.filter(item => item.critical).length;
    const expiringItems = items.filter(item => item.daysToExpiry <= 30).length;
    const totalItems = items.length;
    const avgStockPercentage = items.length > 0 ? Math.round(items.reduce((sum, item) => sum + item.stockPercentage, 0) / items.length) : 0;
    const reorderNeeded = items.filter(item => item.currentStock <= item.reorderPoint).length;

    return {
      totalValue,
      lowStockItems,
      slowMovingItems,
      criticalItems,
      expiringItems,
      totalItems,
      avgStockPercentage,
      reorderNeeded
    };
  }, [items]);

  // Filter inventory for urgent reorder items
  const urgentReorderItems = useMemo(() => {
    return items.filter(item => item.currentStock <= item.reorderPoint);
  }, [items]);

  // Filter categories
  const filteredCategories = useMemo(() => {
    return inventoryCategories.filter(category => {
      if (selectedBranch) {
        const categoryItems = items.filter(item => item.category === category.name);
        return categoryItems.some(item => item.branch === selectedBranch);
      }
      return true;
    });
  }, [items, selectedBranch]);

  // Filter inventory items for the main table
  const filteredInventory = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = [item.product, item.sku, item.barcode, item.supplier].some(field => 
        field.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
      const matchesBranch = selectedBranch ? item.branch === selectedBranch : true;
      
      return matchesSearch && matchesCategory && matchesBranch;
    });
  }, [items, searchQuery, selectedCategory, selectedBranch]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredInventory.length / rowsPerPage));
  const pagedInventory = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredInventory.slice(start, start + rowsPerPage);
  }, [filteredInventory, page]);

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, selectedBranch, searchQuery]);

  const uniqueBranches = useMemo(() => {
    const branches = new Set(items.map(item => item.branch));
    return Array.from(branches);
  }, [items]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set(items.map(item => item.category));
    return Array.from(categories);
  }, [items]);

  function printItemSummary(item: InventoryItem) {
    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) return;
    const html = `
      <html dir="rtl" lang="ar">
        <head>
          <meta charSet="utf-8" />
          <title>طباعة - ${item.product}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            h1 { font-size: 18px; margin: 0 0 12px; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 6px 8px; border: 1px solid #ddd; font-size: 12px; }
            .section { margin: 16px 0; }
          </style>
        </head>
        <body>
          <h1>ملخص الصنف</h1>
          <div class="section">
            <table>
              <tr><td>اسم المنتج</td><td>${item.product}</td></tr>
              <tr><td>SKU</td><td>${item.sku}</td></tr>
              <tr><td>الباركود</td><td>${item.barcode}</td></tr>
              <tr><td>الفئة</td><td>${item.category}</td></tr>
              <tr><td>المخزن</td><td>${item.warehouse}</td></tr>
              <tr><td>الموقع</td><td>${item.bin}</td></tr>
              <tr><td>الكمية الحالية</td><td>${item.currentStock}</td></tr>
              <tr><td>الحد الأقصى</td><td>${item.maxStock}</td></tr>
              <tr><td>نقطة إعادة الطلب</td><td>${item.reorderPoint}</td></tr>
              <tr><td>متوسط التكلفة</td><td>${item.avgCost}</td></tr>
              <tr><td>سعر البيع</td><td>${item.sellingPrice}</td></tr>
              <tr><td>المورد</td><td>${item.supplier}</td></tr>
            </table>
          </div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  }

  return (
    <div className="space-y-6">
      {/* Top Metrics - 8 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/15 text-primary border border-primary/20">
              <DollarSign size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">إجمالي قيمة المخزون</div>
              <div className="text-xl font-semibold">{formatSAR(metrics.totalValue)}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/15 text-rose-500 border border-rose-500/20">
              <AlertTriangle size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">أصناف مهددة بالنفاذ</div>
              <div className="text-xl font-semibold">{formatNumber(metrics.lowStockItems)}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/15 text-amber-500 border border-amber-500/20">
              <TrendingDown size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">أصناف بطيئة الدوران</div>
              <div className="text-xl font-semibold">{formatNumber(metrics.slowMovingItems)}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/15 text-violet-500 border border-violet-500/20">
              <Package size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">إجمالي عدد الأصناف</div>
              <div className="text-xl font-semibold">{formatNumber(metrics.totalItems)}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/15 text-red-500 border border-red-500/20">
              <Clock size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">أصناف منتهية الصلاحية</div>
              <div className="text-xl font-semibold">{formatNumber(metrics.expiringItems)}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/15 text-indigo-500 border border-indigo-500/20">
              <Activity size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">أصناف حرجة</div>
              <div className="text-xl font-semibold">{formatNumber(metrics.criticalItems)}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">
              <ShoppingCart size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">طلبات إعادة توريد مطلوبة</div>
              <div className="text-xl font-semibold">{formatNumber(metrics.reorderNeeded)}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/15 text-sky-500 border border-sky-500/20">
              <Boxes size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">متوسط نسبة المخزون</div>
              <div className="text-xl font-semibold">{formatNumber(metrics.avgStockPercentage)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
        <h1 className="text-xl font-semibold">المخزون</h1>
        <div className="flex flex-wrap gap-2 flex-1">
          <div className="relative flex-1 min-w-0 sm:min-w-[18rem] md:min-w-[28rem] lg:min-w-[36rem] xl:min-w-[44rem]">
            <Search size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              className="px-3 py-2 pr-10 rounded-md border border-border bg-card text-sm w-full"
              placeholder="بحث بالمنتج، SKU، أو المورد"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2 rounded-md border border-border bg-card text-sm shrink-0"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">كل الفئات</option>
            {uniqueCategories.map(category => <option key={category} value={category}>{category}</option>)}
          </select>
          <select
            className="px-3 py-2 rounded-md border border-border bg-card text-sm shrink-0"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="">كل الفروع</option>
            {uniqueBranches.map(branch => <option key={branch} value={branch}>{branch}</option>)}
          </select>
          <button 
            className="px-3 py-2 rounded-md border border-primary bg-primary text-primary-foreground text-sm shrink-0"
            onClick={() => setShowAddItemModal(true)}
          >
            إضافة صنف جديد
          </button>
        </div>
      </div>

      {/* Inventory Health Map - Category Cards */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Activity size={20} />
            خريطة صحة المخزون حسب الفئة
          </h2>
          <div className="text-sm text-muted-foreground">
            {selectedCategory ? (
              <button
                onClick={() => setSelectedCategory("")}
                className="px-3 py-1.5 rounded-md border border-border hover:bg-muted text-xs"
              >
                عرض الكل
              </button>
            ) : (
              <span>6 فئات رئيسية</span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category, index) => (
            <div 
              key={index} 
              className={`rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg cursor-pointer ${getCategoryColor(category.name)} ${selectedCategory === category.name ? 'border-primary ring-2 ring-primary/20 shadow-xl' : ''}`}
              onClick={() => setSelectedCategory(selectedCategory === category.name ? "" : category.name)}
              aria-pressed={selectedCategory === category.name}
              role="button"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getCategoryIcon(category.name)}
                  <div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{formatNumber(category.totalItems)} صنف</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{formatSAR(category.totalValue)}</div>
                  <div className="text-xs text-muted-foreground">القيمة الإجمالية</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>مستوى المخزون</span>
                    <span className="font-semibold">{formatNumber(category.avgStockPercentage)}%</span>
                  </div>
                  <ProgressBar 
                    percentage={category.avgStockPercentage} 
                    color={category.avgStockPercentage > 70 ? "bg-emerald-500" : category.avgStockPercentage > 40 ? "bg-amber-500" : "bg-rose-500"}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="text-lg font-semibold text-amber-600 dark:text-amber-400">{formatNumber(category.lowStockItems)}</div>
                    <div className="text-xs text-muted-foreground">منخفض</div>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{formatNumber(category.slowMovingItems)}</div>
                    <div className="text-xs text-muted-foreground">بطيء</div>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                    <div className="text-lg font-semibold text-rose-600 dark:text-rose-400">{formatNumber(category.criticalItems)}</div>
                    <div className="text-xs text-muted-foreground">حرج</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Urgent Action Table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle size={20} className="text-rose-500" />
              جدول الإجراءات العاجلة
            </h2>
            <div className="text-sm text-muted-foreground">
              {formatNumber(urgentReorderItems.length)} صنف يحتاج إعادة توريد
            </div>
          </div>
        </div>
        
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="p-3 text-right">المنتج</th>
                <th className="p-3 text-right">المخزن/الموقع</th>
                <th className="p-3 text-right">المخزون الحالي</th>
                <th className="p-3 text-right">نقطة إعادة التوريد</th>
                <th className="p-3 text-right">الكمية المطلوبة</th>
                <th className="p-3 text-right">المورد المفضل</th>
                <th className="p-3 text-right">الحالة</th>
                <th className="p-3 text-right">الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {urgentReorderItems.map((item, index) => (
                <tr key={index} className="border-t border-border hover:bg-muted/50">
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{item.product}</div>
                      <div className="text-xs text-muted-foreground">{item.id}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{item.branch}</div>
                      <div className="text-xs text-muted-foreground">دفعة: {item.batch}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-center">
                      <div className="font-semibold text-rose-500">{formatNumber(item.currentStock)}</div>
                      <div className="text-xs text-muted-foreground">من {formatNumber(item.maxStock)}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-center">
                      <div className="font-semibold">{formatNumber(item.reorderPoint)}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-center">
                      <div className="font-semibold text-emerald-500">
                        {formatNumber(item.maxStock - item.currentStock)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatSAR((item.maxStock - item.currentStock) * item.unitCost)}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Truck size={14} className="text-muted-foreground" />
                      <span className="text-sm">{item.supplier}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-[11px] rounded-md border ${statusTag(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button className="px-3 py-1.5 rounded-md border border-emerald-500 bg-emerald-500 text-white text-xs hover:bg-emerald-600 transition-colors">
                      إنشاء أمر شراء
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {urgentReorderItems.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <Package size={48} className="mx-auto mb-4 opacity-50" />
            <p>لا توجد أصناف تحتاج إعادة توريد في الوقت الحالي</p>
          </div>
        )}
      </div>

      {/* Comprehensive Product Detail Table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 size={20} />
              جدول تفاصيل المنتجات الكامل
            </h2>
            <div className="text-sm text-muted-foreground">
              عرض {formatNumber(pagedInventory.length)} من {formatNumber(filteredInventory.length)} منتج
            </div>
          </div>
        </div>
        
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="p-3 text-right">اسم المنتج</th>
                <th className="p-3 text-right">الفئة</th>
                <th className="p-3 text-right">رمز الصنف</th>
                <th className="p-3 text-right">المخزن/الموقع</th>
                <th className="p-3 text-right">الكمية الحالية</th>
                <th className="p-3 text-right">نقطة إعادة الطلب</th>
                <th className="p-3 text-right">المورد الأساسي</th>
                <th className="p-3 text-right">تاريخ آخر حركة</th>
                <th className="p-3 text-right">متوسط التكلفة</th>
                <th className="p-3 text-right">سعر البيع</th>
                <th className="p-3 text-right">الحالة</th>
                <th className="p-3 text-right">الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {pagedInventory.map((item, index) => (
                <tr key={index} className="border-t border-border hover:bg-muted/50">
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{item.product}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 text-[11px] rounded-md border bg-secondary/30 border-border">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3">
                    <div>
                      <div className="font-mono text-xs">{item.sku}</div>
                      <div className="text-xs text-muted-foreground">{item.barcode}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{item.warehouse}</div>
                      <div className="text-xs text-muted-foreground">{item.bin}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-center">
                      <div className="font-semibold">{formatNumber(item.currentStock)}</div>
                      <div className="text-xs text-muted-foreground">من {formatNumber(item.maxStock)}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-center">
                      <div className="font-semibold">{formatNumber(item.reorderPoint)}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{item.supplier}</div>
                      <div className="text-xs text-muted-foreground">{item.supplierContact}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-center">
                      <div className="font-medium">{item.lastMovement}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-center">
                      <div className="font-semibold">{formatSAR(item.avgCost)}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-center">
                      <div className="font-semibold text-emerald-600 dark:text-emerald-400">{formatSAR(item.sellingPrice)}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-1 text-[10px] rounded-md border ${statusTag(item.status)}`}>
                        {item.status}
                      </span>
                      <span className={`px-2 py-1 text-[10px] rounded-md border ${conditionTag(item.condition)}`}>
                        {item.condition}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1.5 rounded-md border border-blue-400/40 text-blue-600 dark:text-blue-300 hover:bg-blue-500/10"
                        title="عرض سريع"
                        onClick={() => {
                          setSelectedProduct(item);
                          setShowProductModal(true);
                        }}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-1.5 rounded-md border border-amber-400/40 text-amber-600 dark:text-amber-300 hover:bg-amber-500/10"
                        title="تعديل"
                        onClick={() => {
                          setEditingItem(item);
                          setShowEditItemModal(true);
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="p-1.5 rounded-md border border-rose-400/40 text-rose-600 dark:text-rose-300 hover:bg-rose-500/10"
                        title="حذف"
                        onClick={() => {
                          if (window.confirm(`هل تريد حذف المنتج ${item.product} (${item.sku}) نهائيًا؟`)) {
                            setItems(prev => prev.filter(i => i.id !== item.id));
                            if (selectedProduct?.id === item.id) {
                              setShowProductModal(false);
                              setSelectedProduct(null);
                            }
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        className="p-1.5 rounded-md border border-violet-400/40 text-violet-600 dark:text-violet-300 hover:bg-violet-500/10"
                        title="طباعة"
                        onClick={() => printItemSummary(item)}
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
        
        {/* Pagination */}
        <div className="flex items-center justify-between p-3 border-t border-border">
          <div className="text-sm text-muted-foreground">
            عرض {formatNumber(pagedInventory.length)} من {formatNumber(filteredInventory.length)} منتج
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-md border border-border bg-card text-sm disabled:opacity-50"
            >
              السابق
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1.5 rounded-md border text-sm ${
                    page === pageNum ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-muted"
                  }`}
                >
                  {formatNumber(pageNum)}
                </button>
              );
            })}
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

      {/* Category Details (if selected) */}
      {selectedCategory && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">تفاصيل فئة: {selectedCategory}</h2>
            <button 
              onClick={() => setSelectedCategory("")}
              className="px-3 py-1 rounded-md border border-border hover:bg-muted text-sm"
            >
              إغلاق
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventory
              .filter(item => item.category === selectedCategory)
              .map((item, index) => (
                <div key={index} className="rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium">{item.product}</div>
                      <div className="text-xs text-muted-foreground">{item.branch}</div>
                    </div>
                    <span className={`px-2 py-1 text-[10px] rounded-md border ${statusTag(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>المخزون</span>
                      <span>{formatNumber(item.currentStock)} / {formatNumber(item.maxStock)}</span>
                    </div>
                    <ProgressBar 
                      percentage={item.stockPercentage}
                      color={item.stockPercentage > 70 ? "bg-emerald-500" : item.stockPercentage > 40 ? "bg-amber-500" : "bg-rose-500"}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>التكلفة: {formatSAR(item.unitCost)}</span>
                      <span>القيمة: {formatSAR(item.currentStock * item.unitCost)}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowProductModal(false)} />
          <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-6xl rounded-xl border border-border bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="text-xl font-semibold">تفاصيل المنتج - {selectedProduct.product}</div>
              <button className="px-4 py-2 rounded-md border border-border hover:bg-muted text-sm" onClick={() => setShowProductModal(false)}>إغلاق</button>
            </div>
            
            {/* Product Header */}
            <div className="rounded-lg border border-border bg-muted/30 p-4 mb-6">
              <h3 className="text-lg font-semibold mb-4">معلومات المنتج الأساسية</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">اسم المنتج</label>
                  <div className="font-semibold">{selectedProduct.product}</div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">رمز الصنف (SKU)</label>
                  <div className="font-mono font-semibold text-primary">{selectedProduct.sku}</div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">الباركود</label>
                  <div className="font-mono text-sm">{selectedProduct.barcode}</div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">الفئة</label>
                  <div className="font-medium">{selectedProduct.category}</div>
                </div>
              </div>
            </div>

            {/* Inventory Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">تفاصيل المخزون</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">المخزن</label>
                    <div className="font-medium">{selectedProduct.warehouse}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">الموقع/الرف</label>
                    <div className="font-medium">{selectedProduct.bin}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">الكمية الحالية</label>
                    <div className="font-bold text-xl text-primary">{formatNumber(selectedProduct.currentStock)}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">الحد الأقصى</label>
                    <div className="font-semibold">{formatNumber(selectedProduct.maxStock)}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">نقطة إعادة الطلب</label>
                    <div className="font-semibold">{formatNumber(selectedProduct.reorderPoint)}</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">التكاليف والأسعار</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">متوسط التكلفة</label>
                    <div className="font-bold text-xl text-primary">{formatSAR(selectedProduct.avgCost)}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">سعر البيع</label>
                    <div className="font-bold text-xl text-emerald-600 dark:text-emerald-400">{formatSAR(selectedProduct.sellingPrice)}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">هامش الربح</label>
                    <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatSAR(selectedProduct.sellingPrice - selectedProduct.avgCost)} 
                      ({Math.round(((selectedProduct.sellingPrice - selectedProduct.avgCost) / selectedProduct.avgCost) * 100)}%)
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">القيمة الإجمالية</label>
                    <div className="font-semibold">{formatSAR(selectedProduct.currentStock * selectedProduct.avgCost)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Supplier and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">معلومات المورد</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">المورد الأساسي</label>
                    <div className="font-medium">{selectedProduct.supplier}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">جهة الاتصال</label>
                    <div className="font-medium">{selectedProduct.supplierContact}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">الحد الأدنى للطلب</label>
                    <div className="font-semibold">{formatNumber(selectedProduct.minOrderQty)}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">وقت التوريد</label>
                    <div className="font-semibold">{selectedProduct.leadTime} يوم</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">الحالة والمعلومات</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">حالة المخزون</label>
                    <span className={`px-3 py-1 text-sm rounded-md border ${statusTag(selectedProduct.status)}`}>
                      {selectedProduct.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">حالة المنتج</label>
                    <span className={`px-3 py-1 text-sm rounded-md border ${conditionTag(selectedProduct.condition)}`}>
                      {selectedProduct.condition}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">تاريخ آخر حركة</label>
                    <div className="font-medium">{selectedProduct.lastMovement}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">تاريخ انتهاء الصلاحية</label>
                    <div className="font-medium">{selectedProduct.expiry}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Movement History */}
            <div className="rounded-lg border border-border bg-card mb-6">
              <div className="p-4 border-b border-border">
                <h3 className="text-lg font-semibold">تاريخ الحركات (آخر 5 حركات)</h3>
              </div>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="p-3 text-right">التاريخ</th>
                      <th className="p-3 text-right">نوع الحركة</th>
                      <th className="p-3 text-right">الكمية</th>
                      <th className="p-3 text-right">المستخدم</th>
                      <th className="p-3 text-right">المرجع</th>
                      <th className="p-3 text-right">ملاحظات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryMovements
                      .filter(movement => movement.productId === selectedProduct.id)
                      .slice(0, 5)
                      .map((movement, index) => (
                        <tr key={index} className="border-t border-border">
                          <td className="p-3">{movement.date}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 text-[10px] rounded-md border ${movementTypeTag(movement.type)}`}>
                              {movement.type}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={movement.quantity > 0 ? "text-emerald-600" : "text-rose-600"}>
                              {movement.quantity > 0 ? "+" : ""}{formatNumber(movement.quantity)}
                            </span>
                          </td>
                          <td className="p-3">{movement.user}</td>
                          <td className="p-3 font-mono text-xs">{movement.reference}</td>
                          <td className="p-3">{movement.notes}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes */}
            {selectedProduct.notes && (
              <div className="rounded-lg border border-border bg-muted/30 p-4 mb-6">
                <h3 className="text-lg font-semibold mb-2">ملاحظات</h3>
                <p className="text-sm text-muted-foreground">{selectedProduct.notes}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                onClick={() => setShowProductModal(false)}
                className="px-6 py-2 rounded-md border border-border bg-card text-sm hover:bg-muted"
              >
                إغلاق
              </button>
              <button className="px-6 py-2 rounded-md border border-blue-500 bg-blue-500 text-white text-sm hover:bg-blue-600">
                تعديل المنتج
              </button>
              <button className="px-6 py-2 rounded-md border border-emerald-500 bg-emerald-500 text-white text-sm hover:bg-emerald-600">
                إنشاء أمر شراء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditItemModal && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowEditItemModal(false)} />
          <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-3xl rounded-xl border border-border bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">تعديل المنتج - {editingItem.product}</h2>
              <button className="px-2 py-1 rounded-md border border-border hover:bg-muted text-xs" onClick={() => setShowEditItemModal(false)}>إغلاق</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setItems(prev => prev.map(it => it.id === editingItem.id ? editingItem : it));
              if (selectedProduct && selectedProduct.id === editingItem.id) {
                setSelectedProduct(editingItem);
              }
              setShowEditItemModal(false);
            }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">اسم المنتج</label>
                  <input
                    value={editingItem.product}
                    onChange={(e) => setEditingItem({ ...editingItem, product: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">التصنيف</label>
                  <select
                    value={editingItem.category}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setEditingItem({ ...editingItem, category: e.target.value as InventoryItem["category"] })}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm"
                  >
                    {uniqueCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">المخزن</label>
                  <input
                    value={editingItem.warehouse}
                    onChange={(e) => setEditingItem({ ...editingItem, warehouse: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">الموقع/الرف</label>
                  <input
                    value={editingItem.bin}
                    onChange={(e) => setEditingItem({ ...editingItem, bin: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">الكمية الحالية</label>
                  <input
                    type="number"
                    min="0"
                    value={editingItem.currentStock}
                    onChange={(e) => setEditingItem({ ...editingItem, currentStock: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">الحد الأقصى</label>
                  <input
                    type="number"
                    min="0"
                    value={editingItem.maxStock}
                    onChange={(e) => setEditingItem({ ...editingItem, maxStock: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">نقطة إعادة الطلب</label>
                  <input
                    type="number"
                    min="0"
                    value={editingItem.reorderPoint}
                    onChange={(e) => setEditingItem({ ...editingItem, reorderPoint: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">متوسط التكلفة</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingItem.avgCost}
                    onChange={(e) => setEditingItem({ ...editingItem, avgCost: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">سعر البيع</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingItem.sellingPrice}
                    onChange={(e) => setEditingItem({ ...editingItem, sellingPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">حالة المخزون</label>
                  <select
                    value={editingItem.status}
                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as InventoryItem["status"] })}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm"
                  >
                    <option value="متوفر">متوفر</option>
                    <option value="منخفض">منخفض</option>
                    <option value="نفد">نفد</option>
                    <option value="منتهي الصلاحية">منتهي الصلاحية</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">حالة المنتج</label>
                  <select
                    value={editingItem.condition}
                    onChange={(e) => setEditingItem({ ...editingItem, condition: e.target.value as InventoryItem["condition"] })}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm"
                  >
                    <option value="سليم">سليم</option>
                    <option value="تالف">تالف</option>
                    <option value="منتهي الصلاحية">منتهي الصلاحية</option>
                    <option value="مشكوك فيه">مشكوك فيه</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button type="button" onClick={() => setShowEditItemModal(false)} className="px-6 py-2 rounded-md border border-border bg-card text-sm hover:bg-muted">إلغاء</button>
                <button type="submit" className="px-6 py-2 rounded-md border border-primary bg-primary text-primary-foreground text-sm hover:bg-primary/90">حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddItemModal(false)} />
          <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="text-xl font-semibold">إضافة صنف جديد</div>
              <button className="px-4 py-2 rounded-md border border-border hover:bg-muted text-sm" onClick={() => setShowAddItemModal(false)}>إغلاق</button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newItem = {
                product: formData.get("product"),
                sku: formData.get("sku"),
                category: formData.get("category"),
                supplier: formData.get("supplier"),
                sellingPrice: formData.get("sellingPrice"),
                avgCost: formData.get("avgCost"),
                reorderPoint: formData.get("reorderPoint"),
                defaultLocation: formData.get("defaultLocation"),
                initialQuantity: formData.get("initialQuantity"),
                barcode: formData.get("barcode"),
                notes: formData.get("notes")
              };
              console.log("New Item Data:", newItem);
              setShowAddItemModal(false);
            }} className="space-y-6">
              
              {/* Basic Information Section */}
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <h3 className="text-lg font-semibold mb-4">المعلومات الأساسية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="product" className="block text-sm font-medium text-foreground mb-1">اسم المنتج *</label>
                    <input 
                      type="text" 
                      id="product" 
                      name="product" 
                      className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="sku" className="block text-sm font-medium text-foreground mb-1">رمز الصنف (SKU) *</label>
                    <input 
                      type="text" 
                      id="sku" 
                      name="sku" 
                      className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm font-mono" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-foreground mb-1">التصنيف *</label>
                    <select 
                      id="category" 
                      name="category" 
                      className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm" 
                      required
                    >
                      <option value="">اختر التصنيف</option>
                      {uniqueCategories.map(category => <option key={category} value={category}>{category}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="supplier" className="block text-sm font-medium text-foreground mb-1">المورد الأساسي *</label>
                    <select 
                      id="supplier" 
                      name="supplier" 
                      className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm" 
                      required
                    >
                      <option value="">اختر المورد</option>
                      {Array.from(new Set(inventory.map(item => item.supplier))).map(supplier => (
                        <option key={supplier} value={supplier}>{supplier}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="barcode" className="block text-sm font-medium text-foreground mb-1">الباركود</label>
                    <input 
                      type="text" 
                      id="barcode" 
                      name="barcode" 
                      className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm font-mono" 
                    />
                  </div>
                </div>
              </div>

              {/* Inventory & Cost Information Section */}
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <h3 className="text-lg font-semibold mb-4">معلومات المخزون والتكلفة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="sellingPrice" className="block text-sm font-medium text-foreground mb-1">سعر البيع (ريال) *</label>
                    <input 
                      type="number" 
                      id="sellingPrice" 
                      name="sellingPrice" 
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="avgCost" className="block text-sm font-medium text-foreground mb-1">متوسط التكلفة (ريال) *</label>
                    <input 
                      type="number" 
                      id="avgCost" 
                      name="avgCost" 
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="reorderPoint" className="block text-sm font-medium text-foreground mb-1">نقطة إعادة الطلب *</label>
                    <input 
                      type="number" 
                      id="reorderPoint" 
                      name="reorderPoint" 
                      min="0"
                      className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="defaultLocation" className="block text-sm font-medium text-foreground mb-1">الموقع الافتراضي *</label>
                    <select 
                      id="defaultLocation" 
                      name="defaultLocation" 
                      className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm" 
                      required
                    >
                      <option value="">اختر الموقع</option>
                      {Array.from(new Set(inventory.map(item => item.warehouse))).map(warehouse => (
                        <option key={warehouse} value={warehouse}>{warehouse}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="initialQuantity" className="block text-sm font-medium text-foreground mb-1">الكمية الأولية *</label>
                    <input 
                      type="number" 
                      id="initialQuantity" 
                      name="initialQuantity" 
                      min="0"
                      className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm" 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <h3 className="text-lg font-semibold mb-4">معلومات إضافية</h3>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-1">ملاحظات</label>
                  <textarea 
                    id="notes" 
                    name="notes" 
                    rows={3}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-sm" 
                    placeholder="أي ملاحظات إضافية حول المنتج..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="px-6 py-2 rounded-md border border-border bg-card text-sm hover:bg-muted"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-md border border-primary bg-primary text-primary-foreground text-sm hover:bg-primary/90"
                >
                  إضافة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}