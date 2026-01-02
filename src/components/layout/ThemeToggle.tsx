// ============================================
// Theme Toggle Component
// ============================================

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { useTheme } from '@/lib/hooks/useTheme';
import { useLocale } from '@/lib/hooks/useLocale';

export function ThemeToggle() {
  const { theme, setTheme, isDark } = useTheme();
  const { isRTL } = useLocale();
  const [showMenu, setShowMenu] = useState(false);

  const themes = [
    { key: 'light', icon: Sun, label: isRTL ? 'فاتح' : 'Light' },
    { key: 'dark', icon: Moon, label: isRTL ? 'داكن' : 'Dark' },
    { key: 'system', icon: Monitor, label: isRTL ? 'تلقائي' : 'System' },
  ] as const;

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="h-5 w-5 text-primary-400" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="h-5 w-5 text-amber-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Theme Menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={cn(
                'absolute top-full mt-2 z-50 py-1 min-w-[140px] rounded-lg',
                'bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700',
                'shadow-xl',
                isRTL ? 'left-0' : 'right-0'
              )}
            >
              {themes.map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => {
                    setTheme(key);
                    setShowMenu(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors',
                    theme === key
                      ? 'bg-primary-500/10 text-primary-500'
                      : 'text-foreground hover:bg-dark-100 dark:hover:bg-dark-700'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple toggle version (just dark/light)
export function SimpleThemeToggle() {
  const { toggleTheme, isDark } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-5 w-5 text-primary-400" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-5 w-5 text-amber-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}