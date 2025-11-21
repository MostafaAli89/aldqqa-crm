export const metrics = [
  { title: "إجمالي المبيعات", value: "SAR 1,240,000", trend: 12 },
  { title: "التحصيلات", value: "SAR 980,500", trend: 8 },
  { title: "رصيد العملاء", value: "SAR 420,300", trend: -3 },
  { title: "قيمة المخزون", value: "SAR 2,150,000", trend: 5 },
];

export const alerts = [
  { title: "تنبيه صلاحية", detail: "منتج (قفازات طبية) ينتهي خلال 30 يومًا" },
  { title: "طلب شراء", detail: "مطلوب إعادة طلب لقساطر قلبية (الرياض)" },
  { title: "دفعة متأخرة", detail: "عميل مستشفى خاص - تأخير 15 يومًا" },
  { title: "دفعة تابي/تمارا", detail: "قسط مستحق لعميل تجزئة خلال 3 أيام" },
];

export const charts = {
  branches: [
    { branch: "الرياض", total: "SAR 420,000" },
    { branch: "جدة", total: "SAR 360,000" },
    { branch: "الدمام", total: "SAR 270,000" },
    { branch: "مكة", total: "SAR 190,000" },
  ],
};

// Customers (50 realistic Arabic records)
export type CustomerClassification = "VIP" | "High Value" | "Risk";
export type CustomerSegment = "B2B" | "B2C";
export type CustomerCity = "الرياض" | "جدة" | "الدمام" | "مكة";

export type Customer = {
  name: string;
  city: CustomerCity;
  segment: CustomerSegment;
  classification: CustomerClassification;
  lastOrder: string; // ISO date
  credit: number; // SAR
  overdue: number; // رصيد التحصيل المتأخر
  last6moTotal: number; // إجمالي قيمة الطلبات لآخر 6 أشهر
  contactName: string; // اسم مسؤول المشتريات
  contactPhone: string; // رقم مسؤول المشتريات
  visitCount30d: number; // عدد زيارات المندوبين آخر 30 يوم
};

// Base customers without derived fields (50 records)
const baseCustomers: Array<{
  name: string;
  city: CustomerCity;
  segment: CustomerSegment;
  classification: CustomerClassification;
  lastOrder: string;
  credit: number;
}> = [
  { name: "مستشفى الملك خالد", city: "الرياض", segment: "B2B", classification: "VIP", lastOrder: "2025-09-22", credit: 500000 },
  { name: "مدينة الملك فهد الطبية", city: "الرياض", segment: "B2B", classification: "High Value", lastOrder: "2025-09-18", credit: 420000 },
  { name: "مستشفى الملك عبدالعزيز", city: "جدة", segment: "B2B", classification: "High Value", lastOrder: "2025-09-25", credit: 380000 },
  { name: "مستشفى الجامعي", city: "جدة", segment: "B2B", classification: "VIP", lastOrder: "2025-09-19", credit: 450000 },
  { name: "مركز الشفاء الطبي", city: "جدة", segment: "B2B", classification: "High Value", lastOrder: "2025-09-18", credit: 120000 },
  { name: "مركز الرعاية الحديثة", city: "الرياض", segment: "B2B", classification: "High Value", lastOrder: "2025-09-11", credit: 90000 },
  { name: "مركز عناية القلب", city: "الدمام", segment: "B2B", classification: "VIP", lastOrder: "2025-09-27", credit: 240000 },
  { name: "مركز جراحة اليوم الواحد", city: "الدمام", segment: "B2B", classification: "High Value", lastOrder: "2025-09-13", credit: 110000 },
  { name: "مركز صحة المرأة", city: "مكة", segment: "B2B", classification: "High Value", lastOrder: "2025-09-20", credit: 95000 },
  { name: "مركز الأمل الطبي", city: "مكة", segment: "B2B", classification: "Risk", lastOrder: "2025-08-30", credit: 70000 },
  { name: "عيادة الندى", city: "الدمام", segment: "B2B", classification: "High Value", lastOrder: "2025-09-10", credit: 80000 },
  { name: "عيادة الابتسامة", city: "جدة", segment: "B2B", classification: "High Value", lastOrder: "2025-09-05", credit: 60000 },
  { name: "عيادة السلام", city: "الرياض", segment: "B2B", classification: "Risk", lastOrder: "2025-08-21", credit: 30000 },
  { name: "عيادة الروضة", city: "الرياض", segment: "B2B", classification: "High Value", lastOrder: "2025-09-24", credit: 75000 },
  { name: "صيدلية الفردوس", city: "مكة", segment: "B2B", classification: "High Value", lastOrder: "2025-09-27", credit: 60000 },
  { name: "صيدلية الصحة", city: "جدة", segment: "B2B", classification: "High Value", lastOrder: "2025-09-16", credit: 52000 },
  { name: "صيدلية النهضة", city: "الدمام", segment: "B2B", classification: "Risk", lastOrder: "2025-08-10", credit: 20000 },
  { name: "صيدلية الهدى", city: "الرياض", segment: "B2B", classification: "High Value", lastOrder: "2025-09-26", credit: 48000 },
  { name: "مجمع الشفاء الطبي", city: "مكة", segment: "B2B", classification: "High Value", lastOrder: "2025-09-15", credit: 99000 },
  { name: "مجمع الراحة الطبي", city: "جدة", segment: "B2B", classification: "Risk", lastOrder: "2025-08-22", credit: 25000 },
  { name: "مؤسسة أدوات طبية الشرقية", city: "الدمام", segment: "B2B", classification: "High Value", lastOrder: "2025-09-23", credit: 130000 },
  { name: "مؤسسة الأجهزة الحديثة", city: "الرياض", segment: "B2B", classification: "High Value", lastOrder: "2025-09-28", credit: 150000 },
  { name: "مؤسسة الرعاية الأولى", city: "جدة", segment: "B2B", classification: "Risk", lastOrder: "2025-08-05", credit: 32000 },
  { name: "تاجر جملة المستلزمات", city: "الرياض", segment: "B2B", classification: "High Value", lastOrder: "2025-09-29", credit: 210000 },
  { name: "تاجر جملة الأدوية", city: "مكة", segment: "B2B", classification: "High Value", lastOrder: "2025-09-17", credit: 170000 },
  { name: "شركة الرعاية الصحية", city: "جدة", segment: "B2B", classification: "High Value", lastOrder: "2025-09-20", credit: 190000 },
  { name: "شركة الشفاء للخدمات", city: "الرياض", segment: "B2B", classification: "Risk", lastOrder: "2025-08-18", credit: 45000 },
  { name: "شركة الطب المتقدم", city: "الدمام", segment: "B2B", classification: "VIP", lastOrder: "2025-09-30", credit: 300000 },
  { name: "شركة الرعاية المتخصصة", city: "الرياض", segment: "B2B", classification: "High Value", lastOrder: "2025-09-25", credit: 210000 },
  { name: "شركة الأجهزة الطبية الخليجية", city: "جدة", segment: "B2B", classification: "High Value", lastOrder: "2025-09-26", credit: 240000 },
  { name: "شركة طب الأسرة", city: "مكة", segment: "B2B", classification: "Risk", lastOrder: "2025-08-12", credit: 40000 },
  { name: "حسن القحطاني", city: "الرياض", segment: "B2C", classification: "High Value", lastOrder: "2025-09-22", credit: 0 },
  { name: "أحمد الحربي", city: "الرياض", segment: "B2C", classification: "High Value", lastOrder: "2025-09-29", credit: 0 },
  { name: "محمد الزهراني", city: "جدة", segment: "B2C", classification: "VIP", lastOrder: "2025-09-21", credit: 0 },
  { name: "سارة العتيبي", city: "مكة", segment: "B2C", classification: "High Value", lastOrder: "2025-09-19", credit: 0 },
  { name: "نورة الشهري", city: "الرياض", segment: "B2C", classification: "Risk", lastOrder: "2025-08-28", credit: 0 },
  { name: "عبدالله الدوسري", city: "الدمام", segment: "B2C", classification: "High Value", lastOrder: "2025-09-16", credit: 0 },
  { name: "روان المطيري", city: "الرياض", segment: "B2C", classification: "High Value", lastOrder: "2025-09-12", credit: 0 },
  { name: "عبدالرحمن الغامدي", city: "جدة", segment: "B2C", classification: "Risk", lastOrder: "2025-08-31", credit: 0 },
  { name: "هدى الحربي", city: "مكة", segment: "B2C", classification: "High Value", lastOrder: "2025-09-10", credit: 0 },
  { name: "ليان العصيمي", city: "الرياض", segment: "B2C", classification: "VIP", lastOrder: "2025-09-27", credit: 0 },
  { name: "مستشفى السلام", city: "الدمام", segment: "B2B", classification: "High Value", lastOrder: "2025-09-22", credit: 230000 },
  { name: "مستشفى الحياة", city: "جدة", segment: "B2B", classification: "High Value", lastOrder: "2025-09-24", credit: 210000 },
  { name: "مستشفى الوطني", city: "مكة", segment: "B2B", classification: "Risk", lastOrder: "2025-08-20", credit: 60000 },
  { name: "مجمع العناية المتكاملة", city: "الرياض", segment: "B2B", classification: "High Value", lastOrder: "2025-09-26", credit: 140000 },
  { name: "مجمع النور", city: "الدمام", segment: "B2B", classification: "High Value", lastOrder: "2025-09-18", credit: 115000 },
  { name: "مجمع التخصصي", city: "جدة", segment: "B2B", classification: "VIP", lastOrder: "2025-09-29", credit: 260000 },
  { name: "صيدلية الشروق", city: "الرياض", segment: "B2B", classification: "High Value", lastOrder: "2025-09-17", credit: 58000 },
  { name: "صيدلية الربيع", city: "الدمام", segment: "B2B", classification: "Risk", lastOrder: "2025-08-08", credit: 18000 },
  { name: "صيدلية الورد", city: "جدة", segment: "B2B", classification: "High Value", lastOrder: "2025-09-23", credit: 62000 },
  { name: "مركز عيون جدة", city: "جدة", segment: "B2B", classification: "High Value", lastOrder: "2025-09-28", credit: 105000 },
  { name: "مركز سما الرياض", city: "الرياض", segment: "B2B", classification: "High Value", lastOrder: "2025-09-30", credit: 98000 },
  { name: "مركز مكة الطبي", city: "مكة", segment: "B2B", classification: "High Value", lastOrder: "2025-09-14", credit: 102000 },
  { name: "مجمع الخبر الطبي", city: "الدمام", segment: "B2B", classification: "VIP", lastOrder: "2025-09-21", credit: 270000 },
];

const contactNames = [
  "فهد العتيبي","سعود القحطاني","نورة السبيعي","ليلى الشهري","خالد الغامدي",
  "أحمد المطيري","أماني العمري","ريم الزهراني","راكان الدوسري","هدى العبدالله"
];

function phoneFor(i: number) {
  const suffix = (1000 + (i * 37) % 9000).toString();
  const mid = (200 + (i * 13) % 700).toString().padStart(3, "0");
  return `05${mid}${suffix}`;
}

export const customers: Customer[] = baseCustomers.map((c, i) => {
  const isRisk = c.classification === "Risk";
  const isVip = c.classification === "VIP";
  const overdue = isRisk ? Math.round((c.credit * 0.12) + (i % 5) * 1500) : Math.round((c.credit * 0.02) + (i % 3) * 500);
  const last6moTotal = Math.round(c.credit * (isVip ? 2.4 : 1.6) + (i % 7) * 10000);
  const contactName = contactNames[i % contactNames.length];
  const contactPhone = phoneFor(i);
  const visitCount30d = (c.segment === "B2B" ? 2 : 1) + (isVip ? 2 : 0) + (i % 3);
  return { ...c, overdue, last6moTotal, contactName, contactPhone, visitCount30d };
});

// Suppliers (12 comprehensive records)
export type SupplierClassification = "Key" | "Critical" | "Regular";
export type SupplierStatus = "Active" | "Suspended";
export type SupplierCity = "الرياض" | "جدة" | "الدمام" | "مكة" | "دولي";
export type SupplierProductCategory = "أجهزة طبية" | "مستلزمات جراحية" | "أدوية" | "معدات تعقيم" | "قساطر" | "مختبرات";

export type Supplier = {
  name: string;
  city: SupplierCity;
  classification: SupplierClassification;
  status: SupplierStatus;
  productCategory: SupplierProductCategory;
  contactName: string;
  contactPhone: string;
  totalPurchaseValue: number; // إجمالي قيمة أوامر الشراء
  lastOrderDate: string; // تاريخ آخر طلبية
  creditLimit: number; // حد الائتمان
  paymentTerms: string; // شروط الدفع
  contractExpiry: string; // انتهاء العقد
  rating: number; // تقييم المورد
  pendingOrders: number; // عدد الطلبات المعلقة
  avgDeliveryTime: number; // متوسط وقت التسليم (أيام)
};

// Base suppliers without derived fields (12 records)
const baseSuppliers: Array<{
  name: string;
  city: SupplierCity;
  classification: SupplierClassification;
  status: SupplierStatus;
  productCategory: SupplierProductCategory;
  lastOrderDate: string;
  creditLimit: number;
  paymentTerms: string;
  contractExpiry: string;
  rating: number;
}> = [
  { name: "MedTech GmbH", city: "دولي", classification: "Key", status: "Active", productCategory: "أجهزة طبية", lastOrderDate: "2025-09-20", creditLimit: 2000000, paymentTerms: "30 يوم", contractExpiry: "2026-12-31", rating: 4.6 },
  { name: "Global Sterile Solutions", city: "دولي", classification: "Critical", status: "Active", productCategory: "معدات تعقيم", lastOrderDate: "2025-09-18", creditLimit: 1500000, paymentTerms: "45 يوم", contractExpiry: "2026-06-30", rating: 4.1 },
  { name: "Alpha Medical Devices", city: "دولي", classification: "Key", status: "Active", productCategory: "قساطر", lastOrderDate: "2025-09-25", creditLimit: 1800000, paymentTerms: "30 يوم", contractExpiry: "2027-03-15", rating: 4.8 },
  { name: "المستلزمات الحديثة", city: "الرياض", classification: "Regular", status: "Active", productCategory: "مستلزمات جراحية", lastOrderDate: "2025-09-15", creditLimit: 800000, paymentTerms: "15 يوم", contractExpiry: "2025-12-31", rating: 3.9 },
  { name: "شركة الشرق للمستلزمات الطبية", city: "جدة", classification: "Critical", status: "Active", productCategory: "أدوية", lastOrderDate: "2025-09-22", creditLimit: 1200000, paymentTerms: "20 يوم", contractExpiry: "2026-08-20", rating: 4.3 },
  { name: "مؤسسة الخليج للأجهزة", city: "الدمام", classification: "Regular", status: "Active", productCategory: "مختبرات", lastOrderDate: "2025-09-12", creditLimit: 600000, paymentTerms: "25 يوم", contractExpiry: "2026-04-10", rating: 4.0 },
  { name: "Johnson & Johnson Medical", city: "دولي", classification: "Key", status: "Active", productCategory: "مستلزمات جراحية", lastOrderDate: "2025-09-28", creditLimit: 2500000, paymentTerms: "60 يوم", contractExpiry: "2027-01-15", rating: 4.7 },
  { name: "شركة النهضة الطبية", city: "مكة", classification: "Regular", status: "Suspended", productCategory: "أدوية", lastOrderDate: "2025-08-30", creditLimit: 400000, paymentTerms: "30 يوم", contractExpiry: "2025-11-30", rating: 3.2 },
  { name: "Boston Scientific", city: "دولي", classification: "Critical", status: "Active", productCategory: "قساطر", lastOrderDate: "2025-09-26", creditLimit: 2200000, paymentTerms: "45 يوم", contractExpiry: "2026-09-30", rating: 4.9 },
  { name: "مؤسسة الرعاية المتقدمة", city: "الرياض", classification: "Regular", status: "Active", productCategory: "معدات تعقيم", lastOrderDate: "2025-09-19", creditLimit: 700000, paymentTerms: "20 يوم", contractExpiry: "2026-02-28", rating: 3.8 },
  { name: "Medtronic Middle East", city: "دولي", classification: "Key", status: "Active", productCategory: "أجهزة طبية", lastOrderDate: "2025-09-30", creditLimit: 3000000, paymentTerms: "90 يوم", contractExpiry: "2027-06-30", rating: 4.8 },
  { name: "شركة الأمل للمستلزمات", city: "جدة", classification: "Regular", status: "Active", productCategory: "مستلزمات جراحية", lastOrderDate: "2025-09-14", creditLimit: 500000, paymentTerms: "15 يوم", contractExpiry: "2025-12-15", rating: 3.6 },
];

const supplierContactNames = [
  "أحمد الشمري", "سارة النعيمي", "محمد العتيبي", "نورة القحطاني", "خالد الغامدي",
  "ليلى المطيري", "راكان الدوسري", "هدى الزهراني", "زياد الشهري", "ريم العبدالله",
  "فهد العمري", "أماني الحربي"
];

function supplierPhoneFor(i: number) {
  const suffix = (2000 + (i * 47) % 8000).toString();
  const mid = (300 + (i * 17) % 600).toString().padStart(3, "0");
  return `05${mid}${suffix}`;
}

export const suppliers: Supplier[] = baseSuppliers.map((s, i) => {
  const isKey = s.classification === "Key";
  const isCritical = s.classification === "Critical";
  const totalPurchaseValue = Math.round(s.creditLimit * (isKey ? 1.8 : isCritical ? 1.4 : 1.0) + (i % 5) * 100000);
  const contactName = supplierContactNames[i % supplierContactNames.length];
  const contactPhone = supplierPhoneFor(i);
  const pendingOrders = (isKey ? 3 : 2) + (i % 4);
  const avgDeliveryTime = isKey ? 7 + (i % 5) : 10 + (i % 8);
  return { 
    ...s, 
    totalPurchaseValue, 
    contactName, 
    contactPhone, 
    pendingOrders, 
    avgDeliveryTime 
  };
});

// Inventory (Comprehensive)
export type ProductCategory = "مستهلكات طبية" | "أجهزة طبية" | "لوازم مكتبية" | "أدوية" | "معدات تعقيم" | "قساطر وأدوات";
export type InventoryStatus = "متوفر" | "منخفض" | "نفد" | "منتهي الصلاحية";
export type Branch = "الرياض" | "جدة" | "الدمام" | "مكة";

export type InventoryItem = {
  id: string;
  product: string;
  category: ProductCategory;
  batch: string;
  expiry: string; // YYYY-MM-DD
  currentStock: number;
  reorderPoint: number;
  maxStock: number;
  unitCost: number; // تكلفة الوحدة
  branch: Branch;
  status: InventoryStatus;
  lastRestocked: string; // YYYY-MM-DD
  supplier: string;
  slowMoving: boolean; // بطيء الدوران
  critical: boolean; // حرج
  daysToExpiry: number;
  stockPercentage: number; // نسبة المخزون
  // Enhanced fields
  sku: string; // رمز الصنف
  barcode: string; // الباركود
  warehouse: string; // المخزن
  bin: string; // الموقع/الرف
  lastMovement: string; // تاريخ آخر حركة
  avgCost: number; // متوسط التكلفة
  sellingPrice: number; // سعر البيع
  condition: "سليم" | "تالف" | "منتهي الصلاحية" | "مشكوك فيه"; // الحالة
  minOrderQty: number; // الحد الأدنى للطلب
  leadTime: number; // وقت التوريد (أيام)
  supplierContact: string; // جهة اتصال المورد
  notes: string; // ملاحظات
  // Notification preferences (optional)
  expiryNotifyDays?: number; // days before expiry to notify
  notifyMinUnits?: number; // minimum units left to trigger notification
};

// Base inventory items (50+ records with enhanced fields)
const baseInventoryItems: Array<{
  id: string;
  product: string;
  category: ProductCategory;
  batch: string;
  expiry: string;
  currentStock: number;
  reorderPoint: number;
  maxStock: number;
  unitCost: number;
  branch: Branch;
  lastRestocked: string;
  supplier: string;
  critical: boolean;
  sku: string;
  barcode: string;
  warehouse: string;
  bin: string;
  lastMovement: string;
  avgCost: number;
  sellingPrice: number;
  condition: "سليم" | "تالف" | "منتهي الصلاحية" | "مشكوك فيه";
  minOrderQty: number;
  leadTime: number;
  supplierContact: string;
  notes: string;
}> = [
  { id: "INV-001", product: "قفازات فحص نيتريل", category: "مستهلكات طبية", batch: "BN-7843", expiry: "2026-01-15", currentStock: 12500, reorderPoint: 5000, maxStock: 20000, unitCost: 2.5, branch: "الرياض", lastRestocked: "2025-09-15", supplier: "المستلزمات الحديثة", critical: false, sku: "SKU-001", barcode: "1234567890123", warehouse: "مخزن الرياض الرئيسي", bin: "A-01-15", lastMovement: "2025-09-15", avgCost: 2.3, sellingPrice: 3.5, condition: "سليم", minOrderQty: 1000, leadTime: 7, supplierContact: "أحمد محمد - 0501234567", notes: "مطلوب بشدة - زيادة الطلب" },
  { id: "INV-002", product: "كمامات جراحية", category: "مستهلكات طبية", batch: "MS-2210", expiry: "2025-12-01", currentStock: 54000, reorderPoint: 10000, maxStock: 80000, unitCost: 1.8, branch: "جدة", lastRestocked: "2025-09-20", supplier: "شركة الشرق للمستلزمات الطبية", critical: false, sku: "SKU-002", barcode: "1234567890124", warehouse: "مخزن جدة الفرعي", bin: "B-02-20", lastMovement: "2025-09-20", avgCost: 1.6, sellingPrice: 2.8, condition: "سليم", minOrderQty: 5000, leadTime: 5, supplierContact: "سارة أحمد - 0502345678", notes: "جودة عالية - موافقة إدارة الجودة" },
  { id: "INV-003", product: "محاليل تعقيم", category: "معدات تعقيم", batch: "ST-9331", expiry: "2025-11-10", currentStock: 3800, reorderPoint: 2000, maxStock: 10000, unitCost: 15.0, branch: "الدمام", lastRestocked: "2025-09-10", supplier: "Global Sterile Solutions", critical: true, sku: "SKU-003", barcode: "1234567890125", warehouse: "مخزن الدمام الطبي", bin: "C-03-10", lastMovement: "2025-09-10", avgCost: 14.5, sellingPrice: 22.0, condition: "سليم", minOrderQty: 500, leadTime: 10, supplierContact: "John Smith - +966501234567", notes: "حرج - يحتاج مراقبة مستمرة" },
  { id: "INV-004", product: "قسطرة قلبية", category: "قساطر وأدوات", batch: "CT-1007", expiry: "2027-04-28", currentStock: 220, reorderPoint: 50, maxStock: 500, unitCost: 450.0, branch: "مكة", lastRestocked: "2025-08-30", supplier: "Alpha Medical Devices", critical: false, sku: "SKU-004", barcode: "1234567890126", warehouse: "مخزن مكة المتخصص", bin: "D-04-28", lastMovement: "2025-08-30", avgCost: 420.0, sellingPrice: 650.0, condition: "سليم", minOrderQty: 25, leadTime: 14, supplierContact: "محمد العتيبي - 0503456789", notes: "معدات متخصصة - تخزين مبرد" },
  { id: "INV-005", product: "جهاز قياس الضغط", category: "أجهزة طبية", batch: "BP-2025", expiry: "2028-03-15", currentStock: 45, reorderPoint: 20, maxStock: 100, unitCost: 1200.0, branch: "الرياض", lastRestocked: "2025-09-05", supplier: "MedTech GmbH", critical: false, sku: "SKU-005", barcode: "1234567890127", warehouse: "مخزن الرياض الرئيسي", bin: "E-05-15", lastMovement: "2025-09-05", avgCost: 1150.0, sellingPrice: 1800.0, condition: "سليم", minOrderQty: 10, leadTime: 21, supplierContact: "Hans Mueller - +966502345678", notes: "معايرة سنوية مطلوبة" },
  { id: "INV-006", product: "ميزان حرارة رقمي", category: "أجهزة طبية", batch: "TH-789", expiry: "2027-12-20", currentStock: 180, reorderPoint: 50, maxStock: 300, unitCost: 85.0, branch: "جدة", lastRestocked: "2025-09-12", supplier: "مؤسسة الخليج للأجهزة", critical: false, sku: "SKU-006", barcode: "1234567890128", warehouse: "مخزن جدة الفرعي", bin: "F-06-20", lastMovement: "2025-09-12", avgCost: 80.0, sellingPrice: 125.0, condition: "سليم", minOrderQty: 20, leadTime: 7, supplierContact: "خالد الغامدي - 0504567890", notes: "بطاريات قابلة للاستبدال" },
  { id: "INV-007", product: "سماعة طبية", category: "أجهزة طبية", batch: "ST-456", expiry: "2028-06-10", currentStock: 75, reorderPoint: 30, maxStock: 150, unitCost: 350.0, branch: "الدمام", lastRestocked: "2025-08-25", supplier: "Johnson & Johnson Medical", critical: false, sku: "SKU-007", barcode: "1234567890129", warehouse: "مخزن الدمام الطبي", bin: "G-07-10", lastMovement: "2025-08-25", avgCost: 320.0, sellingPrice: 480.0, condition: "سليم", minOrderQty: 15, leadTime: 14, supplierContact: "Sarah Johnson - +966503456789", notes: "ضمان 3 سنوات" },
  { id: "INV-008", product: "مصباح طبي", category: "أجهزة طبية", batch: "LT-321", expiry: "2028-01-30", currentStock: 25, reorderPoint: 15, maxStock: 50, unitCost: 2800.0, branch: "مكة", lastRestocked: "2025-07-20", supplier: "Medtronic Middle East", critical: true, sku: "SKU-008", barcode: "1234567890130", warehouse: "مخزن مكة المتخصص", bin: "H-08-30", lastMovement: "2025-07-20", avgCost: 2600.0, sellingPrice: 4200.0, condition: "سليم", minOrderQty: 5, leadTime: 30, supplierContact: "أحمد الشمري - 0505678901", notes: "تركيب متخصص مطلوب" },
  { id: "INV-009", product: "أقلام حبر طبية", category: "لوازم مكتبية", batch: "PN-555", expiry: "2026-08-15", currentStock: 500, reorderPoint: 200, maxStock: 1000, unitCost: 3.5, branch: "الرياض", lastRestocked: "2025-09-18", supplier: "شركة الأمل للمستلزمات", critical: false, sku: "SKU-009", barcode: "1234567890131", warehouse: "مخزن الرياض الرئيسي", bin: "I-09-15", lastMovement: "2025-09-18", avgCost: 3.2, sellingPrice: 5.0, condition: "سليم", minOrderQty: 100, leadTime: 3, supplierContact: "نورة القحطاني - 0506789012", notes: "ألوان متعددة متوفرة" },
  { id: "INV-010", product: "أوراق طبية", category: "لوازم مكتبية", batch: "PP-888", expiry: "2026-05-20", currentStock: 1200, reorderPoint: 500, maxStock: 2000, unitCost: 0.8, branch: "جدة", lastRestocked: "2025-09-22", supplier: "مؤسسة الرعاية المتقدمة", critical: false, sku: "SKU-010", barcode: "1234567890132", warehouse: "مخزن جدة الفرعي", bin: "J-10-20", lastMovement: "2025-09-22", avgCost: 0.7, sellingPrice: 1.2, condition: "سليم", minOrderQty: 500, leadTime: 2, supplierContact: "محمد النعيمي - 0507890123", notes: "مقاوم للماء" },
  { id: "INV-011", product: "أسبرين 100 مجم", category: "أدوية", batch: "ASP-2025", expiry: "2026-03-10", currentStock: 2500, reorderPoint: 1000, maxStock: 5000, unitCost: 0.5, branch: "الدمام", lastRestocked: "2025-09-08", supplier: "شركة النهضة الطبية", critical: false, sku: "SKU-011", barcode: "1234567890133", warehouse: "مخزن الدمام الطبي", bin: "K-11-10", lastMovement: "2025-09-08", avgCost: 0.45, sellingPrice: 0.8, condition: "سليم", minOrderQty: 1000, leadTime: 5, supplierContact: "فاطمة العتيبي - 0508901234", notes: "تخزين في درجة حرارة منخفضة" },
  { id: "INV-012", product: "باراسيتامول 500 مجم", category: "أدوية", batch: "PAR-789", expiry: "2026-07-25", currentStock: 1800, reorderPoint: 800, maxStock: 3000, unitCost: 0.3, branch: "مكة", lastRestocked: "2025-09-14", supplier: "شركة الشرق للمستلزمات الطبية", critical: false, sku: "SKU-012", barcode: "1234567890134", warehouse: "مخزن مكة المتخصص", bin: "L-12-25", lastMovement: "2025-09-14", avgCost: 0.28, sellingPrice: 0.5, condition: "سليم", minOrderQty: 1000, leadTime: 5, supplierContact: "عبدالله الغامدي - 0509012345", notes: "مسكن للآلام" },
  { id: "INV-013", product: "شاش طبي معقم", category: "مستهلكات طبية", batch: "GA-456", expiry: "2026-02-28", currentStock: 800, reorderPoint: 400, maxStock: 1500, unitCost: 5.0, branch: "الرياض", lastRestocked: "2025-09-16", supplier: "المستلزمات الحديثة", critical: true, sku: "SKU-013", barcode: "1234567890135", warehouse: "مخزن الرياض الرئيسي", bin: "M-13-28", lastMovement: "2025-09-16", avgCost: 4.8, sellingPrice: 7.5, condition: "سليم", minOrderQty: 200, leadTime: 7, supplierContact: "ريم الشمري - 0500123456", notes: "معقم ومقاوم للبكتيريا" },
  { id: "INV-014", product: "قطن طبي", category: "مستهلكات طبية", batch: "CO-321", expiry: "2026-04-12", currentStock: 1500, reorderPoint: 600, maxStock: 2500, unitCost: 2.0, branch: "جدة", lastRestocked: "2025-09-19", supplier: "شركة الشرق للمستلزمات الطبية", critical: false, sku: "SKU-014", barcode: "1234567890136", warehouse: "مخزن جدة الفرعي", bin: "N-14-12", lastMovement: "2025-09-19", avgCost: 1.8, sellingPrice: 3.0, condition: "سليم", minOrderQty: 300, leadTime: 5, supplierContact: "هند القحطاني - 0501234567", notes: "قطن 100% طبيعي" },
  { id: "INV-015", product: "محقن 5 مل", category: "مستهلكات طبية", batch: "SY-555", expiry: "2026-06-18", currentStock: 3000, reorderPoint: 1000, maxStock: 5000, unitCost: 1.2, branch: "الدمام", lastRestocked: "2025-09-11", supplier: "Global Sterile Solutions", critical: false, sku: "SKU-015", barcode: "1234567890137", warehouse: "مخزن الدمام الطبي", bin: "O-15-18", lastMovement: "2025-09-11", avgCost: 1.1, sellingPrice: 1.8, condition: "سليم", minOrderQty: 500, leadTime: 7, supplierContact: "أحمد العتيبي - 0502345678", notes: "معقم ومحكم الإغلاق" },
  { id: "INV-016", product: "إبر طبية", category: "مستهلكات طبية", batch: "NE-888", expiry: "2026-09-05", currentStock: 2000, reorderPoint: 800, maxStock: 4000, unitCost: 0.8, branch: "مكة", lastRestocked: "2025-09-13", supplier: "المستلزمات الحديثة", critical: false, sku: "SKU-016", barcode: "1234567890138", warehouse: "مخزن مكة المتخصص", bin: "P-16-05", lastMovement: "2025-09-13", avgCost: 0.75, sellingPrice: 1.2, condition: "سليم", minOrderQty: 500, leadTime: 5, supplierContact: "سعد الغامدي - 0503456789", notes: "مقاسات متعددة متوفرة" },
  { id: "INV-017", product: "جهاز تخطيط القلب", category: "أجهزة طبية", batch: "ECG-2025", expiry: "2028-11-30", currentStock: 8, reorderPoint: 5, maxStock: 15, unitCost: 15000.0, branch: "الرياض", lastRestocked: "2025-08-15", supplier: "MedTech GmbH", critical: true, sku: "SKU-017", barcode: "1234567890139", warehouse: "مخزن الرياض الرئيسي", bin: "Q-17-30", lastMovement: "2025-08-15", avgCost: 14500.0, sellingPrice: 22000.0, condition: "سليم", minOrderQty: 2, leadTime: 45, supplierContact: "Dr. Schmidt - +966504567890", notes: "صيانة دورية مطلوبة" },
  { id: "INV-018", product: "جهاز قياس السكر", category: "أجهزة طبية", batch: "GL-789", expiry: "2027-10-15", currentStock: 35, reorderPoint: 15, maxStock: 60, unitCost: 450.0, branch: "جدة", lastRestocked: "2025-09-07", supplier: "مؤسسة الخليج للأجهزة", critical: false, sku: "SKU-018", barcode: "1234567890140", warehouse: "مخزن جدة الفرعي", bin: "R-18-15", lastMovement: "2025-09-07", avgCost: 420.0, sellingPrice: 650.0, condition: "سليم", minOrderQty: 10, leadTime: 14, supplierContact: "ماجد النعيمي - 0504567890", notes: "شرائط قياس مطلوبة" },
  { id: "INV-019", product: "مبضع جراحي", category: "قساطر وأدوات", batch: "SC-456", expiry: "2027-08-20", currentStock: 120, reorderPoint: 50, maxStock: 200, unitCost: 25.0, branch: "الدمام", lastRestocked: "2025-09-17", supplier: "Johnson & Johnson Medical", critical: false, sku: "SKU-019", barcode: "1234567890141", warehouse: "مخزن الدمام الطبي", bin: "S-19-20", lastMovement: "2025-09-17", avgCost: 23.0, sellingPrice: 35.0, condition: "سليم", minOrderQty: 25, leadTime: 10, supplierContact: "محمد الشمري - 0505678901", notes: "مقاسات مختلفة متوفرة" },
  { id: "INV-020", product: "خيط جراحي", category: "قساطر وأدوات", batch: "ST-321", expiry: "2026-12-10", currentStock: 400, reorderPoint: 150, maxStock: 600, unitCost: 8.0, branch: "مكة", lastRestocked: "2025-09-09", supplier: "Alpha Medical Devices", critical: false, sku: "SKU-020", barcode: "1234567890142", warehouse: "مخزن مكة المتخصص", bin: "T-20-10", lastMovement: "2025-09-09", avgCost: 7.5, sellingPrice: 12.0, condition: "سليم", minOrderQty: 50, leadTime: 7, supplierContact: "عبدالرحمن القحطاني - 0506789012", notes: "خيوط قابلة للامتصاص" },
  { id: "INV-021", product: "مطهر يدين", category: "معدات تعقيم", batch: "HA-555", expiry: "2026-01-25", currentStock: 600, reorderPoint: 300, maxStock: 1000, unitCost: 12.0, branch: "الرياض", lastRestocked: "2025-09-21", supplier: "Global Sterile Solutions", critical: false, sku: "SKU-021", barcode: "1234567890143", warehouse: "مخزن الرياض الرئيسي", bin: "U-21-25", lastMovement: "2025-09-21", avgCost: 11.0, sellingPrice: 18.0, condition: "سليم", minOrderQty: 100, leadTime: 5, supplierContact: "أحمد العتيبي - 0507890123", notes: "مطهر كحولي 70%" },
  { id: "INV-022", product: "منظف طبي", category: "معدات تعقيم", batch: "CL-888", expiry: "2026-03-18", currentStock: 250, reorderPoint: 100, maxStock: 400, unitCost: 18.0, branch: "جدة", lastRestocked: "2025-09-06", supplier: "مؤسسة الرعاية المتقدمة", critical: true, sku: "SKU-022", barcode: "1234567890144", warehouse: "مخزن جدة الفرعي", bin: "V-22-18", lastMovement: "2025-09-06", avgCost: 16.5, sellingPrice: 25.0, condition: "سليم", minOrderQty: 50, leadTime: 7, supplierContact: "نورا الغامدي - 0508901234", notes: "منظف متعدد الأغراض" },
  { id: "INV-023", product: "مكتب طبي", category: "لوازم مكتبية", batch: "DE-2025", expiry: "2030-12-31", currentStock: 12, reorderPoint: 5, maxStock: 20, unitCost: 800.0, branch: "الدمام", lastRestocked: "2025-08-10", supplier: "شركة الأمل للمستلزمات", critical: false, sku: "SKU-023", barcode: "1234567890145", warehouse: "مخزن الدمام الطبي", bin: "W-23-31", lastMovement: "2025-08-10", avgCost: 750.0, sellingPrice: 1200.0, condition: "سليم", minOrderQty: 2, leadTime: 14, supplierContact: "خالد الشمري - 0509012345", notes: "تركيب مجاني متوفر" },
  { id: "INV-024", product: "كرسي طبي", category: "لوازم مكتبية", batch: "CH-789", expiry: "2030-12-31", currentStock: 18, reorderPoint: 8, maxStock: 30, unitCost: 450.0, branch: "مكة", lastRestocked: "2025-09-04", supplier: "مؤسسة الرعاية المتقدمة", critical: false, sku: "SKU-024", barcode: "1234567890146", warehouse: "مخزن مكة المتخصص", bin: "X-24-31", lastMovement: "2025-09-04", avgCost: 420.0, sellingPrice: 650.0, condition: "سليم", minOrderQty: 3, leadTime: 10, supplierContact: "فهد النعيمي - 0500123456", notes: "كرسي قابل للتعديل" },
  { id: "INV-025", product: "مورفين 10 مجم", category: "أدوية", batch: "MOR-456", expiry: "2026-05-30", currentStock: 150, reorderPoint: 50, maxStock: 300, unitCost: 2.5, branch: "الرياض", lastRestocked: "2025-08-28", supplier: "شركة النهضة الطبية", critical: true, sku: "SKU-025", barcode: "1234567890147", warehouse: "مخزن الرياض الرئيسي", bin: "Y-25-30", lastMovement: "2025-08-28", avgCost: 2.3, sellingPrice: 4.0, condition: "سليم", minOrderQty: 50, leadTime: 7, supplierContact: "د. أحمد الشمري - 0501234567", notes: "مخدر - يحتاج ترخيص خاص" },
  { id: "INV-026", product: "أدرينالين", category: "أدوية", batch: "ADR-321", expiry: "2026-08-15", currentStock: 80, reorderPoint: 30, maxStock: 150, unitCost: 15.0, branch: "جدة", lastRestocked: "2025-09-01", supplier: "شركة الشرق للمستلزمات الطبية", critical: true, sku: "SKU-026", barcode: "1234567890148", warehouse: "مخزن جدة الفرعي", bin: "Z-26-15", lastMovement: "2025-09-01", avgCost: 14.0, sellingPrice: 25.0, condition: "سليم", minOrderQty: 25, leadTime: 5, supplierContact: "د. سارة النعيمي - 0502345678", notes: "طوارئ - تخزين مبرد" },
  { id: "INV-027", product: "قسطرة بولية", category: "قساطر وأدوات", batch: "UC-555", expiry: "2027-02-20", currentStock: 200, reorderPoint: 80, maxStock: 350, unitCost: 35.0, branch: "الدمام", lastRestocked: "2025-09-23", supplier: "Boston Scientific", critical: false, sku: "SKU-027", barcode: "1234567890149", warehouse: "مخزن الدمام الطبي", bin: "AA-27-20", lastMovement: "2025-09-23", avgCost: 32.0, sellingPrice: 50.0, condition: "سليم", minOrderQty: 25, leadTime: 14, supplierContact: "أحمد العتيبي - 0503456789", notes: "مقاسات متعددة" },
  { id: "INV-028", product: "جهاز تنفس", category: "أجهزة طبية", batch: "VE-888", expiry: "2028-07-10", currentStock: 5, reorderPoint: 3, maxStock: 10, unitCost: 25000.0, branch: "مكة", lastRestocked: "2025-07-05", supplier: "Medtronic Middle East", critical: true, sku: "SKU-028", barcode: "1234567890150", warehouse: "مخزن مكة المتخصص", bin: "BB-28-10", lastMovement: "2025-07-05", avgCost: 24000.0, sellingPrice: 35000.0, condition: "سليم", minOrderQty: 1, leadTime: 60, supplierContact: "د. محمد الغامدي - 0504567890", notes: "معدات حرجة - صيانة دورية" },
  { id: "INV-029", product: "مضخة حقن", category: "أجهزة طبية", batch: "IN-2025", expiry: "2027-12-05", currentStock: 15, reorderPoint: 8, maxStock: 25, unitCost: 1800.0, branch: "الرياض", lastRestocked: "2025-09-03", supplier: "MedTech GmbH", critical: false, sku: "SKU-029", barcode: "1234567890151", warehouse: "مخزن الرياض الرئيسي", bin: "CC-29-05", lastMovement: "2025-09-03", avgCost: 1700.0, sellingPrice: 2500.0, condition: "سليم", minOrderQty: 3, leadTime: 21, supplierContact: "أحمد الشمري - 0505678901", notes: "برمجة متخصصة مطلوبة" },
  { id: "INV-030", product: "مجلدات طبية", category: "لوازم مكتبية", batch: "FL-789", expiry: "2030-12-31", currentStock: 200, reorderPoint: 100, maxStock: 300, unitCost: 5.0, branch: "جدة", lastRestocked: "2025-09-25", supplier: "شركة الأمل للمستلزمات", critical: false, sku: "SKU-030", barcode: "1234567890152", warehouse: "مخزن جدة الفرعي", bin: "DD-30-31", lastMovement: "2025-09-25", avgCost: 4.5, sellingPrice: 7.0, condition: "سليم", minOrderQty: 50, leadTime: 3, supplierContact: "هند القحطاني - 0506789012", notes: "مجلدات مقاومة للماء" },
  // Additional 20 items to reach 50+
  { id: "INV-031", product: "جهاز قياس الأكسجين", category: "أجهزة طبية", batch: "OX-2025", expiry: "2027-09-15", currentStock: 22, reorderPoint: 10, maxStock: 40, unitCost: 850.0, branch: "الدمام", lastRestocked: "2025-09-20", supplier: "مؤسسة الخليج للأجهزة", critical: false, sku: "SKU-031", barcode: "1234567890153", warehouse: "مخزن الدمام الطبي", bin: "EE-31-15", lastMovement: "2025-09-20", avgCost: 800.0, sellingPrice: 1200.0, condition: "سليم", minOrderQty: 5, leadTime: 14, supplierContact: "عبدالله العتيبي - 0507890123", notes: "قياس دقيق للأكسجين" },
  { id: "INV-032", product: "مضمدات طبية", category: "مستهلكات طبية", batch: "BD-456", expiry: "2026-10-20", currentStock: 800, reorderPoint: 300, maxStock: 1200, unitCost: 3.5, branch: "مكة", lastRestocked: "2025-09-18", supplier: "المستلزمات الحديثة", critical: false, sku: "SKU-032", barcode: "1234567890154", warehouse: "مخزن مكة المتخصص", bin: "FF-32-20", lastMovement: "2025-09-18", avgCost: 3.2, sellingPrice: 5.5, condition: "سليم", minOrderQty: 200, leadTime: 5, supplierContact: "سعد الشمري - 0508901234", notes: "مضمدات معقمة" },
  { id: "INV-033", product: "مطهر الجروح", category: "معدات تعقيم", batch: "WD-789", expiry: "2026-06-30", currentStock: 150, reorderPoint: 75, maxStock: 250, unitCost: 8.5, branch: "الرياض", lastRestocked: "2025-09-15", supplier: "Global Sterile Solutions", critical: false, sku: "SKU-033", barcode: "1234567890155", warehouse: "مخزن الرياض الرئيسي", bin: "GG-33-30", lastMovement: "2025-09-15", avgCost: 8.0, sellingPrice: 12.0, condition: "سليم", minOrderQty: 50, leadTime: 7, supplierContact: "أحمد النعيمي - 0509012345", notes: "مطهر للجروح المفتوحة" },
  { id: "INV-034", product: "قسطرة وريدية", category: "قساطر وأدوات", batch: "IV-321", expiry: "2027-01-15", currentStock: 180, reorderPoint: 80, maxStock: 300, unitCost: 12.0, branch: "جدة", lastRestocked: "2025-09-12", supplier: "Johnson & Johnson Medical", critical: false, sku: "SKU-034", barcode: "1234567890156", warehouse: "مخزن جدة الفرعي", bin: "HH-34-15", lastMovement: "2025-09-12", avgCost: 11.0, sellingPrice: 18.0, condition: "سليم", minOrderQty: 50, leadTime: 7, supplierContact: "محمد الغامدي - 0500123456", notes: "قسطرة وريدية معقمة" },
  { id: "INV-035", product: "مكتبة طبية", category: "لوازم مكتبية", batch: "LB-555", expiry: "2030-12-31", currentStock: 8, reorderPoint: 3, maxStock: 15, unitCost: 1200.0, branch: "الدمام", lastRestocked: "2025-08-20", supplier: "شركة الأمل للمستلزمات", critical: false, sku: "SKU-035", barcode: "1234567890157", warehouse: "مخزن الدمام الطبي", bin: "II-35-31", lastMovement: "2025-08-20", avgCost: 1100.0, sellingPrice: 1800.0, condition: "سليم", minOrderQty: 2, leadTime: 21, supplierContact: "خالد القحطاني - 0501234567", notes: "مكتبة متعددة الأرفف" },
  { id: "INV-036", product: "أوكسجين طبي", category: "أدوية", batch: "O2-888", expiry: "2026-12-31", currentStock: 45, reorderPoint: 20, maxStock: 80, unitCost: 25.0, branch: "مكة", lastRestocked: "2025-09-10", supplier: "شركة النهضة الطبية", critical: true, sku: "SKU-036", barcode: "1234567890158", warehouse: "مخزن مكة المتخصص", bin: "JJ-36-31", lastMovement: "2025-09-10", avgCost: 23.0, sellingPrice: 40.0, condition: "سليم", minOrderQty: 10, leadTime: 3, supplierContact: "د. فاطمة العتيبي - 0502345678", notes: "أوكسجين طبي نقي" },
  { id: "INV-037", product: "جهاز قياس الحرارة", category: "أجهزة طبية", batch: "TM-2025", expiry: "2028-04-20", currentStock: 28, reorderPoint: 12, maxStock: 50, unitCost: 320.0, branch: "الرياض", lastRestocked: "2025-09-08", supplier: "MedTech GmbH", critical: false, sku: "SKU-037", barcode: "1234567890159", warehouse: "مخزن الرياض الرئيسي", bin: "KK-37-20", lastMovement: "2025-09-08", avgCost: 300.0, sellingPrice: 450.0, condition: "سليم", minOrderQty: 8, leadTime: 14, supplierContact: "أحمد الشمري - 0503456789", notes: "قياس دقيق للحرارة" },
  { id: "INV-038", product: "شريط لاصق طبي", category: "مستهلكات طبية", batch: "TP-456", expiry: "2026-08-10", currentStock: 1200, reorderPoint: 500, maxStock: 2000, unitCost: 1.5, branch: "جدة", lastRestocked: "2025-09-22", supplier: "شركة الشرق للمستلزمات الطبية", critical: false, sku: "SKU-038", barcode: "1234567890160", warehouse: "مخزن جدة الفرعي", bin: "LL-38-10", lastMovement: "2025-09-22", avgCost: 1.3, sellingPrice: 2.2, condition: "سليم", minOrderQty: 500, leadTime: 3, supplierContact: "نورا النعيمي - 0504567890", notes: "شريط مقاوم للماء" },
  { id: "INV-039", product: "مطهر الجلد", category: "معدات تعقيم", batch: "SD-789", expiry: "2026-05-25", currentStock: 300, reorderPoint: 150, maxStock: 500, unitCost: 6.5, branch: "الدمام", lastRestocked: "2025-09-19", supplier: "مؤسسة الرعاية المتقدمة", critical: false, sku: "SKU-039", barcode: "1234567890161", warehouse: "مخزن الدمام الطبي", bin: "MM-39-25", lastMovement: "2025-09-19", avgCost: 6.0, sellingPrice: 9.5, condition: "سليم", minOrderQty: 100, leadTime: 5, supplierContact: "عبدالرحمن العتيبي - 0505678901", notes: "مطهر للجلد قبل العمليات" },
  { id: "INV-040", product: "قسطرة أنفية", category: "قساطر وأدوات", batch: "NC-321", expiry: "2027-03-18", currentStock: 95, reorderPoint: 40, maxStock: 150, unitCost: 18.0, branch: "مكة", lastRestocked: "2025-09-16", supplier: "Alpha Medical Devices", critical: false, sku: "SKU-040", barcode: "1234567890162", warehouse: "مخزن مكة المتخصص", bin: "NN-40-18", lastMovement: "2025-09-16", avgCost: 16.5, sellingPrice: 25.0, condition: "سليم", minOrderQty: 25, leadTime: 10, supplierContact: "محمد الشمري - 0506789012", notes: "قسطرة أنفية مرنة" },
  { id: "INV-041", product: "كرسي متحرك", category: "لوازم مكتبية", batch: "WC-555", expiry: "2030-12-31", currentStock: 6, reorderPoint: 2, maxStock: 12, unitCost: 2500.0, branch: "الرياض", lastRestocked: "2025-08-15", supplier: "مؤسسة الرعاية المتقدمة", critical: false, sku: "SKU-041", barcode: "1234567890163", warehouse: "مخزن الرياض الرئيسي", bin: "OO-41-31", lastMovement: "2025-08-15", avgCost: 2300.0, sellingPrice: 3500.0, condition: "سليم", minOrderQty: 1, leadTime: 30, supplierContact: "فهد الغامدي - 0507890123", notes: "كرسي متحرك للمرضى" },
  { id: "INV-042", product: "أنسولين", category: "أدوية", batch: "INS-888", expiry: "2026-11-30", currentStock: 65, reorderPoint: 25, maxStock: 100, unitCost: 45.0, branch: "جدة", lastRestocked: "2025-09-14", supplier: "شركة الشرق للمستلزمات الطبية", critical: true, sku: "SKU-042", barcode: "1234567890164", warehouse: "مخزن جدة الفرعي", bin: "PP-42-30", lastMovement: "2025-09-14", avgCost: 42.0, sellingPrice: 70.0, condition: "سليم", minOrderQty: 20, leadTime: 7, supplierContact: "د. سارة القحطاني - 0508901234", notes: "أنسولين - تخزين مبرد" },
  { id: "INV-043", product: "جهاز قياس الضغط اليدوي", category: "أجهزة طبية", batch: "MBP-2025", expiry: "2028-02-14", currentStock: 35, reorderPoint: 15, maxStock: 60, unitCost: 180.0, branch: "الدمام", lastRestocked: "2025-09-11", supplier: "مؤسسة الخليج للأجهزة", critical: false, sku: "SKU-043", barcode: "1234567890165", warehouse: "مخزن الدمام الطبي", bin: "QQ-43-14", lastMovement: "2025-09-11", avgCost: 170.0, sellingPrice: 250.0, condition: "سليم", minOrderQty: 10, leadTime: 10, supplierContact: "أحمد العتيبي - 0509012345", notes: "جهاز قياس يدوي دقيق" },
  { id: "INV-044", product: "ضمادات طبية", category: "مستهلكات طبية", batch: "BD-321", expiry: "2026-09-15", currentStock: 900, reorderPoint: 400, maxStock: 1500, unitCost: 2.8, branch: "مكة", lastRestocked: "2025-09-17", supplier: "المستلزمات الحديثة", critical: false, sku: "SKU-044", barcode: "1234567890166", warehouse: "مخزن مكة المتخصص", bin: "RR-44-15", lastMovement: "2025-09-17", avgCost: 2.5, sellingPrice: 4.2, condition: "سليم", minOrderQty: 200, leadTime: 5, supplierContact: "هند الشمري - 0500123456", notes: "ضمادات معقمة" },
  { id: "INV-045", product: "مطهر الأدوات", category: "معدات تعقيم", batch: "IT-555", expiry: "2026-07-20", currentStock: 200, reorderPoint: 100, maxStock: 350, unitCost: 22.0, branch: "الرياض", lastRestocked: "2025-09-13", supplier: "Global Sterile Solutions", critical: false, sku: "SKU-045", barcode: "1234567890167", warehouse: "مخزن الرياض الرئيسي", bin: "SS-45-20", lastMovement: "2025-09-13", avgCost: 20.0, sellingPrice: 32.0, condition: "سليم", minOrderQty: 50, leadTime: 7, supplierContact: "عبدالله النعيمي - 0501234567", notes: "مطهر للأدوات الطبية" },
  { id: "INV-046", product: "قسطرة معدة", category: "قساطر وأدوات", batch: "GC-888", expiry: "2027-05-12", currentStock: 75, reorderPoint: 30, maxStock: 120, unitCost: 28.0, branch: "جدة", lastRestocked: "2025-09-09", supplier: "Boston Scientific", critical: false, sku: "SKU-046", barcode: "1234567890168", warehouse: "مخزن جدة الفرعي", bin: "TT-46-12", lastMovement: "2025-09-09", avgCost: 25.0, sellingPrice: 40.0, condition: "سليم", minOrderQty: 20, leadTime: 14, supplierContact: "محمد العتيبي - 0502345678", notes: "قسطرة معدة مرنة" },
  { id: "INV-047", product: "طاولة طبية", category: "لوازم مكتبية", batch: "MT-2025", expiry: "2030-12-31", currentStock: 4, reorderPoint: 2, maxStock: 8, unitCost: 3500.0, branch: "الدمام", lastRestocked: "2025-07-30", supplier: "شركة الأمل للمستلزمات", critical: false, sku: "SKU-047", barcode: "1234567890169", warehouse: "مخزن الدمام الطبي", bin: "UU-47-31", lastMovement: "2025-07-30", avgCost: 3200.0, sellingPrice: 5000.0, condition: "سليم", minOrderQty: 1, leadTime: 45, supplierContact: "خالد القحطاني - 0503456789", notes: "طاولة طبية متعددة الأغراض" },
  { id: "INV-048", product: "مورفين 5 مجم", category: "أدوية", batch: "MOR5-456", expiry: "2026-04-25", currentStock: 120, reorderPoint: 40, maxStock: 200, unitCost: 1.8, branch: "مكة", lastRestocked: "2025-08-25", supplier: "شركة النهضة الطبية", critical: true, sku: "SKU-048", barcode: "1234567890170", warehouse: "مخزن مكة المتخصص", bin: "VV-48-25", lastMovement: "2025-08-25", avgCost: 1.6, sellingPrice: 3.0, condition: "سليم", minOrderQty: 50, leadTime: 7, supplierContact: "د. أحمد الغامدي - 0504567890", notes: "مخدر - ترخيص خاص" },
  { id: "INV-049", product: "جهاز قياس النبض", category: "أجهزة طبية", batch: "PM-789", expiry: "2027-11-08", currentStock: 42, reorderPoint: 18, maxStock: 75, unitCost: 280.0, branch: "الرياض", lastRestocked: "2025-09-06", supplier: "MedTech GmbH", critical: false, sku: "SKU-049", barcode: "1234567890171", warehouse: "مخزن الرياض الرئيسي", bin: "WW-49-08", lastMovement: "2025-09-06", avgCost: 260.0, sellingPrice: 380.0, condition: "سليم", minOrderQty: 12, leadTime: 14, supplierContact: "أحمد الشمري - 0505678901", notes: "قياس دقيق للنبض" },
  { id: "INV-050", product: "شريط قياس", category: "مستهلكات طبية", batch: "MT-321", expiry: "2026-12-05", currentStock: 600, reorderPoint: 250, maxStock: 1000, unitCost: 0.8, branch: "جدة", lastRestocked: "2025-09-24", supplier: "شركة الشرق للمستلزمات الطبية", critical: false, sku: "SKU-050", barcode: "1234567890172", warehouse: "مخزن جدة الفرعي", bin: "XX-50-05", lastMovement: "2025-09-24", avgCost: 0.7, sellingPrice: 1.2, condition: "سليم", minOrderQty: 200, leadTime: 3, supplierContact: "نورا النعيمي - 0506789012", notes: "شريط قياس مرن" },
];

export const inventory: InventoryItem[] = baseInventoryItems.map((item) => {
  const today = new Date();
  const expiryDate = new Date(item.expiry);
  const daysToExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  const stockPercentage = (item.currentStock / item.maxStock) * 100;
  
  let status: InventoryStatus;
  if (item.currentStock === 0) {
    status = "نفد";
  } else if (item.currentStock <= item.reorderPoint) {
    status = "منخفض";
  } else if (daysToExpiry <= 30) {
    status = "منتهي الصلاحية";
  } else {
    status = "متوفر";
  }
  
  // Determine if item is slow moving (stocked for more than 90 days)
  const lastRestockedDate = new Date(item.lastRestocked);
  const daysSinceRestock = Math.ceil((today.getTime() - lastRestockedDate.getTime()) / (1000 * 60 * 60 * 24));
  const slowMoving = daysSinceRestock > 90 && stockPercentage > 50;
  
  return {
    ...item,
    status,
    daysToExpiry,
    stockPercentage: Math.round(stockPercentage),
    slowMoving
  };
});

// Inventory Health Categories
export const inventoryCategories = [
  {
    name: "مستهلكات طبية",
    totalItems: inventory.filter(item => item.category === "مستهلكات طبية").length,
    totalValue: inventory.filter(item => item.category === "مستهلكات طبية").reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0),
    lowStockItems: inventory.filter(item => item.category === "مستهلكات طبية" && item.status === "منخفض").length,
    slowMovingItems: inventory.filter(item => item.category === "مستهلكات طبية" && item.slowMoving).length,
    criticalItems: inventory.filter(item => item.category === "مستهلكات طبية" && item.critical).length,
    avgStockPercentage: Math.round(inventory.filter(item => item.category === "مستهلكات طبية").reduce((sum, item) => sum + item.stockPercentage, 0) / inventory.filter(item => item.category === "مستهلكات طبية").length)
  },
  {
    name: "أجهزة طبية",
    totalItems: inventory.filter(item => item.category === "أجهزة طبية").length,
    totalValue: inventory.filter(item => item.category === "أجهزة طبية").reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0),
    lowStockItems: inventory.filter(item => item.category === "أجهزة طبية" && item.status === "منخفض").length,
    slowMovingItems: inventory.filter(item => item.category === "أجهزة طبية" && item.slowMoving).length,
    criticalItems: inventory.filter(item => item.category === "أجهزة طبية" && item.critical).length,
    avgStockPercentage: Math.round(inventory.filter(item => item.category === "أجهزة طبية").reduce((sum, item) => sum + item.stockPercentage, 0) / inventory.filter(item => item.category === "أجهزة طبية").length)
  },
  {
    name: "لوازم مكتبية",
    totalItems: inventory.filter(item => item.category === "لوازم مكتبية").length,
    totalValue: inventory.filter(item => item.category === "لوازم مكتبية").reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0),
    lowStockItems: inventory.filter(item => item.category === "لوازم مكتبية" && item.status === "منخفض").length,
    slowMovingItems: inventory.filter(item => item.category === "لوازم مكتبية" && item.slowMoving).length,
    criticalItems: inventory.filter(item => item.category === "لوازم مكتبية" && item.critical).length,
    avgStockPercentage: Math.round(inventory.filter(item => item.category === "لوازم مكتبية").reduce((sum, item) => sum + item.stockPercentage, 0) / inventory.filter(item => item.category === "لوازم مكتبية").length)
  },
  {
    name: "أدوية",
    totalItems: inventory.filter(item => item.category === "أدوية").length,
    totalValue: inventory.filter(item => item.category === "أدوية").reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0),
    lowStockItems: inventory.filter(item => item.category === "أدوية" && item.status === "منخفض").length,
    slowMovingItems: inventory.filter(item => item.category === "أدوية" && item.slowMoving).length,
    criticalItems: inventory.filter(item => item.category === "أدوية" && item.critical).length,
    avgStockPercentage: Math.round(inventory.filter(item => item.category === "أدوية").reduce((sum, item) => sum + item.stockPercentage, 0) / inventory.filter(item => item.category === "أدوية").length)
  },
  {
    name: "معدات تعقيم",
    totalItems: inventory.filter(item => item.category === "معدات تعقيم").length,
    totalValue: inventory.filter(item => item.category === "معدات تعقيم").reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0),
    lowStockItems: inventory.filter(item => item.category === "معدات تعقيم" && item.status === "منخفض").length,
    slowMovingItems: inventory.filter(item => item.category === "معدات تعقيم" && item.slowMoving).length,
    criticalItems: inventory.filter(item => item.category === "معدات تعقيم" && item.critical).length,
    avgStockPercentage: Math.round(inventory.filter(item => item.category === "معدات تعقيم").reduce((sum, item) => sum + item.stockPercentage, 0) / inventory.filter(item => item.category === "معدات تعقيم").length)
  },
  {
    name: "قساطر وأدوات",
    totalItems: inventory.filter(item => item.category === "قساطر وأدوات").length,
    totalValue: inventory.filter(item => item.category === "قساطر وأدوات").reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0),
    lowStockItems: inventory.filter(item => item.category === "قساطر وأدوات" && item.status === "منخفض").length,
    slowMovingItems: inventory.filter(item => item.category === "قساطر وأدوات" && item.slowMoving).length,
    criticalItems: inventory.filter(item => item.category === "قساطر وأدوات" && item.critical).length,
    avgStockPercentage: Math.round(inventory.filter(item => item.category === "قساطر وأدوات").reduce((sum, item) => sum + item.stockPercentage, 0) / inventory.filter(item => item.category === "قساطر وأدوات").length)
  }
];

// Inventory Movement History
export type InventoryMovement = {
  id: string;
  productId: string;
  type: "دخول" | "خروج" | "تعديل" | "نقل" | "تلف";
  quantity: number;
  date: string;
  user: string;
  reference: string; // رقم المرجع (فاتورة، أمر شراء، إلخ)
  notes: string;
};

export const inventoryMovements: InventoryMovement[] = [
  { id: "MOV-001", productId: "INV-001", type: "دخول", quantity: 5000, date: "2025-09-15", user: "أحمد الشمري", reference: "PO-2025-001", notes: "استلام شحنة جديدة" },
  { id: "MOV-002", productId: "INV-001", type: "خروج", quantity: -200, date: "2025-09-14", user: "سارة النعيمي", reference: "SO-2025-045", notes: "بيع للعميل" },
  { id: "MOV-003", productId: "INV-001", type: "تعديل", quantity: 0, date: "2025-09-13", user: "محمد العتيبي", reference: "ADJ-2025-012", notes: "تعديل المخزون" },
  { id: "MOV-004", productId: "INV-001", type: "نقل", quantity: -100, date: "2025-09-12", user: "نورة القحطاني", reference: "TR-2025-008", notes: "نقل إلى فرع جدة" },
  { id: "MOV-005", productId: "INV-001", type: "تلف", quantity: -50, date: "2025-09-11", user: "خالد الغامدي", reference: "DMG-2025-003", notes: "تلف في التخزين" },
  { id: "MOV-006", productId: "INV-002", type: "دخول", quantity: 10000, date: "2025-09-20", user: "أحمد الشمري", reference: "PO-2025-002", notes: "استلام شحنة كمامات" },
  { id: "MOV-007", productId: "INV-002", type: "خروج", quantity: -500, date: "2025-09-19", user: "سارة النعيمي", reference: "SO-2025-046", notes: "بيع للمستشفى" },
  { id: "MOV-008", productId: "INV-003", type: "دخول", quantity: 2000, date: "2025-09-10", user: "محمد العتيبي", reference: "PO-2025-003", notes: "استلام محاليل تعقيم" },
  { id: "MOV-009", productId: "INV-003", type: "خروج", quantity: -100, date: "2025-09-09", user: "نورة القحطاني", reference: "SO-2025-047", notes: "استخدام داخلي" },
  { id: "MOV-010", productId: "INV-004", type: "دخول", quantity: 50, date: "2025-08-30", user: "خالد الغامدي", reference: "PO-2025-004", notes: "استلام قسطرة قلبية" },
];

// Sales Orders (Comprehensive)
export type SalesOrderStatus = "قيد التنفيذ" | "مكتمل" | "بانتظار التسليم" | "ملغي" | "معلق";
export type PaymentStatus = "مدفوع" | "متأخر" | "أقساط تمارا" | "أقساط تابي" | "قيد السداد" | "غير مدفوع";
export type SalesRep = "أحمد الشمري" | "سارة النعيمي" | "محمد العتيبي" | "نورة القحطاني" | "خالد الغامدي";

export type SalesOrder = {
  id: string;
  customer: string;
  customerClassification: "VIP" | "High Value" | "Risk";
  salesRep: SalesRep;
  status: SalesOrderStatus;
  total: number;
  profitMargin: number; // هامش الربح
  orderDate: string;
  deliveryDate: string;
  items: number; // عدد الأصناف
  branch: "الرياض" | "جدة" | "الدمام" | "مكة";
};

export type Invoice = {
  id: string;
  customer: string;
  customerClassification: "VIP" | "High Value" | "Risk";
  amount: number;
  status: PaymentStatus;
  invoiceDate: string;
  dueDate: string;
  overdueDays: number;
  salesRep: SalesRep;
  branch: "الرياض" | "جدة" | "الدمام" | "مكة";
};

// Base sales orders (25 records)
const baseSalesOrders: Array<{
  id: string;
  customer: string;
  customerClassification: "VIP" | "High Value" | "Risk";
  salesRep: SalesRep;
  status: SalesOrderStatus;
  total: number;
  orderDate: string;
  deliveryDate: string;
  items: number;
  branch: "الرياض" | "جدة" | "الدمام" | "مكة";
}> = [
  { id: "SO-10041", customer: "مستشفى الملك خالد", customerClassification: "VIP", salesRep: "أحمد الشمري", status: "قيد التنفيذ", total: 185000, orderDate: "2025-09-22", deliveryDate: "2025-09-30", items: 12, branch: "الرياض" },
  { id: "SO-10042", customer: "مركز الشفاء الطبي", customerClassification: "High Value", salesRep: "سارة النعيمي", status: "مكتمل", total: 42000, orderDate: "2025-09-18", deliveryDate: "2025-09-25", items: 8, branch: "جدة" },
  { id: "SO-10043", customer: "عيادة الندى", customerClassification: "High Value", salesRep: "محمد العتيبي", status: "بانتظار التسليم", total: 15500, orderDate: "2025-09-20", deliveryDate: "2025-09-28", items: 5, branch: "الدمام" },
  { id: "SO-10044", customer: "صيدلية الفردوس", customerClassification: "High Value", salesRep: "نورة القحطاني", status: "ملغي", total: 0, orderDate: "2025-09-15", deliveryDate: "2025-09-22", items: 3, branch: "مكة" },
  { id: "SO-10045", customer: "مستشفى الجامعي", customerClassification: "VIP", salesRep: "خالد الغامدي", status: "مكتمل", total: 95000, orderDate: "2025-09-19", deliveryDate: "2025-09-26", items: 15, branch: "جدة" },
  { id: "SO-10046", customer: "مركز الرعاية الحديثة", customerClassification: "High Value", salesRep: "أحمد الشمري", status: "قيد التنفيذ", total: 67000, orderDate: "2025-09-21", deliveryDate: "2025-09-29", items: 9, branch: "الرياض" },
  { id: "SO-10047", customer: "مركز عناية القلب", customerClassification: "VIP", salesRep: "سارة النعيمي", status: "مكتمل", total: 120000, orderDate: "2025-09-17", deliveryDate: "2025-09-24", items: 11, branch: "الدمام" },
  { id: "SO-10048", customer: "مركز جراحة اليوم الواحد", customerClassification: "High Value", salesRep: "محمد العتيبي", status: "بانتظار التسليم", total: 38000, orderDate: "2025-09-23", deliveryDate: "2025-09-30", items: 6, branch: "الدمام" },
  { id: "SO-10049", customer: "مركز صحة المرأة", customerClassification: "High Value", salesRep: "نورة القحطاني", status: "مكتمل", total: 52000, orderDate: "2025-09-16", deliveryDate: "2025-09-23", items: 7, branch: "مكة" },
  { id: "SO-10050", customer: "مركز الأمل الطبي", customerClassification: "Risk", salesRep: "خالد الغامدي", status: "معلق", total: 25000, orderDate: "2025-09-14", deliveryDate: "2025-09-21", items: 4, branch: "مكة" },
  { id: "SO-10051", customer: "عيادة الابتسامة", customerClassification: "High Value", salesRep: "أحمد الشمري", status: "مكتمل", total: 18000, orderDate: "2025-09-25", deliveryDate: "2025-10-02", items: 3, branch: "جدة" },
  { id: "SO-10052", customer: "عيادة السلام", customerClassification: "Risk", salesRep: "سارة النعيمي", status: "قيد التنفيذ", total: 32000, orderDate: "2025-09-26", deliveryDate: "2025-10-03", items: 5, branch: "الرياض" },
  { id: "SO-10053", customer: "عيادة الروضة", customerClassification: "High Value", salesRep: "محمد العتيبي", status: "مكتمل", total: 28000, orderDate: "2025-09-24", deliveryDate: "2025-10-01", items: 4, branch: "الرياض" },
  { id: "SO-10054", customer: "صيدلية الصحة", customerClassification: "High Value", salesRep: "نورة القحطاني", status: "بانتظار التسليم", total: 15000, orderDate: "2025-09-27", deliveryDate: "2025-10-04", items: 2, branch: "جدة" },
  { id: "SO-10055", customer: "صيدلية النهضة", customerClassification: "Risk", salesRep: "خالد الغامدي", status: "معلق", total: 12000, orderDate: "2025-09-28", deliveryDate: "2025-10-05", items: 3, branch: "الدمام" },
  { id: "SO-10056", customer: "صيدلية الهدى", customerClassification: "High Value", salesRep: "أحمد الشمري", status: "مكتمل", total: 22000, orderDate: "2025-09-29", deliveryDate: "2025-10-06", items: 4, branch: "الرياض" },
  { id: "SO-10057", customer: "مجمع الشفاء الطبي", customerClassification: "High Value", salesRep: "سارة النعيمي", status: "قيد التنفيذ", total: 45000, orderDate: "2025-09-30", deliveryDate: "2025-10-07", items: 8, branch: "مكة" },
  { id: "SO-10058", customer: "مجمع الراحة الطبي", customerClassification: "Risk", salesRep: "محمد العتيبي", status: "معلق", total: 18000, orderDate: "2025-10-01", deliveryDate: "2025-10-08", items: 3, branch: "جدة" },
  { id: "SO-10059", customer: "مؤسسة أدوات طبية الشرقية", customerClassification: "High Value", salesRep: "نورة القحطاني", status: "مكتمل", total: 75000, orderDate: "2025-10-02", deliveryDate: "2025-10-09", items: 10, branch: "الدمام" },
  { id: "SO-10060", customer: "مؤسسة الأجهزة الحديثة", customerClassification: "High Value", salesRep: "خالد الغامدي", status: "بانتظار التسليم", total: 85000, orderDate: "2025-10-03", deliveryDate: "2025-10-10", items: 12, branch: "الرياض" },
  { id: "SO-10061", customer: "مؤسسة الرعاية الأولى", customerClassification: "Risk", salesRep: "أحمد الشمري", status: "معلق", total: 15000, orderDate: "2025-10-04", deliveryDate: "2025-10-11", items: 2, branch: "جدة" },
  { id: "SO-10062", customer: "تاجر جملة المستلزمات", customerClassification: "High Value", salesRep: "سارة النعيمي", status: "مكتمل", total: 110000, orderDate: "2025-10-05", deliveryDate: "2025-10-12", items: 14, branch: "الرياض" },
  { id: "SO-10063", customer: "تاجر جملة الأدوية", customerClassification: "High Value", salesRep: "محمد العتيبي", status: "قيد التنفيذ", total: 95000, orderDate: "2025-10-06", deliveryDate: "2025-10-13", items: 11, branch: "مكة" },
  { id: "SO-10064", customer: "شركة الرعاية الصحية", customerClassification: "High Value", salesRep: "نورة القحطاني", status: "مكتمل", total: 68000, orderDate: "2025-10-07", deliveryDate: "2025-10-14", items: 9, branch: "جدة" },
  { id: "SO-10065", customer: "شركة الشفاء للخدمات", customerClassification: "Risk", salesRep: "خالد الغامدي", status: "معلق", total: 20000, orderDate: "2025-10-08", deliveryDate: "2025-10-15", items: 3, branch: "الرياض" },
];

export const salesOrders: SalesOrder[] = baseSalesOrders.map((order) => {
  const isVip = order.customerClassification === "VIP";
  const isRisk = order.customerClassification === "Risk";
  const profitMargin = isVip ? 0.25 + (Math.random() * 0.1) : isRisk ? 0.15 + (Math.random() * 0.05) : 0.20 + (Math.random() * 0.08);
  return { ...(order as unknown as SalesOrder), profitMargin: Math.round(profitMargin * 100) / 100 } as SalesOrder;
});

// Base invoices (30 records)
const baseInvoices = [
  { id: "INV-22011", customer: "مستشفى الملك خالد", customerClassification: "VIP", amount: 210000, status: "مدفوع", invoiceDate: "2025-09-15", dueDate: "2025-10-15", salesRep: "أحمد الشمري", branch: "الرياض" },
  { id: "INV-22012", customer: "مركز الشفاء الطبي", customerClassification: "High Value", amount: 38000, status: "متأخر", invoiceDate: "2025-09-10", dueDate: "2025-10-10", salesRep: "سارة النعيمي", branch: "جدة" },
  { id: "INV-22013", customer: "أحمد الحربي", customerClassification: "High Value", amount: 1200, status: "أقساط تمارا", invoiceDate: "2025-09-20", dueDate: "2025-10-20", salesRep: "محمد العتيبي", branch: "الرياض" },
  { id: "INV-22014", customer: "صيدلية الفردوس", customerClassification: "High Value", amount: 17600, status: "قيد السداد", invoiceDate: "2025-09-18", dueDate: "2025-10-18", salesRep: "نورة القحطاني", branch: "مكة" },
  { id: "INV-22015", customer: "مستشفى الجامعي", customerClassification: "VIP", amount: 95000, status: "مدفوع", invoiceDate: "2025-09-12", dueDate: "2025-10-12", salesRep: "خالد الغامدي", branch: "جدة" },
  { id: "INV-22016", customer: "مركز الرعاية الحديثة", customerClassification: "High Value", amount: 67000, status: "متأخر", invoiceDate: "2025-09-08", dueDate: "2025-10-08", salesRep: "أحمد الشمري", branch: "الرياض" },
  { id: "INV-22017", customer: "مركز عناية القلب", customerClassification: "VIP", amount: 120000, status: "مدفوع", invoiceDate: "2025-09-14", dueDate: "2025-10-14", salesRep: "سارة النعيمي", branch: "الدمام" },
  { id: "INV-22018", customer: "مركز جراحة اليوم الواحد", customerClassification: "High Value", amount: 38000, status: "أقساط تابي", invoiceDate: "2025-09-16", dueDate: "2025-10-16", salesRep: "محمد العتيبي", branch: "الدمام" },
  { id: "INV-22019", customer: "مركز صحة المرأة", customerClassification: "High Value", amount: 52000, status: "قيد السداد", invoiceDate: "2025-09-11", dueDate: "2025-10-11", salesRep: "نورة القحطاني", branch: "مكة" },
  { id: "INV-22020", customer: "مركز الأمل الطبي", customerClassification: "Risk", amount: 25000, status: "متأخر", invoiceDate: "2025-08-25", dueDate: "2025-09-25", salesRep: "خالد الغامدي", branch: "مكة" },
  { id: "INV-22021", customer: "عيادة الابتسامة", customerClassification: "High Value", amount: 18000, status: "مدفوع", invoiceDate: "2025-09-22", dueDate: "2025-10-22", salesRep: "أحمد الشمري", branch: "جدة" },
  { id: "INV-22022", customer: "عيادة السلام", customerClassification: "Risk", amount: 32000, status: "متأخر", invoiceDate: "2025-08-30", dueDate: "2025-09-30", salesRep: "سارة النعيمي", branch: "الرياض" },
  { id: "INV-22023", customer: "عيادة الروضة", customerClassification: "High Value", amount: 28000, status: "غير مدفوع", invoiceDate: "2025-09-25", dueDate: "2025-10-25", salesRep: "محمد العتيبي", branch: "الرياض" },
  { id: "INV-22024", customer: "صيدلية الصحة", customerClassification: "High Value", amount: 15000, status: "مدفوع", invoiceDate: "2025-09-28", dueDate: "2025-10-28", salesRep: "نورة القحطاني", branch: "جدة" },
  { id: "INV-22025", customer: "صيدلية النهضة", customerClassification: "Risk", amount: 12000, status: "متأخر", invoiceDate: "2025-08-20", dueDate: "2025-09-20", salesRep: "خالد الغامدي", branch: "الدمام" },
  { id: "INV-22026", customer: "صيدلية الهدى", customerClassification: "High Value", amount: 22000, status: "أقساط تمارا", invoiceDate: "2025-09-30", dueDate: "2025-10-30", salesRep: "أحمد الشمري", branch: "الرياض" },
  { id: "INV-22027", customer: "مجمع الشفاء الطبي", customerClassification: "High Value", amount: 45000, status: "قيد السداد", invoiceDate: "2025-10-01", dueDate: "2025-11-01", salesRep: "سارة النعيمي", branch: "مكة" },
  { id: "INV-22028", customer: "مجمع الراحة الطبي", customerClassification: "Risk", amount: 18000, status: "متأخر", invoiceDate: "2025-08-15", dueDate: "2025-09-15", salesRep: "محمد العتيبي", branch: "جدة" },
  { id: "INV-22029", customer: "مؤسسة أدوات طبية الشرقية", customerClassification: "High Value", amount: 75000, status: "مدفوع", invoiceDate: "2025-10-02", dueDate: "2025-11-02", salesRep: "نورة القحطاني", branch: "الدمام" },
  { id: "INV-22030", customer: "مؤسسة الأجهزة الحديثة", customerClassification: "High Value", amount: 85000, status: "غير مدفوع", invoiceDate: "2025-10-03", dueDate: "2025-11-03", salesRep: "خالد الغامدي", branch: "الرياض" },
  { id: "INV-22031", customer: "مؤسسة الرعاية الأولى", customerClassification: "Risk", amount: 15000, status: "متأخر", invoiceDate: "2025-08-10", dueDate: "2025-09-10", salesRep: "أحمد الشمري", branch: "جدة" },
  { id: "INV-22032", customer: "تاجر جملة المستلزمات", customerClassification: "High Value", amount: 110000, status: "مدفوع", invoiceDate: "2025-10-05", dueDate: "2025-11-05", salesRep: "سارة النعيمي", branch: "الرياض" },
  { id: "INV-22033", customer: "تاجر جملة الأدوية", customerClassification: "High Value", amount: 95000, status: "أقساط تابي", invoiceDate: "2025-10-06", dueDate: "2025-11-06", salesRep: "محمد العتيبي", branch: "مكة" },
  { id: "INV-22034", customer: "شركة الرعاية الصحية", customerClassification: "High Value", amount: 68000, status: "قيد السداد", invoiceDate: "2025-10-07", dueDate: "2025-11-07", salesRep: "نورة القحطاني", branch: "جدة" },
  { id: "INV-22035", customer: "شركة الشفاء للخدمات", customerClassification: "Risk", amount: 20000, status: "متأخر", invoiceDate: "2025-08-05", dueDate: "2025-09-05", salesRep: "خالد الغامدي", branch: "الرياض" },
  { id: "INV-22036", customer: "شركة الطب المتقدم", customerClassification: "VIP", amount: 300000, status: "مدفوع", invoiceDate: "2025-10-08", dueDate: "2025-11-08", salesRep: "أحمد الشمري", branch: "الدمام" },
  { id: "INV-22037", customer: "شركة الرعاية المتخصصة", customerClassification: "High Value", amount: 210000, status: "غير مدفوع", invoiceDate: "2025-10-09", dueDate: "2025-11-09", salesRep: "سارة النعيمي", branch: "الرياض" },
  { id: "INV-22038", customer: "شركة الأجهزة الطبية الخليجية", customerClassification: "High Value", amount: 240000, status: "أقساط تمارا", invoiceDate: "2025-10-10", dueDate: "2025-11-10", salesRep: "محمد العتيبي", branch: "جدة" },
  { id: "INV-22039", customer: "شركة طب الأسرة", customerClassification: "Risk", amount: 40000, status: "متأخر", invoiceDate: "2025-08-01", dueDate: "2025-09-01", salesRep: "نورة القحطاني", branch: "مكة" },
  { id: "INV-22040", customer: "مستشفى السلام", customerClassification: "High Value", amount: 230000, status: "مدفوع", invoiceDate: "2025-10-11", dueDate: "2025-11-11", salesRep: "خالد الغامدي", branch: "الدمام" },
];

export const invoices: Invoice[] = baseInvoices.map((invoice) => {
  const today = new Date();
  const dueDate = new Date(invoice.dueDate);
  const overdueDays = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
  return { ...(invoice as unknown as Invoice), overdueDays } as Invoice;
});

// Monthly Sales Trend Data (12 months)
export const monthlySalesTrend = [
  { month: "أكتوبر 2024", sales: 850000, orders: 45, profit: 170000 },
  { month: "نوفمبر 2024", sales: 920000, orders: 52, profit: 184000 },
  { month: "ديسمبر 2024", sales: 1100000, orders: 68, profit: 220000 },
  { month: "يناير 2025", sales: 980000, orders: 58, profit: 196000 },
  { month: "فبراير 2025", sales: 1050000, orders: 62, profit: 210000 },
  { month: "مارس 2025", sales: 1150000, orders: 71, profit: 230000 },
  { month: "أبريل 2025", sales: 1080000, orders: 65, profit: 216000 },
  { month: "مايو 2025", sales: 1200000, orders: 75, profit: 240000 },
  { month: "يونيو 2025", sales: 1250000, orders: 78, profit: 250000 },
  { month: "يوليو 2025", sales: 1180000, orders: 72, profit: 236000 },
  { month: "أغسطس 2025", sales: 1320000, orders: 82, profit: 264000 },
  { month: "سبتمبر 2025", sales: 1280000, orders: 79, profit: 256000 },
];

// Expenses & Costing Summary
export const expenseSummary = [
  { category: "رواتب", month: "سبتمبر", amount: 220000 },
  { category: "إيجار", month: "سبتمبر", amount: 80000 },
  { category: "عمولات", month: "سبتمبر", amount: 35000 },
  { category: "بوابات دفع", month: "سبتمبر", amount: 12000 },
];

// Support tickets
export const tickets = [
  { id: "T-301", subject: "طلب صيانة جهاز تعقيم", customer: "مركز الشفاء الطبي", sla: "24 ساعة", status: "مفتوح" },
  { id: "T-302", subject: "استبدال دفعة من الكمامات", customer: "صيدلية الفردوس", sla: "48 ساعة", status: "قيد المعالجة" },
];

// Marketing campaigns
export const campaigns = [
  { name: "خصم المستلزمات الجراحية", channel: "بريد إلكتروني", audience: "مستشفيات خاصة", status: "جارية" },
  { name: "عرض أجهزة الأشعة", channel: "واتساب", audience: "مراكز طبية", status: "مجدولة" },
];

// Reports list
export const reports = [
  { title: "مبيعات حسب الفرع", description: "تقرير شهري حسب المدن" },
  { title: "تحليل الربحية", description: "صافي الربح حسب المنتج" },
  { title: "أعمار الديون", description: "تقادم الذمم المدينة" },
];

// Roles & users
export const roles = [
  { role: "مدير الفرع", permissions: "كافة العمليات" },
  { role: "مندوب المبيعات", permissions: "العملاء + العروض + الطلبات" },
  { role: "محاسب الفواتير", permissions: "التحصيلات + المدفوعات" },
  { role: "مسؤول المشتريات", permissions: "الموردون + أوامر الشراء" },
  { role: "مسؤول المخزون", permissions: "الحركات والتنبيهات" },
];

// Integrations
export const integrations = [
  { name: "WhatsApp Cloud API", status: "متصل" },
  { name: "Tabby", status: "متصل" },
  { name: "Tamara", status: "متصل" },
  { name: "Zoho Books", status: "قيد الإعداد" },
  { name: "SMSA", status: "متصل" },
];

// Mock notifications for header
export const notifications = [
  {
    title: "تنبيه مخاطر",
    detail: "عميل 'مستشفى الملك خالد' تجاوز حد الائتمان وتم تصنيفه كمخاطر عالية.",
    time: "منذ 5 دقائق",
  },
  {
    title: "عميل جديد",
    detail: "تم تسجيل عميل جديد (مركز دار الشفاء الطبي) ينتظر الموافقة من المبيعات.",
    time: "منذ 20 دقيقة",
  },
  {
    title: "مشكلة توريد",
    detail: "طلبية شراء رقم #345 من 'شركة المستقبل للمستلزمات' متأخرة 3 أيام عن موعد التسليم.",
    time: "منذ ساعة",
  },
  {
    title: "تحصيل مالي",
    detail: "تم تحصيل دفعة بقيمة 25,000 ريال من 'مركز الرعاية الحديثة'.",
    time: "اليوم",
  },
];

// Employees mock data
export type EmployeeStatus = "نشط" | "إجازة";
export type Employee = {
  id: string;
  name: string;
  title: string;
  department: string;
  salary: number;
  status: EmployeeStatus;
  joined: string; // ISO date
};

const departments = ["المبيعات", "المالية", "المخزون", "المشتريات", "الدعم", "التسويق"];
const titles = ["مدير مبيعات", "محاسب", "أمين مستودع", "مسؤول مشتريات", "ممثل دعم", "أخصائي تسويق", "مندوب مبيعات", "محاسب رواتب"];

export const employees: Employee[] = Array.from({ length: 50 }).map((_, i) => {
  const name = ["أحمد", "محمد", "سارة", "نورة", "خالد", "ليلى", "راكان", "هدى", "زياد", "ريم"][i % 10] + " " + ["العتيبي", "القحطاني", "الشهري", "الغامدي", "المطيري"][Math.floor(i % 5)];
  const department = departments[i % departments.length];
  const title = titles[i % titles.length];
  const salary = 6000 + ((i * 137) % 9000);
  const status: EmployeeStatus = i % 7 === 0 ? "إجازة" : "نشط";
  const month = ((i % 12) + 1).toString().padStart(2, "0");
  const day = ((i % 28) + 1).toString().padStart(2, "0");
  const joined = `2024-${month}-${day}`;
  return { id: `EMP-${String(i + 1).padStart(4, '0')}`, name, title, department, salary, status, joined };
});

// Expense Types
export type ExpenseStatus = "مدفوع" | "مستحق" | "متأخر" | "ملغي";
export type ExpenseCategory = "رواتب" | "إيجار" | "تسويق" | "معدات" | "نقل" | "مرافق" | "صيانة" | "تدريب" | "تأمين" | "أخرى";
export type ExpenseChannel = "نقدي" | "تحويل بنكي" | "بطاقة ائتمان" | "شيك";

export type Expense = {
  id: string;
  description: string;
  category: ExpenseCategory;
  channel: ExpenseChannel;
  amount: number;
  status: ExpenseStatus;
  expenseDate: string; // ISO date
  dueDate: string; // ISO date
  vendor: string;
  department: string;
  approvedBy: string;
  receiptNumber?: string;
};

// Generate 100 realistic expense records
export const expenses: Expense[] = Array.from({ length: 100 }).map((_, i) => {
  const categories: ExpenseCategory[] = ["رواتب", "إيجار", "تسويق", "معدات", "نقل", "مرافق", "صيانة", "تدريب", "تأمين", "أخرى"];
  const channels: ExpenseChannel[] = ["نقدي", "تحويل بنكي", "بطاقة ائتمان", "شيك"];
  const statuses: ExpenseStatus[] = ["مدفوع", "مستحق", "متأخر", "ملغي"];
  const departments = ["المبيعات", "المالية", "المخزون", "المشتريات", "الدعم", "التسويق"];
  const vendors = ["شركة الكهرباء", "شركة المياه", "مكتبة الأجهزة", "شركة النقل", "مؤسسة التدريب", "شركة التأمين", "مكتب المحاسبة", "شركة الصيانة"];
  const approvers = ["أحمد العتيبي", "محمد القحطاني", "سارة الشهري", "نورة الغامدي", "خالد المطيري"];
  
  const category = categories[i % categories.length];
  const channel = channels[i % channels.length];
  const status = statuses[i % statuses.length];
  const department = departments[i % departments.length];
  const vendor = vendors[i % vendors.length];
  const approver = approvers[i % approvers.length];
  
  // Generate realistic amounts based on category
  let baseAmount = 0;
  switch (category) {
    case "رواتب": baseAmount = 15000 + (i * 2000) % 25000; break;
    case "إيجار": baseAmount = 8000 + (i * 500) % 3000; break;
    case "تسويق": baseAmount = 2000 + (i * 300) % 5000; break;
    case "معدات": baseAmount = 5000 + (i * 1000) % 15000; break;
    case "نقل": baseAmount = 500 + (i * 100) % 2000; break;
    case "مرافق": baseAmount = 1000 + (i * 200) % 3000; break;
    case "صيانة": baseAmount = 1500 + (i * 300) % 4000; break;
    case "تدريب": baseAmount = 3000 + (i * 500) % 8000; break;
    case "تأمين": baseAmount = 2000 + (i * 400) % 6000; break;
    default: baseAmount = 1000 + (i * 200) % 5000; break;
  }
  
  const amount = Math.round(baseAmount);
  
  // Generate dates
  const now = new Date();
  const daysAgo = (i * 3) % 90; // Spread over last 90 days
  const expenseDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
  const dueDate = new Date(expenseDate.getTime() + (7 + (i % 14)) * 24 * 60 * 60 * 1000);
  
  const expenseDateStr = expenseDate.toISOString().slice(0, 10);
  const dueDateStr = dueDate.toISOString().slice(0, 10);
  
  const descriptions = [
    `دفع ${category} - ${vendor}`,
    `مصروف ${category} - ${department}`,
    `فاتورة ${vendor} - ${category}`,
    `خدمة ${category} - ${department}`,
    `مشتريات ${category} - ${vendor}`
  ];
  
  return {
    id: `EXP-${String(i + 1).padStart(4, '0')}`,
    description: descriptions[i % descriptions.length],
    category,
    channel,
    amount,
    status,
    expenseDate: expenseDateStr,
    dueDate: dueDateStr,
    vendor,
    department,
    approvedBy: approver,
    receiptNumber: status === "مدفوع" ? `RCP-${String(i + 1).padStart(6, '0')}` : undefined
  };
});

// Monthly Budget Data
export const monthlyBudgets = [
  { category: "رواتب", budget: 150000, spent: 145000, remaining: 5000 },
  { category: "إيجار", budget: 25000, spent: 24000, remaining: 1000 },
  { category: "تسويق", budget: 30000, spent: 18500, remaining: 11500 },
  { category: "معدات", budget: 50000, spent: 32000, remaining: 18000 },
  { category: "نقل", budget: 15000, spent: 12000, remaining: 3000 },
  { category: "مرافق", budget: 20000, spent: 18500, remaining: 1500 },
  { category: "صيانة", budget: 25000, spent: 12000, remaining: 13000 },
  { category: "تدريب", budget: 35000, spent: 28000, remaining: 7000 },
  { category: "تأمين", budget: 40000, spent: 38000, remaining: 2000 },
  { category: "أخرى", budget: 20000, spent: 15000, remaining: 5000 }
];


