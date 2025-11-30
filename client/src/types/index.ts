/**
 * تعريفات الأنواع المشتركة في النظام المحاسبي الذكي
 */

// نوع المستخدم
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'accountant' | 'manager' | 'employee' | 'viewer';
  isActive: boolean;
  organizationId?: number;
  branchId?: number;
  createdAt: Date;
  updatedAt: Date;
}

// نوع المؤسسة
export interface Organization {
  id: number;
  name: string;
  nameEn?: string;
  taxNumber?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
  currency: string;
  fiscalYearStart: Date;
  isActive: boolean;
  createdAt: Date;
}

// نوع الفرع
export interface Branch {
  id: number;
  organizationId: number;
  name: string;
  nameEn?: string;
  code: string;
  address?: string;
  phone?: string;
  managerId?: number;
  isActive: boolean;
  createdAt: Date;
}

// نوع الحساب المحاسبي
export interface Account {
  id: number;
  code: string;
  nameAr: string;
  nameEn: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  parentId?: number;
  level: number;
  isActive: boolean;
  balance: number;
  currency: string;
  createdAt: Date;
}

// نوع القيد المحاسبي
export interface JournalEntry {
  id: number;
  entryNumber: string;
  date: Date;
  description: string;
  type: 'manual' | 'auto' | 'opening' | 'closing' | 'adjustment';
  status: 'draft' | 'posted' | 'approved' | 'cancelled';
  totalDebit: number;
  totalCredit: number;
  createdBy: number;
  approvedBy?: number;
  createdAt: Date;
  lines: JournalEntryLine[];
}

// نوع سطر القيد
export interface JournalEntryLine {
  id: number;
  entryId: number;
  accountId: number;
  debit: number;
  credit: number;
  description: string;
  costCenter?: string;
  reference?: string;
}

// نوع المهمة
export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: number;
  createdBy: number;
  dueDate?: Date;
  completedAt?: Date;
  tags: string[];
  attachments: string[];
  projectId?: number;
  parentTaskId?: number;
  estimatedHours?: number;
  actualHours?: number;
  createdAt: Date;
  updatedAt: Date;
}

// نوع المشروع
export interface Project {
  id: number;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  budget?: number;
  managerId: number;
  clientId?: number;
  createdAt: Date;
}

// نوع الفاتورة
export interface Invoice {
  id: number;
  invoiceNumber: string;
  type: 'sales' | 'purchase';
  customerId?: number;
  supplierId?: number;
  date: Date;
  dueDate: Date;
  status: 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'cancelled';
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  paidAmount: number;
  currency: string;
  notes?: string;
  items: InvoiceItem[];
  payments: Payment[];
  createdAt: Date;
}

// نوع عنصر الفاتورة
export interface InvoiceItem {
  id: number;
  invoiceId: number;
  productId?: number;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discountRate: number;
  total: number;
}

// نوع الدفعة
export interface Payment {
  id: number;
  invoiceId?: number;
  amount: number;
  date: Date;
  method: 'cash' | 'bank_transfer' | 'check' | 'credit_card' | 'other';
  reference?: string;
  notes?: string;
  createdBy: number;
  createdAt: Date;
}

// نوع العميل/المورد
export interface Contact {
  id: number;
  type: 'customer' | 'supplier' | 'both';
  name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  city?: string;
  country?: string;
  taxNumber?: string;
  creditLimit?: number;
  balance: number;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
}

// نوع المنتج
export interface Product {
  id: number;
  code: string;
  barcode?: string;
  nameAr: string;
  nameEn: string;
  description?: string;
  category?: string;
  unit: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  maxStock?: number;
  reorderPoint?: number;
  supplierId?: number;
  isActive: boolean;
  image?: string;
  createdAt: Date;
}

// نوع حركة المخزون
export interface StockMovement {
  id: number;
  productId: number;
  type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  unitCost: number;
  totalCost: number;
  fromWarehouse?: number;
  toWarehouse?: number;
  reference?: string;
  notes?: string;
  createdBy: number;
  createdAt: Date;
}

// نوع التقرير المالي
export interface FinancialReport {
  id: number;
  type: 'balance_sheet' | 'income_statement' | 'cash_flow' | 'trial_balance' | 'ledger';
  periodStart: Date;
  periodEnd: Date;
  data: any;
  generatedBy: number;
  generatedAt: Date;
}

// نوع الاستجابة من API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

// نوع الصفحة المقسمة
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// نوع خيارات الجدول
export interface TableOptions {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
  search?: string;
}

// نوع الإشعار
export interface Notification {
  id: number;
  userId: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  actionLabel?: string;
  createdAt: Date;
}

// نوع الصلاحية
export interface Permission {
  id: number;
  name: string;
  code: string;
  module: string;
  description: string;
  isActive: boolean;
}

// نوع الدور
export interface Role {
  id: number;
  name: string;
  code: string;
  description: string;
  permissions: Permission[];
  isActive: boolean;
  createdAt: Date;
}

// نوع الأصل
export interface Asset {
  id: number;
  code: string;
  name: string;
  category: string;
  purchaseDate: Date;
  purchasePrice: number;
  currentValue: number;
  depreciationMethod: 'straight_line' | 'declining_balance' | 'units_of_production';
  usefulLife: number;
  salvageValue: number;
  location?: string;
  status: 'active' | 'disposed' | 'under_maintenance';
  createdAt: Date;
}

// نوع الراتب
export interface Payroll {
  id: number;
  employeeId: number;
  period: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'draft' | 'approved' | 'paid';
  paidDate?: Date;
  createdBy: number;
  createdAt: Date;
}

// نوع العقد
export interface Contract {
  id: number;
  contractNumber: string;
  type: 'sales' | 'purchase' | 'service' | 'employment';
  partyName: string;
  startDate: Date;
  endDate: Date;
  value: number;
  status: 'draft' | 'active' | 'expired' | 'cancelled';
  terms?: string;
  attachments: string[];
  createdBy: number;
  createdAt: Date;
}

// نوع مركز التكلفة
export interface CostCenter {
  id: number;
  code: string;
  name: string;
  description?: string;
  managerId?: number;
  budget?: number;
  isActive: boolean;
  createdAt: Date;
}

// نوع الميزانية
export interface Budget {
  id: number;
  name: string;
  fiscalYear: number;
  accountId: number;
  costCenterId?: number;
  amount: number;
  spent: number;
  remaining: number;
  status: 'draft' | 'approved' | 'active' | 'closed';
  createdAt: Date;
}
