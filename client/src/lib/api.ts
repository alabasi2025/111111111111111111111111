/**
 * مكتبة API للتواصل مع الخادم - النظام المحاسبي الذكي
 */

import type { ApiResponse, PaginatedResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * خيارات الطلب
 */
interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
}

/**
 * معالج الأخطاء
 */
class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * دالة مساعدة لبناء URL مع المعاملات
 */
function buildUrl(endpoint: string, params?: Record<string, any>): string {
  const url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
}

/**
 * دالة مساعدة لإرسال الطلبات
 */
async function request<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;
  
  const url = buildUrl(endpoint, params);
  
  // إضافة headers افتراضية
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };
  
  // إضافة token إذا كان موجوداً
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });
    
    // محاولة قراءة الاستجابة كـ JSON
    let data: any;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // التحقق من نجاح الطلب
    if (!response.ok) {
      throw new ApiError(
        response.status,
        data?.message || data?.error || 'حدث خطأ في الطلب',
        data
      );
    }
    
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // خطأ في الاتصال
    if (error instanceof TypeError) {
      throw new ApiError(0, 'فشل الاتصال بالخادم', error);
    }
    
    throw new ApiError(500, 'حدث خطأ غير متوقع', error);
  }
}

/**
 * دوال API الأساسية
 */
export const api = {
  /**
   * طلب GET
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return request<T>(endpoint, { method: 'GET', params });
  },
  
  /**
   * طلب POST
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * طلب PUT
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * طلب PATCH
   */
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * طلب DELETE
   */
  async delete<T>(endpoint: string): Promise<T> {
    return request<T>(endpoint, { method: 'DELETE' });
  },
  
  /**
   * رفع ملف
   */
  async upload<T = any>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }
    
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin);
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers,
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(response.status, error.message || 'فشل رفع الملف', error);
    }
    
    return response.json();
  },
  
  /**
   * تنزيل ملف
   */
  async download(endpoint: string, filename: string): Promise<void> {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin);
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      throw new ApiError(response.status, 'فشل تنزيل الملف');
    }
    
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  },
};

/**
 * دوال API محددة للنظام
 */

// المصادقة
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post<ApiResponse<{ token: string; user: any }>>('/auth/login', credentials),
  
  logout: () => api.post('/auth/logout'),
  
  register: (data: any) => api.post<ApiResponse<{ user: any }>>('/auth/register', data),
  
  getCurrentUser: () => api.get<ApiResponse<any>>('/auth/me'),
  
  refreshToken: () => api.post<ApiResponse<{ token: string }>>('/auth/refresh'),
};

// المستخدمون
export const usersApi = {
  getAll: (params?: any) => api.get<PaginatedResponse<any>>('/users', params),
  getById: (id: number) => api.get<ApiResponse<any>>(`/users/${id}`),
  create: (data: any) => api.post<ApiResponse<any>>('/users', data),
  update: (id: number, data: any) => api.put<ApiResponse<any>>(`/users/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/users/${id}`),
};

// الحسابات المحاسبية
export const accountsApi = {
  getAll: (params?: any) => api.get<PaginatedResponse<any>>('/accounts', params),
  getById: (id: number) => api.get<ApiResponse<any>>(`/accounts/${id}`),
  create: (data: any) => api.post<ApiResponse<any>>('/accounts', data),
  update: (id: number, data: any) => api.put<ApiResponse<any>>(`/accounts/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/accounts/${id}`),
  getTree: () => api.get<ApiResponse<any[]>>('/accounts/tree'),
};

// القيود المحاسبية
export const journalEntriesApi = {
  getAll: (params?: any) => api.get<PaginatedResponse<any>>('/journal-entries', params),
  getById: (id: number) => api.get<ApiResponse<any>>(`/journal-entries/${id}`),
  create: (data: any) => api.post<ApiResponse<any>>('/journal-entries', data),
  update: (id: number, data: any) => api.put<ApiResponse<any>>(`/journal-entries/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/journal-entries/${id}`),
  post: (id: number) => api.post<ApiResponse<any>>(`/journal-entries/${id}/post`),
  approve: (id: number) => api.post<ApiResponse<any>>(`/journal-entries/${id}/approve`),
};

// المهام
export const tasksApi = {
  getAll: (params?: any) => api.get<PaginatedResponse<any>>('/tasks', params),
  getById: (id: number) => api.get<ApiResponse<any>>(`/tasks/${id}`),
  create: (data: any) => api.post<ApiResponse<any>>('/tasks', data),
  update: (id: number, data: any) => api.put<ApiResponse<any>>(`/tasks/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/tasks/${id}`),
  updateStatus: (id: number, status: string) =>
    api.patch<ApiResponse<any>>(`/tasks/${id}/status`, { status }),
};

// الفواتير
export const invoicesApi = {
  getAll: (params?: any) => api.get<PaginatedResponse<any>>('/invoices', params),
  getById: (id: number) => api.get<ApiResponse<any>>(`/invoices/${id}`),
  create: (data: any) => api.post<ApiResponse<any>>('/invoices', data),
  update: (id: number, data: any) => api.put<ApiResponse<any>>(`/invoices/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/invoices/${id}`),
  print: (id: number) => api.download(`/invoices/${id}/print`, `invoice-${id}.pdf`),
};

// التقارير
export const reportsApi = {
  balanceSheet: (params: { startDate: string; endDate: string }) =>
    api.get<ApiResponse<any>>('/reports/balance-sheet', params),
  incomeStatement: (params: { startDate: string; endDate: string }) =>
    api.get<ApiResponse<any>>('/reports/income-statement', params),
  trialBalance: (params: { date: string }) =>
    api.get<ApiResponse<any>>('/reports/trial-balance', params),
  cashFlow: (params: { startDate: string; endDate: string }) =>
    api.get<ApiResponse<any>>('/reports/cash-flow', params),
};

// الإشعارات
export const notificationsApi = {
  getAll: (params?: any) => api.get<PaginatedResponse<any>>('/notifications', params),
  markAsRead: (id: number) => api.patch<ApiResponse<void>>(`/notifications/${id}/read`),
  markAllAsRead: () => api.post<ApiResponse<void>>('/notifications/read-all'),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/notifications/${id}`),
};

export { ApiError };
export default api;
