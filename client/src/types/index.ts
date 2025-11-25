export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
}

export interface Organization {
  id: number;
  name: string;
  createdAt: Date;
}

export interface Branch {
  id: number;
  organizationId: number;
  name: string;
}
