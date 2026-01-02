// ============================================
// Language Suggestion Toast
// ============================================

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe } from 'lucide-react';
import { useLocale } from '@/lib/hooks/useLocale';
import { cn } from '@/lib/utils/cn';

export function LanguageToast() {
  const {
    locale,
    isRTL,
    showSuggestion,
    suggestedLocale,
    suggestedLocaleName,
    dismissSuggestion,
    acceptSuggestion,
    localeFlags,
  } = useLocale();

  if (!showSuggestion || !suggestedLocale) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className={cn(
          'fixed bottom-24 z-50 mx-4',
          isRTL ? 'left-4' : 'right-4'
        )}
      >
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-dark-200 dark:border-dark-700 p-4 max-w-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0">
              <Globe className="h-5 w-5 text-primary-500" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground font-medium mb-1">
                {isRTL
                  ? 'هل تريد تغيير اللغة؟'
                  : 'Switch language?'}
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                {isRTL
                  ? `يبدو أنك تفضل ${suggestedLocaleName}`
                  : `It looks like you prefer ${suggestedLocaleName}`}
              </p>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={acceptSuggestion}
                  className="flex items-center gap-2 px-3 py-1.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
                >
                  <span>{localeFlags[suggestedLocale]}</span>
                  <span>{suggestedLocaleName}</span>
                </button>
                
                <button
                  onClick={dismissSuggestion}
                  className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isRTL ? 'لا، شكراً' : 'No, thanks'}
                </button>
              </div>
            </div>
            
            <button
              onClick={dismissSuggestion}
              className="p-1 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors flex-shrink-0"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}