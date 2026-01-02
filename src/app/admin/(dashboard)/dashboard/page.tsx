// ============================================
// Admin Dashboard Page
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Eye, 
  Mail, 
  FolderOpen, 
  BookOpen,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/hooks/useAuth';
import { StatsCard } from '@/components/admin/StatsCard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatRelativeDate } from '@/lib/utils/formatDate';

interface DashboardStats {
  totalVisitors: number;
  todayVisitors: number;
  totalPageviews: number;
  newMessages: number;
  totalProjects: number;
  totalBlogPosts: number;
  visitorChange: number;
}

interface RecentMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  status: string;
  created_at: string;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  created_at: string;
}

export default function DashboardPage() {
  const { admin } = useAuth();
  const supabase = getSupabaseClient();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch statistics
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Total unique visitors
        const { data: allVisitors } = await supabase
          .from('analytics_events')
          .select('visitor_id')
          .eq('event_type', 'pageview');
        
        const uniqueVisitors = new Set(allVisitors?.map(v => v.visitor_id)).size;

        // Today's visitors
        const { data: todayVisitors } = await supabase
          .from('analytics_events')
          .select('visitor_id')
          .eq('event_type', 'pageview')
          .gte('created_at', today.toISOString());
        
        const todayUniqueVisitors = new Set(todayVisitors?.map(v => v.visitor_id)).size;

        // Yesterday's visitors for comparison
        const { data: yesterdayVisitors } = await supabase
          .from('analytics_events')
          .select('visitor_id')
          .eq('event_type', 'pageview')
          .gte('created_at', yesterday.toISOString())
          .lt('created_at', today.toISOString());
        
        const yesterdayUniqueVisitors = new Set(yesterdayVisitors?.map(v => v.visitor_id)).size;

        // Total pageviews
        const { count: pageviews } = await supabase
          .from('analytics_events')
          .select('*', { count: 'exact', head: true })
          .eq('event_type', 'pageview');

        // New messages
        const { count: newMessages } = await supabase
          .from('contact_messages')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'new');

        // Total projects
        const { count: projects } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published');

        // Total blog posts
        const { count: blogPosts } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published');

        // Calculate change percentage
        const visitorChange = yesterdayUniqueVisitors > 0
          ? Math.round(((todayUniqueVisitors - yesterdayUniqueVisitors) / yesterdayUniqueVisitors) * 100)
          : todayUniqueVisitors > 0 ? 100 : 0;

        setStats({
          totalVisitors: uniqueVisitors,
          todayVisitors: todayUniqueVisitors,
          totalPageviews: pageviews || 0,
          newMessages: newMessages || 0,
          totalProjects: projects || 0,
          totalBlogPosts: blogPosts || 0,
          visitorChange,
        });

        // Fetch recent messages
        const { data: messages } = await supabase
          .from('contact_messages')
          .select('id, name, email, subject, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        setRecentMessages(messages || []);

      } catch (error) {
        console.error('Dashboard data error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [supabase]);

  const statsCards = [
    {
      title: 'Total Visitors',
      value: stats?.totalVisitors || 0,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      change: stats?.visitorChange,
    },
    {
      title: 'Today Visitors',
      value: stats?.todayVisitors || 0,
      icon: Eye,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Page Views',
      value: stats?.totalPageviews || 0,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'New Messages',
      value: stats?.newMessages || 0,
      icon: Mail,
      color: 'from-amber-500 to-orange-500',
      highlight: (stats?.newMessages || 0) > 0,
    },
    {
      title: 'Projects',
      value: stats?.totalProjects || 0,
      icon: FolderOpen,
      color: 'from-red-500 to-rose-500',
    },
    {
      title: 'Blog Posts',
      value: stats?.totalBlogPosts || 0,
      icon: BookOpen,
      color: 'from-indigo-500 to-violet-500',
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'info' | 'warning' | 'success' | 'danger'> = {
      new: 'info',
      in_progress: 'warning',
      replied: 'success',
      spam: 'danger',
    };
    return variants[status] || 'secondary';
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Welcome back, {admin?.display_name || 'Admin'}! 👋
          </h1>
          <p className="text-dark-400 mt-1">
            Here&apos;s what&apos;s happening with your portfolio today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-dark-400">
          <Clock className="h-4 w-4" />
          <span>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              gradient={stat.color}
              change={stat.change}
              highlight={stat.highlight}
              isLoading={isLoading}
            />
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="bordered" padding="none" className="bg-dark-900 border-dark-700">
            <div className="p-6 border-b border-dark-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Recent Messages</h2>
                <a 
                  href="/admin/inbox" 
                  className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                >
                  View All
                </a>
              </div>
            </div>
            <div className="divide-y divide-dark-700">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 animate-pulse">
                    <div className="h-4 bg-dark-700 rounded w-1/3 mb-2" />
                    <div className="h-3 bg-dark-700 rounded w-2/3" />
                  </div>
                ))
              ) : recentMessages.length > 0 ? (
                recentMessages.map((message) => (
                  <a
                    key={message.id}
                    href={`/admin/inbox?id=${message.id}`}
                    className="block p-4 hover:bg-dark-800/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white truncate">
                            {message.name}
                          </span>
                          <Badge variant={getStatusBadge(message.status)} size="sm">
                            {message.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-dark-400 truncate">
                          {message.subject}
                        </p>
                      </div>
                      <span className="text-xs text-dark-500 whitespace-nowrap">
                        {formatRelativeDate(message.created_at, 'en')}
                      </span>
                    </div>
                  </a>
                ))
              ) : (
                <div className="p-8 text-center text-dark-400">
                  <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No messages yet</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="bordered" padding="lg" className="bg-dark-900 border-dark-700">
            <h2 className="text-lg font-semibold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { href: '/admin/projects/new', label: 'New Project', icon: FolderOpen, color: 'from-blue-500 to-cyan-500' },
                { href: '/admin/blog/new', label: 'New Blog Post', icon: BookOpen, color: 'from-purple-500 to-pink-500' },
                { href: '/admin/inbox', label: 'View Inbox', icon: Mail, color: 'from-amber-500 to-orange-500' },
                { href: '/admin/settings', label: 'Settings', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
              ].map((action) => (
                <a
                  key={action.href}
                  href={action.href}
                  className="group p-4 rounded-xl bg-dark-800 border border-dark-700 hover:border-primary-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/10"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium text-white">{action.label}</span>
                </a>
              ))}
            </div>
          </Card>

          {/* System Status */}
          <Card variant="bordered" padding="lg" className="bg-dark-900 border-dark-700 mt-6">
            <h2 className="text-lg font-semibold text-white mb-4">System Status</h2>
            <div className="space-y-3">
              {[
                { label: 'Database', status: 'Operational', color: 'bg-green-500' },
                { label: 'Storage', status: 'Operational', color: 'bg-green-500' },
                { label: 'Authentication', status: 'Operational', color: 'bg-green-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-dark-300">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-sm text-dark-400">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}