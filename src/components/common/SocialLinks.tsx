// ============================================
// Social Links Component
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Github, 
  Twitter,
  Send,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { SocialLink } from '@/types/database';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  email: Mail,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  github: Github,
  twitter: Twitter,
  telegram: Send,
  whatsapp: MessageCircle,
};

interface SocialLinksProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
}

export function SocialLinks({ 
  className, 
  size = 'md',
  showLabels = false,
  variant = 'default'
}: SocialLinksProps) {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const supabase = getSupabaseClient();

  useEffect(() => {
    const fetchLinks = async () => {
      const { data } = await supabase
        .from('social_links')
        .select('*')
        .eq('is_visible', true)
        .order('display_order');
      
      if (data) {
        setLinks(data);
      }
    };

    fetchLinks();
  }, [supabase]);

  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const variants = {
    default: 'bg-dark-100 dark:bg-dark-800 hover:bg-primary-500 hover:text-white',
    outline: 'border-2 border-dark-300 dark:border-dark-600 hover:border-primary-500 hover:text-primary-500',
    ghost: 'hover:bg-dark-100 dark:hover:bg-dark-800 hover:text-primary-500',
  };

  if (links.length === 0) {
    // Default links if not loaded
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {[
          { platform: 'email', url: 'mailto:mahmedsangak07@gmail.com' },
          { platform: 'facebook', url: 'https://web.facebook.com/MSANGAK27' },
          { platform: 'instagram', url: 'https://www.instagram.com/msangak27/' },
        ].map((link, index) => {
          const Icon = iconMap[link.platform] || ExternalLink;
          return (
            <motion.a
              key={link.platform}
              href={link.url}
              target={link.platform !== 'email' ? '_blank' : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'rounded-lg flex items-center justify-center transition-all duration-200',
                sizes[size],
                variants[variant]
              )}
            >
              <Icon className={iconSizes[size]} />
            </motion.a>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      {links.map((link, index) => {
        const Icon = iconMap[link.platform] || ExternalLink;
        const isEmail = link.platform === 'email';
        
        return (
          <motion.a
            key={link.id}
            href={link.url}
            target={!isEmail ? '_blank' : undefined}
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'rounded-lg flex items-center justify-center gap-2 transition-all duration-200',
              showLabels ? 'px-4 py-2' : sizes[size],
              variants[variant]
            )}
            title={link.platform}
          >
            <Icon className={iconSizes[size]} />
            {showLabels && (
              <span className="text-sm font-medium capitalize">
                {link.platform}
              </span>
            )}
          </motion.a>
        );
      })}
    </div>
  );
}