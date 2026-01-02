// ============================================
// Footer Component
// ============================================

'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Heart, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { useLocale } from '@/lib/hooks/useLocale';
import { getCurrentYear } from '@/lib/utils/formatDate';
import { SocialLinks } from '../common/SocialLinks';

const quickLinks = [
  { key: 'home', href: '' },
  { key: 'about', href: '/about' },
  { key: 'projects', href: '/projects' },
  { key: 'contact', href: '/contact' },
];

export function Footer() {
  const t = useTranslations();
  const { locale, isRTL } = useLocale();
  const currentYear = getCurrentYear();

  return (
    <footer className="relative bg-dark-50 dark:bg-dark-900 border-t border-dark-200 dark:border-dark-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />

      <div className="relative container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">م</span>
              </div>
              <span className="font-bold text-xl text-foreground">
                {isRTL ? 'محمد سنجق' : 'Mohamed Sangak'}
              </span>
            </Link>
            <p className="text-muted-foreground max-w-md mb-6">
              {isRTL
                ? 'طالب طب بشري في جامعة سوهاج، مصر. شغوف بالتكنولوجيا والبرمجة إلى جانب دراستي الطبية.'
                : 'Medical student at Sohag University, Egypt. Passionate about technology and programming alongside my medical studies.'}
            </p>
            <SocialLinks />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="text-muted-foreground hover:text-primary-500 transition-colors duration-200 inline-flex items-center gap-1"
                  >
                    {t(`nav.${link.key}`)}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={`/${locale}/privacy`}
                  className="text-muted-foreground hover:text-primary-500 transition-colors duration-200"
                >
                  {t('privacy.title')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              {t('footer.connect')}
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a
                  href="mailto:mahmedsangak07@gmail.com"
                  className="hover:text-primary-500 transition-colors duration-200"
                >
                  mahmedsangak07@gmail.com
                </a>
              </li>
              <li>{isRTL ? 'مصر، سوهاج' : 'Sohag, Egypt'}</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-dark-200 dark:border-dark-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground text-center md:text-start">
              © {currentYear}{' '}
              <span className="text-foreground font-medium">
                {isRTL ? 'محمد سيد سنجق' : 'Mohamed Sayed Sangak'}
              </span>
              . {t('footer.allRightsReserved')}
            </p>

            {/* Designed By */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground flex items-center gap-1"
            >
              {isRTL ? 'مصمم بواسطة' : 'Designed by'}
              <Heart className="h-4 w-4 text-red-500 mx-1" />
              <a
                href="https://web.facebook.com/MSANGAK27"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:text-primary-600 font-medium inline-flex items-center gap-1 transition-colors"
              >
                {isRTL ? 'محمد' : 'Mohamed'}
                <ExternalLink className="h-3 w-3" />
              </a>
            </motion.p>
          </div>
        </div>
      </div>
    </footer>
  );
}