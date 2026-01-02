// ============================================
// Hero Section Component
// ============================================

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, MapPin, GraduationCap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { useLocale } from '@/lib/hooks/useLocale';
import { Button } from '@/components/ui/Button';
import { SocialLinks } from '@/components/common/SocialLinks';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Profile } from '@/types/database';

export function Hero() {
  const t = useTranslations('hero');
  const { locale, isRTL } = useLocale();
  const [profile, setProfile] = useState<Profile | null>(null);
  const supabase = getSupabaseClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profile')
        .select('*')
        .eq('is_visible', true)
        .single();
      
      if (data) setProfile(data);
    };

    fetchProfile();
  }, [supabase]);

  const getName = () => {
    if (!profile) return t('name');
    return profile[`name_${locale}` as keyof Profile] as string || profile.name_en;
  };

  const getTitle = () => {
    if (!profile) return t('title');
    return profile[`title_${locale}` as keyof Profile] as string || profile.title_en;
  };

  const getUniversity = () => {
    if (!profile) return '';
    return profile[`university_${locale}` as keyof Profile] as string || profile.university_en;
  };

  const getFaculty = () => {
    if (!profile) return '';
    return profile[`faculty_${locale}` as keyof Profile] as string || profile.faculty_en;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 start-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-1/4 end-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container-custom relative z-10 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
        >
          {/* Content */}
          <div className={cn(
            'flex-1 text-center lg:text-start',
            isRTL && 'lg:text-end'
          )}>
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 text-primary-500 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                {getTitle()}
              </span>
            </motion.div>

            {/* Greeting */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground mb-2"
            >
              {t('greeting')}
            </motion.p>

            {/* Name */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6"
            >
              <span className="gradient-text">{getName()}</span>
            </motion.h1>

            {/* University Info */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8 text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary-500" />
                <span>{getFaculty()}</span>
              </div>
              <span className="hidden sm:block">•</span>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary-500" />
                <span>{getUniversity()}</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8"
            >
              <Link href={`/${locale}/projects`}>
                <Button size="lg" className="w-full sm:w-auto">
                  {t('cta.projects')}
                </Button>
              </Link>
              <Link href={`/${locale}/contact`}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  {t('cta.contact')}
                </Button>
              </Link>
            </motion.div>

            {/* Social Links */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center lg:justify-start"
            >
              <SocialLinks size="lg" variant="ghost" />
            </motion.div>
          </div>

          {/* Profile Image */}
          <motion.div
            variants={itemVariants}
            className="relative flex-shrink-0"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full blur-2xl opacity-20 animate-pulse-glow" />
              
              {/* Image Container */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white/20 dark:border-dark-700 shadow-2xl"
              >
                {profile?.profile_image_url ? (
                  <Image
                    src={profile.profile_image_url}
                    alt={getName()}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <span className="text-7xl md:text-8xl text-white font-bold">
                      {isRTL ? 'م' : 'M'}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -end-4 w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <span className="text-2xl">🩺</span>
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-2 -start-2 w-14 h-14 bg-accent-500 rounded-xl flex items-center justify-center shadow-lg"
              >
                <span className="text-xl">💻</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-sm">{isRTL ? 'اسحب للأسفل' : 'Scroll down'}</span>
            <ArrowDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}