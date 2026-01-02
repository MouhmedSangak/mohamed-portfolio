// ============================================
// Inbox Item Component
// ============================================

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MessageCircle,
  Calendar,
  Paperclip,
  ExternalLink,
  Reply,
  Archive,
  Trash2,
  MoreHorizontal,
  Check,
  Clock,
  AlertCircle,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui/Dropdown';
import { formatRelativeDate, formatDate } from '@/lib/utils/formatDate';
import type { ContactMessage } from '@/types/database';

interface InboxItemProps {
  message: ContactMessage;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onStatusChange?: (id: string, status: ContactMessage['status']) => void;
  onDelete?: (id: string) => void;
  onView?: (message: ContactMessage) => void;
}

const statusConfig = {
  new: { label: 'New', color: 'info', icon: AlertCircle },
  in_progress: { label: 'In Progress', color: 'warning', icon: Clock },
  replied: { label: 'Replied', color: 'success', icon: Check },
  archived: { label: 'Archived', color: 'secondary', icon: Archive },
  spam: { label: 'Spam', color: 'danger', icon: Trash2 },
} as const;

export function InboxItem({
  message,
  isSelected,
  onSelect,
  onStatusChange,
  onDelete,
  onView,
}: InboxItemProps) {
  const [showDetail, setShowDetail] = useState(false);
  const status = statusConfig[message.status];
  const StatusIcon = status.icon;

  const handleReplyEmail = () => {
    window.open(
      `mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`,
      '_blank'
    );
  };

  const handleReplyWhatsApp = () => {
    const text = encodeURIComponent(`Hi ${message.name},\n\nRegarding your message: "${message.subject}"\n\n`);
    const phone = message.whatsapp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'group p-4 border-b border-dark-700 hover:bg-dark-800/50 transition-colors cursor-pointer',
          isSelected && 'bg-primary-500/10',
          message.status === 'new' && 'bg-dark-800/30'
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
                variant={status.color as any}
                size="sm"
                className="flex items-center gap-1"
              >
                <StatusIcon className="h-3 w-3" />
                {status.label}
              </Badge>
              {message.attachment_url && (
                <Paperclip className="h-4 w-4 text-dark-400" />
              )}
            </div>

            <h4 className="text-sm font-medium text-dark-200 truncate mb-1">
              {message.subject}
            </h4>

            <p className="text-sm text-dark-400 line-clamp-1">
              {message.message}
            </p>

            <div className="flex items-center gap-4 mt-2 text-xs text-dark-500">
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {message.email}
              </span>
              <span className="flex items-center gap-1">
                {message.preferred_contact === 'whatsapp' ? (
                  <MessageCircle className="h-3 w-3" />
                ) : (
                  <Mail className="h-3 w-3" />
                )}
                Prefers {message.preferred_contact}
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
              <button
                onClick={handleReplyWhatsApp}
                className="p-1.5 rounded hover:bg-dark-700 transition-colors"
                title="Reply via WhatsApp"
              >
                <MessageCircle className="h-4 w-4 text-dark-400 hover:text-green-400" />
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
                  icon={<Check className="h-4 w-4" />}
                  onClick={() => onStatusChange?.(message.id, 'replied')}
                >
                  Mark as Replied
                </DropdownItem>
                <DropdownItem
                  icon={<Clock className="h-4 w-4" />}
                  onClick={() => onStatusChange?.(message.id, 'in_progress')}
                >
                  Mark In Progress
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

      {/* Detail Modal */}
      <Modal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        title={message.subject}
        size="lg"
      >
        <div className="space-y-6">
          {/* Sender Info */}
          <div className="flex items-center gap-4 p-4 bg-dark-800 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                {message.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-white">{message.name}</h3>
              <p className="text-sm text-dark-400">{message.email}</p>
            </div>
            <Badge variant={status.color as any} className="ml-auto">
              {status.label}
            </Badge>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-dark-800 rounded-lg">
              <p className="text-xs text-dark-400 mb-1">WhatsApp</p>
              <p className="text-white">{message.whatsapp}</p>
            </div>
            <div className="p-3 bg-dark-800 rounded-lg">
              <p className="text-xs text-dark-400 mb-1">Preferred Contact</p>
              <p className="text-white capitalize">{message.preferred_contact}</p>
            </div>
          </div>

          {/* Message */}
          <div>
            <p className="text-xs text-dark-400 mb-2">Message</p>
            <div className="p-4 bg-dark-800 rounded-lg">
              <p className="text-dark-200 whitespace-pre-wrap">{message.message}</p>
            </div>
          </div>

          {/* Attachment */}
          {message.attachment_url && (
            <div>
              <p className="text-xs text-dark-400 mb-2">Attachment</p>
              <a
                href={message.attachment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors"
              >
                <Paperclip className="h-4 w-4" />
                <span>{message.attachment_name || 'Download Attachment'}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center justify-between text-sm text-dark-400 pt-4 border-t border-dark-700">
            <span>Received: {formatDate(message.created_at, 'PPpp', 'en')}</span>
            {message.replied_at && (
              <span>Replied: {formatDate(message.replied_at, 'PPpp', 'en')}</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-dark-700">
            <Button onClick={handleReplyEmail} leftIcon={<Mail className="h-4 w-4" />}>
              Reply via Email
            </Button>
            <Button
              variant="secondary"
              onClick={handleReplyWhatsApp}
              leftIcon={<MessageCircle className="h-4 w-4" />}
            >
              Reply via WhatsApp
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}