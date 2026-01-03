// src/app/admin/(dashboard)/inbox/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database, ContactMessage, MessageStatus } from '@/lib/supabase/types';
import { 
  Mail, 
  Archive, 
  Trash2, 
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  Clock,
  MessageSquare,
  AlertCircle,
  Eye,
  Reply,
  MoreVertical,
  Phone,
  ExternalLink,
  Download,
  X
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS, de } from 'date-fns/locale';

// Status configuration
const statusConfig: Record<MessageStatus, { label: string; color: string; icon: React.ElementType }> = {
  new: { label: 'جديد', color: 'bg-blue-500', icon: Mail },
  in_progress: { label: 'قيد المتابعة', color: 'bg-yellow-500', icon: Clock },
  replied: { label: 'تم الرد', color: 'bg-green-500', icon: CheckCircle },
  archived: { label: 'مؤرشف', color: 'bg-gray-500', icon: Archive },
  spam: { label: 'بريد مزعج', color: 'bg-red-500', icon: AlertCircle },
};

export default function InboxPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<MessageStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const supabase = createClientComponentClient<Database>();

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,subject.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase, statusFilter, searchQuery]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Update message status ⭐ هذه الدالة المعدلة
  const updateMessageStatus = async (id: string, status: MessageStatus) => {
    try {
      const updateData: Database['public']['Tables']['contact_messages']['Update'] = {
        status,
        ...(status === 'replied' ? { replied_at: new Date().toISOString() } : {})
      };

      const { error } = await supabase
        .from('contact_messages')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setMessages(prev =>
        prev.map(msg =>
          msg.id === id ? { ...msg, ...updateData } : msg
        )
      );

      if (selectedMessage?.id === id) {
        setSelectedMessage(prev => prev ? { ...prev, ...updateData } : null);
      }
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  // Delete message
  const deleteMessage = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessages(prev => prev.filter(msg => msg.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  // Get counts by status
  const getCounts = () => {
    const counts: Record<MessageStatus | 'all', number> = {
      all: messages.length,
      new: 0,
      in_progress: 0,
      replied: 0,
      archived: 0,
      spam: 0,
    };

    messages.forEach(msg => {
      counts[msg.status]++;
    });

    return counts;
  };

  const counts = getCounts();

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Sidebar - Messages List */}
      <div className="w-96 border-l border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              صندوق الوارد
            </h1>
            <button
              onClick={fetchMessages}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="بحث في الرسائل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600"
          >
            <Filter className="w-4 h-4" />
            فلترة حسب الحالة
          </button>

          {/* Filters */}
          {showFilters && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                الكل ({counts.all})
              </button>
              {(Object.keys(statusConfig) as MessageStatus[]).map((status) => {
                const config = statusConfig[status];
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      statusFilter === status
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {config.label} ({counts[status]})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <Mail className="w-8 h-8 mb-2" />
              <p>لا توجد رسائل</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                onClick={() => setSelectedMessage(message)}
                className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-colors ${
                  selectedMessage?.id === message.id
                    ? 'bg-primary-50 dark:bg-primary-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                } ${message.status === 'new' ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${statusConfig[message.status].color}`} />
                    <span className="font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
                      {message.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(message.created_at), {
                      addSuffix: true,
                      locale: ar,
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-1">
                  {message.subject}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {message.message.substring(0, 80)}...
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Detail */}
      <div className="flex-1 bg-gray-50 dark:bg-gray-800">
        {selectedMessage ? (
          <div className="h-full flex flex-col">
            {/* Message Header */}
            <div className="p-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedMessage.subject}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {selectedMessage.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {selectedMessage.whatsapp}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs text-white ${statusConfig[selectedMessage.status].color}`}>
                      {statusConfig[selectedMessage.status].label}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedMessage.status}
                    onChange={(e) => updateMessageStatus(selectedMessage.id, e.target.value as MessageStatus)}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800"
                  >
                    {(Object.keys(statusConfig) as MessageStatus[]).map((status) => (
                      <option key={status} value={status}>
                        {statusConfig[status].label}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Message Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-primary-600">
                      {selectedMessage.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {selectedMessage.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedMessage.created_at).toLocaleString('ar-EG')}
                    </p>
                  </div>
                </div>

                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Attachment */}
                {selectedMessage.attachment_url && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      مرفقات
                    </h4>
                    <a
                      href={selectedMessage.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>{selectedMessage.attachment_name || 'تحميل المرفق'}</span>
                    </a>
                  </div>
                )}

                {/* Contact Preference */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500">
                    طريقة التواصل المفضلة:{' '}
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {selectedMessage.preferred_contact === 'email' ? 'البريد الإلكتروني' : 'واتساب'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Quick Reply Buttons */}
              <div className="mt-6 flex gap-3">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                >
                  <Reply className="w-5 h-5" />
                  الرد عبر البريد
                </a>
                <a
                  href={`https://wa.me/${selectedMessage.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  الرد عبر واتساب
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <Mail className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg">اختر رسالة للعرض</p>
          </div>
        )}
      </div>
    </div>
  );
}
