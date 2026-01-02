// ============================================
// Mobile Menu Component
// ============================================

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { 
  Home, 
  User, 
  Briefcase, 
  FolderOpen, 
  BookOpen, 
  Mail,
  ExternalLink 
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useLocale } from '@/lib/hooks/useLocale';
import { SocialLinks } from '../common/SocialLinks';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: { key: string; href: string }[];
}

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  home: Home,
  about: User,
  skills: Briefcase,
  projects: FolderOpen,
  blog: BookOpen,
  contact: Mail,
};

export function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {
  const pathname = usePathname();
  const t = useTranslations('nav');
  const { locale, isRTL } = useLocale();

  const isActive = (href: string) => {
    const fullHref = `/${locale}${href}`;
    if (href === '') {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(fullHref);
  };

  // Menu animation variants
  const menuVariants = {
    closed: {
      x: isRTL ? '100%' : '-100%',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: isRTL ? 20 : -20 },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
      },
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className={cn(
              'fixed top-0 bottom-0 z-40 w-[280px] bg-white dark:bg-dark-900 shadow-2xl lg:hidden',
              'flex flex-col',
              isRTL ? 'right-0' : 'left-0'
            )}
          >
            {/* Header Space */}
            <div className="h-20" />

            {/* Navigation Items */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto">
              <ul className="space-y-2">
                {navItems.map((item, i) => {
                  const Icon = icons[item.key] || Home;
                  return (
                    <motion.li
                      key={item.key}
                      custom={i}
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                    >
                      <Link
                        href={`/${locale}${item.href}`}
                        onClick={onClose}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                          isActive(item.href)
                            ? 'bg-primary-500/10 text-primary-500'
                            : 'text-foreground hover:bg-dark-100 dark:hover:bg-dark-800'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{t(item.key)}</span>
                        {isActive(item.href) && (
                          <motion.div
                            layoutId="mobile-indicator"
                            className={cn(
                              'absolute h-8 w-1 bg-primary-500 rounded-full',
                              isRTL ? 'right-0' : 'left-0'
                            )}
                          />
                        )}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 border-t border-dark-200 dark:border-dark-700"
            >
              <p className="text-sm text-muted-foreground mb-4">
                {isRTL ? 'تواصل معي' : 'Connect with me'}
              </p>
              <SocialLinks size="sm" />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}