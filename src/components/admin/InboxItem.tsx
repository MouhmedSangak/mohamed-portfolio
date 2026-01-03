// ============================================
// Inbox Item Component
// ============================================

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Archive,
  Trash2,
  MoreHorizontal,
  Check,
  Clock,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/Badge';
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui/Dropdown';
import { formatRelativeDate } from '@/lib/utils/formatDate';
import type { ContactMessage } from '@/types/database';

// Status type that matches the inbox page
type MessageStatus = 'new' | 'read' | 'replied' | 'archived';

interface InboxItemProps {
  message: ContactMessage;
  status: MessageStatus;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onStatusChange?: (id: string, status: MessageStatus) => void;
  onDelete?: (id: string) => void;
  onView?: (message: ContactMessage) => void;
}

const statusConfig: Record<MessageStatus, { 
  label: string; 
  color: 'info' | 'warning' | 'success' | 'secondary'; 
  icon: typeof AlertCircle 
}> = {
  new: { label: 'New', color: 'info', icon: AlertCircle },
  read: { label: 'Read', color: 'warning', icon: Eye },
  replied: { label: 'Replied', color: 'success', icon: Check },
  archived: { label: 'Archived', color: 'secondary', icon: Archive },
};

export function InboxItem({
  message,
  status,
  isSelected,
  onSelect,
  onStatusChange,
  onDelete,
  onView,
}: InboxItemProps) {
  const statusInfo = statusConfig[status];
  const StatusIcon = statusInfo.icon;

  const handleReplyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(
      `mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject || 'Your message')}`,
      '_blank'
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'group p-4 border-b border-dark-700 hover:bg-dark-800/50 transition-colors cursor-pointer',
        isSelected && 'bg-primary-500/10',
        status === 'new' && 'bg-dark-800/30'
      )}
      onClick={() => onView?.(message)}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        {onSelect && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelect(message.id);
            }}
            className="pt-1"
          >
            <div
              className={cn(
                'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                isSelected
                  ? 'bg-primary-500 border-primary-500'
                  : 'border-dark-500 hover:border-primary-500'
              )}
            >
              {isSelected && <Check className="h-3 w-3 text-white" />}
            </div>
          </div>
        )}

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold">
            {message.name.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white truncate">
              {message.name}
            </span>
            <Badge
              variant={statusInfo.color}
              size="sm"
              className="flex items-center gap-1"
            >
              <StatusIcon className="h-3 w-3" />
              {statusInfo.label}
            </Badge>
          </div>

          <h4 className="text-sm font-medium text-dark-200 truncate mb-1">
            {message.subject || '(No subject)'}
          </h4>

          <p className="text-sm text-dark-400 line-clamp-1">
            {message.message}
          </p>

          <div className="flex items-center gap-4 mt-2 text-xs text-dark-500">
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {message.email}
            </span>
          </div>
        </div>

        {/* Meta & Actions */}
        <div className="flex flex-col items-end gap-2">
          <span className="text-xs text-dark-500">
            {formatRelativeDate(message.created_at, 'en')}
          </span>

          <div
            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleReplyEmail}
              className="p-1.5 rounded hover:bg-dark-700 transition-colors"
              title="Reply via Email"
            >
              <Mail className="h-4 w-4 text-dark-400 hover:text-primary-400" />
            </button>
            <Dropdown
              trigger={
                <button className="p-1.5 rounded hover:bg-dark-700 transition-colors">
                  <MoreHorizontal className="h-4 w-4 text-dark-400" />
                </button>
              }
              align="end"
            >
              <DropdownItem
                icon={<Eye className="h-4 w-4" />}
                onClick={() => onStatusChange?.(message.id, 'read')}
              >
                Mark as Read
              </DropdownItem>
              <DropdownItem
                icon={<Check className="h-4 w-4" />}
                onClick={() => onStatusChange?.(message.id, 'replied')}
              >
                Mark as Replied
              </DropdownItem>
              <DropdownItem
                icon={<Archive className="h-4 w-4" />}
                onClick={() => onStatusChange?.(message.id, 'archived')}
              >
                Archive
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem
                icon={<Trash2 className="h-4 w-4" />}
                danger
                onClick={() => onDelete?.(message.id)}
              >
                Delete
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
