// ============================================
// Home Page
// ============================================

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Hero } from '@/components/sections/Hero';
import { AboutSection } from '@/components/sections/AboutSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { BlogSection } from '@/components/sections/BlogSection';
import { ContactSection } from '@/components/sections/ContactSection';

interface HomePageProps {
  params: { locale: string };
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'metadata' });
  
  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection limit={4} showViewAll={true} />
      <BlogSection limit={3} showViewAll={true} />
      <ContactSection />
    </>
  );
}