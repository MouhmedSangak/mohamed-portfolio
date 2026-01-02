// ============================================
// About Page
// ============================================

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AboutSection } from '@/components/sections/AboutSection';

interface AboutPageProps {
  params: { locale: string };
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'about' });
  
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function AboutPage() {
  return (
    <div className="pt-20">
      <AboutSection />
    </div>
  );
}