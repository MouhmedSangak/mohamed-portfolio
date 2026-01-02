// ============================================
// Contact Form Component
// ============================================

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  User, 
  Mail, 
  Phone, 
  MessageSquare,
  Paperclip,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { useLocale } from '@/lib/hooks/useLocale';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Dropdown';
import { Captcha } from '@/components/common/Captcha';

interface FormData {
  name: string;
  email: string;
  whatsapp: string;
  preferredContact: 'email' | 'whatsapp';
  subject: string;
  message: string;
  attachment: File | null;
}

interface FormErrors {
  name?: string;
  email?: string;
  whatsapp?: string;
  subject?: string;
  message?: string;
  captcha?: string;
}

export function ContactForm() {
  const t = useTranslations('contact.form');
  const { locale, isRTL } = useLocale();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    whatsapp: '',
    preferredContact: 'email',
    subject: '',
    message: '',
    attachment: null,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = isRTL ? 'الاسم مطلوب' : 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = isRTL ? 'البريد الإلكتروني مطلوب' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = isRTL ? 'بريد إلكتروني غير صالح' : 'Invalid email address';
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = isRTL ? 'رقم واتساب مطلوب' : 'WhatsApp number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.whatsapp)) {
      newErrors.whatsapp = isRTL ? 'رقم غير صالح' : 'Invalid phone number';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = isRTL ? 'الموضوع مطلوب' : 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = isRTL ? 'الرسالة مطلوبة' : 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = isRTL ? 'الرسالة قصيرة جداً' : 'Message is too short';
    }

    if (!captchaToken && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      newErrors.captcha = isRTL ? 'يرجى إكمال التحقق' : 'Please complete the verification';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      formPayload.append('email', formData.email);
      formPayload.append('whatsapp', formData.whatsapp);
      formPayload.append('preferredContact', formData.preferredContact);
      formPayload.append('subject', formData.subject);
      formPayload.append('message', formData.message);
      formPayload.append('captchaToken', captchaToken);
      
      if (formData.attachment) {
        formPayload.append('attachment', formData.attachment);
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formPayload,
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        whatsapp: '',
        preferredContact: 'email',
        subject: '',
        message: '',
        attachment: null,
      });
      setCaptchaToken('');
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        attachment: isRTL ? 'حجم الملف كبير جداً' : 'File too large (max 5MB)',
      }));
      return;
    }
    setFormData(prev => ({ ...prev, attachment: file }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success/Error Messages */}
      <AnimatePresence>
        {submitStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'p-4 rounded-lg flex items-start gap-3',
              submitStatus === 'success'
                ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                : 'bg-red-500/10 text-red-500 border border-red-500/20'
            )}
          >
            {submitStatus === 'success' ? (
              <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-medium">
                {submitStatus === 'success' ? t('success') : t('error')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSubmitStatus('idle')}
              className="flex-shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name & Email */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          name="name"
          label={t('name')}
          placeholder={t('namePlaceholder')}
          value={formData.name}
          onChange={handleInputChange}
          error={errors.name}
          leftIcon={<User className="h-5 w-5" />}
          required
        />
        <Input
          name="email"
          type="email"
          label={t('email')}
          placeholder={t('emailPlaceholder')}
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          leftIcon={<Mail className="h-5 w-5" />}
          required
        />
      </div>

      {/* WhatsApp & Preferred Contact */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          name="whatsapp"
          type="tel"
          label={t('whatsapp')}
          placeholder={t('whatsappPlaceholder')}
          value={formData.whatsapp}
          onChange={handleInputChange}
          error={errors.whatsapp}
          leftIcon={<Phone className="h-5 w-5" />}
          required
        />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            {t('preferredContact')}
            <span className="text-red-500 ms-1">*</span>
          </label>
          <Select
            value={formData.preferredContact}
            onChange={(value) => setFormData(prev => ({ 
              ...prev, 
              preferredContact: value as 'email' | 'whatsapp' 
            }))}
            options={[
              { value: 'email', label: t('viaEmail'), icon: <Mail className="h-4 w-4" /> },
              { value: 'whatsapp', label: t('viaWhatsapp'), icon: <MessageSquare className="h-4 w-4" /> },
            ]}
          />
        </div>
      </div>

      {/* Subject */}
      <Input
        name="subject"
        label={t('subject')}
        placeholder={t('subjectPlaceholder')}
        value={formData.subject}
        onChange={handleInputChange}
        error={errors.subject}
        required
      />

      {/* Message */}
      <Textarea
        name="message"
        label={t('message')}
        placeholder={t('messagePlaceholder')}
        value={formData.message}
        onChange={handleInputChange}
        error={errors.message}
        required
        className="min-h-[150px]"
      />

      {/* Attachment */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">
          {t('attachment')}
        </label>
        <div className="relative">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="hidden"
            id="attachment"
          />
          <label
            htmlFor="attachment"
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer',
              'border-dark-300 dark:border-dark-600 hover:border-primary-500 transition-colors',
              formData.attachment && 'border-primary-500 bg-primary-500/5'
            )}
          >
            <Paperclip className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {formData.attachment
                ? formData.attachment.name
                : t('attachmentHint')}
            </span>
          </label>
          {formData.attachment && (
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, attachment: null }))}
              className="absolute end-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-dark-200 dark:hover:bg-dark-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* CAPTCHA */}
      <div className="flex flex-col items-center gap-2">
        <Captcha
          onVerify={(token) => {
            setCaptchaToken(token);
            setErrors(prev => ({ ...prev, captcha: undefined }));
          }}
          onExpire={() => setCaptchaToken('')}
          onError={() => setErrors(prev => ({ 
            ...prev, 
            captcha: isRTL ? 'فشل التحقق' : 'Verification failed' 
          }))}
        />
        {errors.captcha && (
          <p className="text-sm text-red-500">{errors.captcha}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        isLoading={isSubmitting}
        leftIcon={<Send className="h-5 w-5" />}
      >
        {isSubmitting ? t('sending') : t('submit')}
      </Button>
    </form>
  );
}