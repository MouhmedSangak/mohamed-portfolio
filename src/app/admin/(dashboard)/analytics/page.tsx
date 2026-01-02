// ============================================
// Admin Analytics Page
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useToastActions } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatsCard } from '@/components/admin/StatsCard';
import { Select } from '@/components/ui/Dropdown';
import { cn } from '@/lib/utils/cn';
import type { AnalyticsEvent } from '@/types/database';

interface AnalyticsData {
  date: string;
  visitors: number;
  pageviews: number;
}

interface DeviceStats {
  mobile: number;
  tablet: number;
  desktop: number;
}

interface PageStats {
  path: string;
  views: number;
}

interface BrowserStats {
  browser: string;
  count: number;
}

interface Stats {
  totalVisitors: number;
  totalPageviews: number;
  avgSessionDuration: number;
  bounceRate: number;
}

export default function AnalyticsPage() {
  const supabase = getSupabaseClient();
  const toast = useToastActions();

  const [period, setPeriod] = useState('7');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalVisitors: 0,
    totalPageviews: 0,
    avgSessionDuration: 0,
    bounceRate: 0,
  });
  const [dailyData, setDailyData] = useState<AnalyticsData[]>([]);
  const [deviceStats, setDeviceStats] = useState<DeviceStats>({ mobile: 0, tablet: 0, desktop: 0 });
  const [topPages, setTopPages] = useState<PageStats[]>([]);
  const [browserStats, setBrowserStats] = useState<BrowserStats[]>([]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const days = parseInt(period);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Fetch all events in period
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .eq('event_type', 'pageview');

      if (error) throw error;

      // Type assertion للبيانات
      const events: AnalyticsEvent[] = (data || []) as AnalyticsEvent[];

      if (events.length === 0) {
        setDailyData([]);
        setStats({ totalVisitors: 0, totalPageviews: 0, avgSessionDuration: 0, bounceRate: 0 });
        setDeviceStats({ mobile: 0, tablet: 0, desktop: 0 });
        setTopPages([]);
        setBrowserStats([]);
        setIsLoading(false);
        return;
      }

      // Calculate daily data
      const dailyMap: Record<string, { visitors: Set<string>; pageviews: number }> = {};
      const uniqueVisitors = new Set<string>();
      const devices: DeviceStats = { mobile: 0, tablet: 0, desktop: 0 };
      const pages: Record<string, number> = {};
      const browsers: Record<string, number> = {};

      events.forEach((event: AnalyticsEvent) => {
        const date = event.created_at.split('T')[0];
        
        if (!dailyMap[date]) {
          dailyMap[date] = { visitors: new Set(), pageviews: 0 };
        }
        
        dailyMap[date].visitors.add(event.visitor_id);
        dailyMap[date].pageviews++;
        uniqueVisitors.add(event.visitor_id);

        // Device stats
        const deviceType = event.device_type || 'desktop';
        if (deviceType in devices) {
          devices[deviceType as keyof DeviceStats]++;
        }

        // Page stats
        const path = event.page_path || '/';
        pages[path] = (pages[path] || 0) + 1;

        // Browser stats
        const browser = event.browser || 'Unknown';
        browsers[browser] = (browsers[browser] || 0) + 1;
      });

      // Convert to arrays
      const daily: AnalyticsData[] = Object.entries(dailyMap)
        .map(([date, data]) => ({
          date,
          visitors: data.visitors.size,
          pageviews: data.pageviews,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      const topPagesArray: PageStats[] = Object.entries(pages)
        .map(([path, views]) => ({ path, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      const browserArray: BrowserStats[] = Object.entries(browsers)
        .map(([browser, count]) => ({ browser, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setDailyData(daily);
      setStats({
        totalVisitors: uniqueVisitors.size,
        totalPageviews: events.length,
        avgSessionDuration: 0,
        bounceRate: 0,
      });
      setDeviceStats(devices);
      setTopPages(topPagesArray);
      setBrowserStats(browserArray);

    } catch (error) {
      console.error('Analytics error:', error);
      toast.error('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const maxPageviews = Math.max(...dailyData.map((d) => d.pageviews), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-dark-400">
            Track your website performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={period}
            onChange={setPeriod}
            options={[
              { value: '7', label: 'Last 7 days' },
              { value: '14', label: 'Last 14 days' },
              { value: '30', label: 'Last 30 days' },
              { value: '90', label: 'Last 90 days' },
            ]}
          />
          <Button
            variant="secondary"
            onClick={fetchAnalytics}
            leftIcon={<RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Visitors"
          value={stats.totalVisitors}
          icon={Users}
          gradient="from-blue-500 to-cyan-500"
          isLoading={isLoading}
        />
        <StatsCard
          title="Page Views"
          value={stats.totalPageviews}
          icon={Eye}
          gradient="from-purple-500 to-pink-500"
          isLoading={isLoading}
        />
        <StatsCard
          title="Avg. Pages/Visit"
          value={stats.totalVisitors > 0 
            ? (stats.totalPageviews / stats.totalVisitors).toFixed(1) 
            : '0'}
          icon={TrendingUp}
          gradient="from-green-500 to-emerald-500"
          isLoading={isLoading}
        />
        <StatsCard
          title="Period"
          value={`${period} days`}
          icon={Calendar}
          gradient="from-amber-500 to-orange-500"
          isLoading={isLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Daily Chart */}
        <Card variant="bordered" padding="lg" className="lg:col-span-2 bg-dark-900 border-dark-700">
          <h2 className="text-lg font-semibold text-white mb-6">Daily Traffic</h2>
          
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent" />
            </div>
          ) : dailyData.length > 0 ? (
            <div className="h-64 flex items-end gap-1">
              {dailyData.map((day, index) => (
                <motion.div
                  key={day.date}
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.pageviews / maxPageviews) * 100}%` }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className="flex-1 bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-sm min-h-[4px] relative group"
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-dark-700 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {day.date}: {day.pageviews} views, {day.visitors} visitors
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-dark-400">
              No data available for this period
            </div>
          )}

          <div className="flex justify-between mt-4 text-xs text-dark-400">
            <span>{dailyData[0]?.date || '-'}</span>
            <span>{dailyData[dailyData.length - 1]?.date || '-'}</span>
          </div>
        </Card>

        {/* Device Stats */}
        <Card variant="bordered" padding="lg" className="bg-dark-900 border-dark-700">
          <h2 className="text-lg font-semibold text-white mb-6">Devices</h2>
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-dark-700 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { key: 'desktop', label: 'Desktop', icon: Monitor, color: 'from-blue-500 to-cyan-500' },
                { key: 'mobile', label: 'Mobile', icon: Smartphone, color: 'from-green-500 to-emerald-500' },
                { key: 'tablet', label: 'Tablet', icon: Tablet, color: 'from-purple-500 to-pink-500' },
              ].map(({ key, label, icon: Icon, color }) => {
                const count = deviceStats[key as keyof DeviceStats];
                const total = Object.values(deviceStats).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

                return (
                  <div key={key} className="flex items-center gap-3">
                    <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center', color)}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-white">{label}</span>
                        <span className="text-sm text-dark-400">{percentage}%</span>
                      </div>
                      <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          className={cn('h-full rounded-full bg-gradient-to-r', color)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card variant="bordered" padding="lg" className="bg-dark-900 border-dark-700">
          <h2 className="text-lg font-semibold text-white mb-4">Top Pages</h2>
          
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 bg-dark-700 rounded animate-pulse" />
              ))}
            </div>
          ) : topPages.length > 0 ? (
            <div className="space-y-3">
              {topPages.map((page, index) => (
                <div key={page.path} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-dark-700 flex items-center justify-center text-xs text-dark-400">
                      {index + 1}
                    </span>
                    <span className="text-sm text-white truncate max-w-[200px]">
                      {page.path}
                    </span>
                  </div>
                  <Badge variant="secondary">{page.views} views</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-dark-400 text-center py-8">No page data available</p>
          )}
        </Card>

        {/* Browsers */}
        <Card variant="bordered" padding="lg" className="bg-dark-900 border-dark-700">
          <h2 className="text-lg font-semibold text-white mb-4">Browsers</h2>
          
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 bg-dark-700 rounded animate-pulse" />
              ))}
            </div>
          ) : browserStats.length > 0 ? (
            <div className="space-y-3">
              {browserStats.map((browser) => {
                const total = browserStats.reduce((a, b) => a + b.count, 0);
                const percentage = Math.round((browser.count / total) * 100);

                return (
                  <div key={browser.browser}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-white">{browser.browser}</span>
                      <span className="text-sm text-dark-400">{percentage}%</span>
                    </div>
                    <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className="h-full rounded-full bg-primary-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-dark-400 text-center py-8">No browser data available</p>
          )}
        </Card>
      </div>
    </div>
  );
}
