// ============================================
// Contact Section Component
// ============================================

'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { useLocale } from '@/lib/hooks/useLocale';
import { Card } from '@/components/ui/Card';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/layout/PageTransition';
import { ContactForm } from '@/components/forms/ContactForm';
import { SocialLinks } from '@/components/common/SocialLinks';

interface ContactSectionProps {
  showForm?: boolean;
  compact?: boolean;
}

export function ContactSection({ showForm = true, compact = false }: ContactSectionProps) {
  const t = useTranslations('contact');
  const { locale, isRTL } = useLocale();

  const contactInfo = [
    {
      icon: Mail,
      label: t('info.email'),
      value: 'mahmedsangak07@gmail.com',
      href: 'mailto:mahmedsangak07@gmail.com',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: MapPin,
      label: t('info.location'),
      value: isRTL ? 'سوهاج، مصر' : 'Sohag, Egypt',
      href: null,
      color: 'from-red-500 to-orange-500',
    },
  ];

  return (
    <section id="contact" className={cn('relative overflow-hidden', compact ? 'py-12' : 'section-padding')}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      <div className="container-custom relative">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('description')}
          </p>
        </AnimatedSection>

        <div className={cn(
          'grid gap-8 lg:gap-12',
          showForm ? 'lg:grid-cols-5' : 'lg:grid-cols-1 max-w-2xl mx-auto'
        )}>
          {/* Contact Info */}
          <AnimatedSection 
            delay={0.2} 
            className={cn(showForm ? 'lg:col-span-2' : '')}
          >
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                {t('info.title')}
              </h3>

              {/* Contact Cards */}
              <StaggerContainer className="space-y-4">
                {contactInfo.map((item) => (
                  <StaggerItem key={item.label}>
                    <Card variant="bordered" padding="md" className="group">
                      <div className="flex items-center gap-4">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={cn(
                            'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg',
                            item.color
                          )}
                        >
                          <item.icon className="h-5 w-5 text-white" />
                        </motion.div>
                        <div>
                          <p className="text-sm text-muted-foreground">{item.label}</p>
                          {item.href ? (
                            <a
                              href={item.href}
                              className="font-medium text-foreground hover:text-primary-500 transition-colors"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <p className="font-medium text-foreground">{item.value}</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {/* Social Links */}
              <div className="pt-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">
                  {t('info.social')}
                </h4>
                <SocialLinks size="lg" />
              </div>

              {/* Decorative */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <MessageCircle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {isRTL ? 'لنتحدث!' : "Let's Talk!"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {isRTL 
                        ? 'أرحب بالاستفسارات والتعاون'
                        : 'Open for inquiries and collaboration'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Contact Form */}
          {showForm && (
            <AnimatedSection delay={0.3} className="lg:col-span-3">
              <Card variant="bordered" padding="lg">
                <ContactForm />
              </Card>
            </AnimatedSection>
          )}
        </div>
      </div>
    </section>
  );
}