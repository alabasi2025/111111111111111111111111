/**
 * دوال مساعدة عامة للنظام المحاسبي الذكي
 */

/**
 * تنسيق التاريخ
 */
export const formatDate = (date: Date | string, format: 'short' | 'long' | 'time' = 'short'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) {
    return 'تاريخ غير صالح';
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'long' ? 'long' : '2-digit',
    day: '2-digit',
  };

  if (format === 'time') {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return d.toLocaleDateString('ar-SA', options);
};

/**
 * تنسيق العملة
 */
export const formatCurrency = (amount: number, currency: string = 'SAR'): string => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * تنسيق الأرقام
 */
export const formatNumber = (num: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('ar-SA', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * التحقق من صحة البريد الإلكتروني
 */
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * التحقق من صحة رقم الهاتف السعودي
 */
export const validateSaudiPhone = (phone: string): boolean => {
  const regex = /^(05|5)[0-9]{8}$/;
  return regex.test(phone.replace(/[\s-]/g, ''));
};

/**
 * التحقق من صحة الرقم الضريبي السعودي
 */
export const validateSaudiTaxNumber = (taxNumber: string): boolean => {
  const regex = /^3[0-9]{14}$/;
  return regex.test(taxNumber);
};

/**
 * تقصير النص
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * تحويل النص إلى slug
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

/**
 * حساب النسبة المئوية
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

/**
 * حساب الضريبة
 */
export const calculateTax = (amount: number, taxRate: number): number => {
  return amount * (taxRate / 100);
};

/**
 * حساب الخصم
 */
export const calculateDiscount = (amount: number, discountRate: number): number => {
  return amount * (discountRate / 100);
};

/**
 * حساب الإجمالي مع الضريبة
 */
export const calculateTotalWithTax = (subtotal: number, taxRate: number): number => {
  return subtotal + calculateTax(subtotal, taxRate);
};

/**
 * حساب الإجمالي بعد الخصم
 */
export const calculateTotalAfterDiscount = (amount: number, discountRate: number): number => {
  return amount - calculateDiscount(amount, discountRate);
};

/**
 * تحويل التاريخ إلى ISO string
 */
export const toISODate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
};

/**
 * الحصول على بداية الشهر
 */
export const getMonthStart = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * الحصول على نهاية الشهر
 */
export const getMonthEnd = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

/**
 * الحصول على بداية السنة
 */
export const getYearStart = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), 0, 1);
};

/**
 * الحصول على نهاية السنة
 */
export const getYearEnd = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), 11, 31);
};

/**
 * حساب الفرق بالأيام بين تاريخين
 */
export const daysDifference = (date1: Date, date2: Date): number => {
  const diff = Math.abs(date1.getTime() - date2.getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/**
 * التحقق من انتهاء التاريخ
 */
export const isExpired = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d < new Date();
};

/**
 * توليد رقم عشوائي
 */
export const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * توليد معرف فريد
 */
export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * نسخ النص إلى الحافظة
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('فشل النسخ:', error);
    return false;
  }
};

/**
 * تنزيل ملف
 */
export const downloadFile = (data: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * تحويل JSON إلى CSV
 */
export const jsonToCSV = (data: any[]): string => {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const rows = data.map(row => 
    headers.map(header => JSON.stringify(row[header] || '')).join(',')
  );
  
  return [headers.join(','), ...rows].join('\n');
};

/**
 * تحويل الأرقام الإنجليزية إلى عربية
 */
export const toArabicNumbers = (str: string): string => {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.replace(/[0-9]/g, (digit) => arabicNumbers[parseInt(digit)]);
};

/**
 * تحويل الأرقام العربية إلى إنجليزية
 */
export const toEnglishNumbers = (str: string): string => {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.replace(/[٠-٩]/g, (digit) => arabicNumbers.indexOf(digit).toString());
};

/**
 * التحقق من وجود قيمة
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * تأخير التنفيذ
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * تحويل حجم الملف إلى نص مقروء
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 بايت';
  
  const k = 1024;
  const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * الحصول على لون حسب الحالة
 */
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    draft: 'gray',
    pending: 'yellow',
    approved: 'green',
    rejected: 'red',
    cancelled: 'gray',
    active: 'green',
    inactive: 'gray',
    paid: 'green',
    unpaid: 'red',
    overdue: 'orange',
    todo: 'gray',
    in_progress: 'blue',
    review: 'purple',
    done: 'green',
  };
  
  return colors[status.toLowerCase()] || 'gray';
};

/**
 * الحصول على اسم الشهر بالعربية
 */
export const getArabicMonthName = (month: number): string => {
  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  return months[month];
};

/**
 * الحصول على اسم اليوم بالعربية
 */
export const getArabicDayName = (day: number): string => {
  const days = [
    'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'
  ];
  return days[day];
};

/**
 * فرز مصفوفة من الكائنات
 */
export const sortBy = <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * تجميع مصفوفة حسب مفتاح
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

/**
 * إزالة التكرارات من مصفوفة
 */
export const unique = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

/**
 * تقسيم مصفوفة إلى أجزاء
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};
