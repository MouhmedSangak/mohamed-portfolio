// ============================================
// Admin Types
// ============================================

import { Admin, ContactMessage, AdminPermissions } from './database';

export interface AdminUser extends Omit<Admin, 'permissions'> {
  permissions: AdminPermissions;
}

export interface AdminSession {
  user: AdminUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  captchaToken: string;
}

export interface DashboardStats {
  totalVisitors: number;
  dailyVisitors: number;
  totalPageviews: number;
  newMessages: number;
  totalProjects: number;
  totalBlogPosts: number;
}

export interface AnalyticsData {
  date: string;
  visitors: number;
  pageviews: number;
}

export interface InboxMessage extends ContactMessage {
  isSelected?: boolean;
}

export interface AdminAction {
  type: 'create' | 'update' | 'delete' | 'publish' | 'unpublish' | 'archive';
  resource: string;
  resourceId: string;
  timestamp: string;
  adminId: string;
}

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface FilterState {
  search: string;
  status?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
}