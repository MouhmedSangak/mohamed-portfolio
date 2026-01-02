// ============================================
// Admin Sidebar Component
// ============================================

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Inbox,
  FolderOpen,
  BookOpen,
  Lightbulb,
  Settings,
  Users,
  BarChart3,
  X,
  LogOut,
  Shield,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useAuth } from '@/lib/hooks/useAuth';
import type { Admin } from '@/types/database';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  admin: Admin;
}

const navItems = [
  {
    title: 'Main',
    items: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/inbox', label: 'Inbox', icon: Inbox, badge: 'new' },
      { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Content',
    items: [
      { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
      { href: '/admin/blog', label: 'Blog Posts', icon: BookOpen },
      { href: '/admin/skills', label: 'Skills', icon: Lightbulb },
    ],
  },
  {
    title: 'System',
    items: [
      { href: '/admin/settings', label: 'Settings', icon: Settings },
      { href: '/admin/admins', label: 'Admin Users', icon: Users, ownerOnly: true },
    ],
  },
];

export function AdminSidebar({ isOpen, onClose, admin }: AdminSidebarProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const isActive = (href: string) => pathname === href;
  const isOwner = admin.role === 'owner';

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-dark-700">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg text-white">Admin</span>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-dark-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        {navItems.map((section) => (
          <div key={section.title} className="mb-6">
            <h3 className="px-4 mb-2 text-xs font-semibold text-dark-500 uppercase tracking-wider">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items
                .filter((item) => !item.ownerOnly || isOwner)
                .map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                        isActive(item.href)
                          ? 'bg-primary-500/10 text-primary-400'
                          : 'text-dark-300 hover:text-white hover:bg-dark-800'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-primary-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {isActive(item.href) && (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-dark-700">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-800/50 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <span className="text-white font-semibold">
              {admin.display_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {admin.display_name}
            </p>
            <p className="text-xs text-dark-400 truncate">{admin.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col fixed inset-y-0 left-0 w-64 bg-dark-900 border-r border-dark-700 z-50">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed inset-y-0 left-0 w-64 bg-dark-900 border-r border-dark-700 z-50 flex flex-col"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}