// ============================================
// Language Switcher Component
// ============================================

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useLocale } from '@/lib/hooks/useLocale';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, isRTL, switchLocale } = useLocale();

  const handleSelect = (newLocale: Locale) => {
    if (newLocale !== locale) {
      switchLocale(newLocale);
    }
    setIsOpen(false);
  };

  return (
    <div
      className={cn(
        'fixed bottom-6 z-50',
        isRTL ? 'left-6' : 'right-6'
      )}
    >
      <div className="relative">
        {/* Language Options */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full mb-2 bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-dark-200 dark:border-dark-700 overflow-hidden min-w-[160px]"
            >
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleSelect(loc)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors',
                    locale === loc
                      ? 'bg-primary-500/10 text-primary-500'
                      : 'text-foreground hover:bg-dark-100 dark:hover:bg-dark-700'
                  )}
                >
                  <span className="text-xl">{localeFlags[loc]}</span>
                  <span className="font-medium">{localeNames[loc]}</span>
                  {locale === loc && (
                    <Check className="h-4 w-4 ms-auto" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center gap-2 px-4 py-3 rounded-full',
            'bg-white dark:bg-dark-800 shadow-lg border border-dark-200 dark:border-dark-700',
            'text-foreground hover:border-primary-500 transition-all duration-200'
          )}
        >
          <span className="text-xl">{localeFlags[locale]}</span>
          <span className="text-sm font-medium hidden sm:block">
            {localeNames[locale]}
          </span>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </motion.button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}