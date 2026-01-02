// ============================================
// About Section Component
// ============================================

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  MapPin, 
  Calendar, 
  Download,
  Award,
  Heart,
  Code,
  Stethoscope
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { useLocale } from '@/lib/hooks/useLocale';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/layout/PageTransition';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Profile } from '@/types/database';

export function AboutSection() {
  const t = useTranslations('about');
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

  const getLocalizedField = (field: string) => {
    if (!profile) return '';
    const key = `${field}_${locale}` as keyof Profile;
    return (profile[key] as string) || (profile[`${field}_en` as keyof Profile] as string) || '';
  };

  const infoItems = [
    {
      icon: GraduationCap,
      label: t('university'),
      value: getLocalizedField('university'),
    },
    {
      icon: Stethoscope,
      label: t('faculty'),
      value: getLocalizedField('faculty'),
    },
    {
      icon: Calendar,
      label: t('year'),
      value: getLocalizedField('year'),
    },
    {
      icon: MapPin,
      label: t('location'),
      value: profile?.country || 'Egypt',
    },
  ];

  const passions = [
    { icon: Stethoscope, label: isRTL ? 'الطب' : 'Medicine', color: 'text-red-500' },
    { icon: Code, label: isRTL ? 'البرمجة' : 'Programming', color: 'text-blue-500' },
    { icon: Heart, label: isRTL ? 'مساعدة الآخرين' : 'Helping Others', color: 'text-pink-500' },
    { icon: Award, label: isRTL ? 'التعلم المستمر' : 'Continuous Learning', color: 'text-amber-500' },
  ];

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent" />

      <div className="container-custom relative">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <AnimatedSection delay={0.2}>
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                {profile?.profile_image_url ? (
                  <Image
                    src={profile.profile_image_url}
                    alt={getLocalizedField('name')}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                    <span className="text-9xl opacity-50">👨‍⚕️</span>
                  </div>
                )}
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent" />
                
                {/* Name Card */}
                <div className="absolute bottom-6 inset-x-6">
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {getLocalizedField('name')}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {getLocalizedField('title')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -z-10 -top-6 -end-6 w-full h-full rounded-2xl border-2 border-primary-500/30" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-4 -start-4 w-20 h-20 border-4 border-dashed border-primary-500/30 rounded-full"
              />
            </div>
          </AnimatedSection>

          {/* Content Side */}
          <div className="space-y-8">
            {/* Bio */}
            <AnimatedSection delay={0.3}>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {getLocalizedField('bio')}
              </p>
            </AnimatedSection>

            {/* Info Grid */}
            <StaggerContainer className="grid grid-cols-2 gap-4">
              {infoItems.map((item) => (
                <StaggerItem key={item.label}>
                  <Card variant="bordered" padding="md" className="h-full">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="h-5 w-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="font-medium text-foreground">{item.value}</p>
                      </div>
                    </div>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Passions */}
            <AnimatedSection delay={0.5}>
              <h4 className="font-semibold text-foreground mb-4">
                {isRTL ? 'اهتماماتي' : 'My Passions'}
              </h4>
              <div className="flex flex-wrap gap-3">
                {passions.map((passion) => (
                  <motion.div
                    key={passion.label}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-dark-100 dark:bg-dark-800"
                  >
                    <passion.icon className={cn('h-4 w-4', passion.color)} />
                    <span className="text-sm font-medium">{passion.label}</span>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>

            {/* CTA */}
            {profile?.resume_url && (
              <AnimatedSection delay={0.6}>
                <a href={profile.resume_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
                    {t('downloadCV')}
                  </Button>
                </a>
              </AnimatedSection>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}