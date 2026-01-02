// ============================================
// Privacy Policy Page
// ============================================

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Shield, Database, Lock, Mail, Eye } from 'lucide-react';
import { AnimatedSection } from '@/components/layout/PageTransition';
import { Card } from '@/components/ui/Card';
import type { Locale } from '@/i18n/config';

interface PrivacyPageProps {
  params: { locale: string };
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'privacy' });
  
  return {
    title: t('title'),
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const t = await getTranslations({ locale: params.locale, namespace: 'privacy' });
  const locale = params.locale as Locale;
  const isRTL = locale === 'ar';

  const sections = [
    {
      key: 'intro',
      icon: Shield,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      key: 'collection',
      icon: Database,
      color: 'from-purple-500 to-pink-500',
    },
    {
      key: 'usage',
      icon: Eye,
      color: 'from-amber-500 to-orange-500',
    },
    {
      key: 'protection',
      icon: Lock,
      color: 'from-green-500 to-emerald-500',
    },
    {
      key: 'contact',
      icon: Mail,
      color: 'from-red-500 to-rose-500',
    },
  ];

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <AnimatedSection className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('title')}
          </h1>
          <p className="text-muted-foreground">
            {t('lastUpdated')}: {new Date().toLocaleDateString(locale)}
          </p>
        </AnimatedSection>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <AnimatedSection key={section.key} delay={index * 0.1}>
              <Card variant="bordered" padding="lg">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center flex-shrink-0`}>
                    <section.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      {t(`sections.${section.key}.title`)}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {t(`sections.${section.key}.content`)}
                    </p>
                  </div>
                </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
}