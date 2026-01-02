// ============================================
// Admin Header Component
// ============================================

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Menu,
  Bell,
  Search,
  Moon,
  Sun,
  ExternalLink,
  Settings,
  LogOut,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useAuth } from '@/lib/hooks/useAuth';
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui/Dropdown';
import type { Admin } from '@/types/database';

interface AdminHeaderProps {
  admin: Admin;
  onMenuClick: () => void;
}

export function AdminHeader({ admin, onMenuClick }: AdminHeaderProps) {
  const { signOut } = useAuth();
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-dark-900/80 backdrop-blur-lg border-b border-dark-700 flex items-center justify-between px-6">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-dark-800 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-800 border border-dark-700 focus-within:border-primary-500 transition-colors">
          <Search className="h-4 w-4 text-dark-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm text-white placeholder:text-dark-400 w-48 lg:w-64"
          />
          <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-dark-400 bg-dark-700 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        {/* View Site */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-dark-300 hover:text-white rounded-lg hover:bg-dark-800 transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          <span>View Site</span>
        </a>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-dark-800 transition-colors"
        >
          {isDark ? (
            <Moon className="h-5 w-5 text-dark-300" />
          ) : (
            <Sun className="h-5 w-5 text-amber-400" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-dark-800 transition-colors">
          <Bell className="h-5 w-5 text-dark-300" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
        </button>

        {/* User Menu */}
        <Dropdown
          trigger={
            <button className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-dark-800 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {admin.display_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white">
                  {admin.display_name}
                </p>
                <p className="text-xs text-dark-400 capitalize">{admin.role}</p>
              </div>
            </button>
          }
        >
          <div className="px-4 py-3 border-b border-dark-700">
            <p className="text-sm font-medium text-white">{admin.display_name}</p>
            <p className="text-xs text-dark-400">{admin.email}</p>
          </div>
          <DropdownItem icon={<User className="h-4 w-4" />}>
            Profile
          </DropdownItem>
          <DropdownItem icon={<Settings className="h-4 w-4" />}>
            Settings
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem
            icon={<LogOut className="h-4 w-4" />}
            danger
            onClick={signOut}
          >
            Sign Out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}