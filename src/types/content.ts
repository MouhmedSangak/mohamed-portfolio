// ============================================
// Content Types for Frontend
// ============================================

export type Locale = 'ar' | 'en' | 'de';

export interface LocalizedContent<T = string> {
  ar: T;
  en: T;
  de: T;
}

export interface ProfileData {
  id: string;
  name: string;
  title: string;
  bio: string | null;
  university: string | null;
  faculty: string | null;
  year: string | null;
  country: string | null;
  profileImageUrl: string | null;
  resumeUrl: string | null;
}

export interface ProjectData {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: string | null;
  role: string | null;
  highlights: string[];
  technologies: string[];
  thumbnailUrl: string | null;
  images: string[];
  projectUrl: string | null;
  githubUrl: string | null;
  isPublicLink: boolean;
  isPrivate: boolean;
  startDate: string | null;
  endDate: string | null;
  isOngoing: boolean;
  isFeatured: boolean;
}

export interface BlogPostData {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  coverImageUrl: string | null;
  tags: string[];
  authorName: string | null;
  readingTimeMinutes: number;
  publishedAt: string | null;
  isFeatured: boolean;
}

export interface SkillData {
  id: string;
  name: string;
  description: string | null;
  category: string;
  icon: string | null;
  proficiency: number;
}

export interface SocialLinkData {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
}

export interface ContactFormData {
  name: string;
  email: string;
  whatsapp: string;
  preferredContact: 'email' | 'whatsapp';
  subject: string;
  message: string;
  attachment?: File | null;
  captchaToken: string;
}

export interface SiteSettings {
  siteTitle: LocalizedContent;
  siteDescription: LocalizedContent;
  contactEmail: string;
  enableBlog: boolean;
  enableContactForm: boolean;
  enableAttachments: boolean;
  animationsEnabled: boolean;
  animationIntensity: 'low' | 'normal' | 'high';
  darkModeDefault: boolean;
  maintenanceMode: boolean;
}

export interface NavItem {
  key: string;
  href: string;
  label: LocalizedContent;
}

export interface PageMeta {
  title: string;
  description: string;
  ogImage?: string;
}