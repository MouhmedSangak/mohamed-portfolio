// ============================================
// Admin Inbox Page
// ============================================

'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Inbox,
  Search,
  Filter,
  RefreshCw,
  Trash2,
  Archive,
  Check,
  MailOpen,
} from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useToastActions } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { InboxItem } from '@/components/admin/InboxItem';
import { cn } from '@/lib/utils/cn';
import type { ContactMessage } from '@/types/database';

type FilterStatus = 'all' | ContactMessage['status'];

const filterTabs: { key: FilterStatus; label: string; icon?: React.ReactNode }[] = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New', icon: <span className="w-2 h-2 rounded-full bg-blue-500" /> },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'replied', label: 'Replied' },
  { key: 'archived', label: 'Archived' },
  { key: 'spam', label: 'Spam' },
];

export default function InboxPage() {
  const supabase = getSupabaseClient();
  const toast = useToastActions();
  
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, [supabase, filterStatus, toast]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Filter by search
  const filteredMessages = searchQuery
    ? messages.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.subject.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  // Count by status
  const statusCounts = messages.reduce((acc, m) => {
    acc[m.status] = (acc[m.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Handle status change
  const handleStatusChange = async (id: string, status: ContactMessage['status']) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ 
          status,
          ...(status === 'replied' ? { replied_at: new Date().toISOString() } : {})
        })
        .eq('id', id);

      if (error) throw error;

      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m))
      );
      toast.success('Status updated');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update status');
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessages((prev) => prev.filter((m) => m.id !== id));
      setDeleteConfirm(null);
      toast.success('Message deleted');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete message');
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: 'archive' | 'delete' | 'mark_read') => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    try {
      if (action === 'delete') {
        const { error } = await supabase
          .from('contact_messages')
          .delete()
          .in('id', ids);
        
        if (error) throw error;
        setMessages((prev) => prev.filter((m) => !ids.includes(m.id)));
      } else {
        const status = action === 'archive' ? 'archived' : 'replied';
        const { error } = await supabase
          .from('contact_messages')
          .update({ status })
          .in('id', ids);
        
        if (error) throw error;
        setMessages((prev) =>
          prev.map((m) => (ids.includes(m.id) ? { ...m, status } : m))
        );
      }

      setSelectedIds(new Set());
      toast.success(`${ids.length} messages updated`);
    } catch (error) {
      console.error('Bulk action error:', error);
      toast.error('Failed to perform action');
    }
  };

  // Toggle selection
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Inbox</h1>
          <p className="text-dark-400">
            Manage contact form submissions
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={fetchMessages}
          leftIcon={<RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />}
        >
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or subject..."
            className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder:text-dark-400 focus:border-primary-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 p-1 bg-dark-800 rounded-lg overflow-x-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors',
                filterStatus === tab.key
                  ? 'bg-primary-500 text-white'
                  : 'text-dark-300 hover:text-white hover:bg-dark-700'
              )}
            >
              {tab.icon}
              {tab.label}
              {tab.key !== 'all' && statusCounts[tab.key] > 0 && (
                <span className="px-1.5 py-0.5 text-xs rounded-full bg-dark-600">
                  {statusCounts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg"
        >
          <span className="text-sm text-primary-400">
            {selectedIds.size} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleBulkAction('mark_read')}
              leftIcon={<Check className="h-4 w-4" />}
            >
              Mark Replied
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleBulkAction('archive')}
              leftIcon={<Archive className="h-4 w-4" />}
            >
              Archive
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleBulkAction('delete')}
              leftIcon={<Trash2 className="h-4 w-4" />}
            >
              Delete
            </Button>
          </div>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="ml-auto text-sm text-dark-400 hover:text-white"
          >
            Clear selection
          </button>
        </motion.div>
      )}

      {/* Messages List */}
      <div className="bg-dark-900 rounded-xl border border-dark-700 overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-dark-700">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-dark-700" />
                  <div className="flex-1">
                    <div className="h-4 bg-dark-700 rounded w-1/4 mb-2" />
                    <div className="h-3 bg-dark-700 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-dark-700 rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredMessages.length > 0 ? (
          <div className="divide-y divide-dark-700">
            {filteredMessages.map((message) => (
              <InboxItem
                key={message.id}
                message={message}
                isSelected={selectedIds.has(message.id)}
                onSelect={toggleSelect}
                onStatusChange={handleStatusChange}
                onDelete={(id) => setDeleteConfirm(id)}
                onView={setSelectedMessage}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Inbox className="h-12 w-12 text-dark-500 mx-auto mb-4" />
            <p className="text-dark-400">
              {searchQuery
                ? 'No messages match your search'
                : 'No messages in this folder'}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}