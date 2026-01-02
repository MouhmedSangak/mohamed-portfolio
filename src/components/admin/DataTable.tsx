// ============================================
// Data Table Component
// ============================================

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Checkbox } from '@/components/ui/Toggle';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (item: T, index: number) => React.ReactNode;
}

export interface Action<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  danger?: boolean;
  show?: (item: T) => boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  keyField: keyof T;
  isLoading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  selectable?: boolean;
  onSelectionChange?: (selected: T[]) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions,
  keyField,
  isLoading = false,
  searchable = false,
  searchPlaceholder = 'Search...',
  selectable = false,
  onSelectionChange,
  pagination,
  emptyMessage = 'No data available',
  emptyIcon,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<any>>(new Set());

  // Filter data
  const filteredData = searchQuery
    ? data.filter((item) =>
        columns.some((col) => {
          const value = item[col.key];
          return String(value).toLowerCase().includes(searchQuery.toLowerCase());
        })
      )
    : data;

  // Sort data
  const sortedData = sortKey
    ? [...filteredData].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        const modifier = sortDirection === 'asc' ? 1 : -1;
        
        if (typeof aVal === 'string') {
          return aVal.localeCompare(bVal) * modifier;
        }
        return (aVal - bVal) * modifier;
      })
    : filteredData;

  // Handle sort
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Handle selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(sortedData.map((item) => item[keyField]));
      setSelectedIds(allIds);
      onSelectionChange?.(sortedData);
    } else {
      setSelectedIds(new Set());
      onSelectionChange?.([]);
    }
  };

  const handleSelectItem = (item: T, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(item[keyField]);
    } else {
      newSelected.delete(item[keyField]);
    }
    setSelectedIds(newSelected);
    onSelectionChange?.(data.filter((d) => newSelected.has(d[keyField])));
  };

  const isAllSelected = sortedData.length > 0 && selectedIds.size === sortedData.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < sortedData.length;

  // Pagination
  const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 1;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      {searchable && (
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder:text-dark-400 focus:border-primary-500 focus:outline-none transition-colors"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-dark-700">
        <table className="w-full">
          <thead>
            <tr className="bg-dark-800/50">
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isSomeSelected}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider',
                    column.sortable && 'cursor-pointer select-none hover:text-white transition-colors'
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && (
                      <span className="text-dark-500">
                        {sortKey === column.key ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="w-12 px-4 py-3" />
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {selectable && (
                    <td className="px-4 py-4">
                      <div className="w-5 h-5 bg-dark-700 rounded animate-pulse" />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-4">
                      <div className="h-4 bg-dark-700 rounded animate-pulse" />
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-4">
                      <div className="w-8 h-8 bg-dark-700 rounded animate-pulse" />
                    </td>
                  )}
                </tr>
              ))
            ) : sortedData.length > 0 ? (
              sortedData.map((item, index) => (
                <motion.tr
                  key={item[keyField]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-dark-800/50 transition-colors"
                >
                  {selectable && (
                    <td className="px-4 py-4">
                      <Checkbox
                        checked={selectedIds.has(item[keyField])}
                        onChange={(checked) => handleSelectItem(item, checked)}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-4 py-4 text-sm text-dark-200"
                    >
                      {column.render
                        ? column.render(item, index)
                        : item[column.key]}
                    </td>
                  ))}
                  {actions && actions.length > 0 && (
                    <td className="px-4 py-4">
                      <Dropdown
                        trigger={
                          <button className="p-1 rounded hover:bg-dark-700 transition-colors">
                            <MoreHorizontal className="h-5 w-5 text-dark-400" />
                          </button>
                        }
                        align="end"
                      >
                        {actions
                          .filter((action) => !action.show || action.show(item))
                          .map((action, i) => (
                            <DropdownItem
                              key={i}
                              icon={action.icon}
                              danger={action.danger}
                              onClick={() => action.onClick(item)}
                            >
                              {action.label}
                            </DropdownItem>
                          ))}
                      </Dropdown>
                    </td>
                  )}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                  className="px-4 py-12 text-center"
                >
                  <div className="flex flex-col items-center">
                    {emptyIcon && (
                      <div className="mb-3 text-dark-500">{emptyIcon}</div>
                    )}
                    <p className="text-dark-400">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-dark-400">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
            {pagination.total} results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg hover:bg-dark-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => pagination.onPageChange(page)}
                  className={cn(
                    'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                    pagination.page === page
                      ? 'bg-primary-500 text-white'
                      : 'hover:bg-dark-800 text-dark-300'
                  )}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
              className="p-2 rounded-lg hover:bg-dark-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}