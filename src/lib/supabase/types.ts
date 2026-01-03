// src/lib/supabase/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // ============================================
      // ADMINS TABLE
      // ============================================
      admins: {
        Row: {
          id: string
          email: string
          display_name: string
          role: 'owner' | 'admin' | 'editor'
          permissions: {
            manage_projects: boolean
            manage_blog: boolean
            manage_skills: boolean
            manage_inbox: boolean
            manage_settings: boolean
            manage_admins: boolean
            view_analytics: boolean
          }
          is_active: boolean
          mfa_enabled: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name: string
          role?: 'owner' | 'admin' | 'editor'
          permissions?: Json
          is_active?: boolean
          mfa_enabled?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string
          role?: 'owner' | 'admin' | 'editor'
          permissions?: Json
          is_active?: boolean
          mfa_enabled?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // ============================================
      // PROFILE TABLE
      // ============================================
      profile: {
        Row: {
          id: string
          name_ar: string
          name_en: string
          name_de: string
          title_ar: string
          title_en: string
          title_de: string
          bio_ar: string | null
          bio_en: string | null
          bio_de: string | null
          university_ar: string | null
          university_en: string | null
          university_de: string | null
          faculty_ar: string | null
          faculty_en: string | null
          faculty_de: string | null
          year_ar: string | null
          year_en: string | null
          year_de: string | null
          country: string | null
          profile_image_url: string | null
          resume_url: string | null
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name_ar?: string
          name_en?: string
          name_de?: string
          title_ar?: string
          title_en?: string
          title_de?: string
          bio_ar?: string | null
          bio_en?: string | null
          bio_de?: string | null
          university_ar?: string | null
          university_en?: string | null
          university_de?: string | null
          faculty_ar?: string | null
          faculty_en?: string | null
          faculty_de?: string | null
          year_ar?: string | null
          year_en?: string | null
          year_de?: string | null
          country?: string | null
          profile_image_url?: string | null
          resume_url?: string | null
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name_ar?: string
          name_en?: string
          name_de?: string
          title_ar?: string
          title_en?: string
          title_de?: string
          bio_ar?: string | null
          bio_en?: string | null
          bio_de?: string | null
          university_ar?: string | null
          university_en?: string | null
          university_de?: string | null
          faculty_ar?: string | null
          faculty_en?: string | null
          faculty_de?: string | null
          year_ar?: string | null
          year_en?: string | null
          year_de?: string | null
          country?: string | null
          profile_image_url?: string | null
          resume_url?: string | null
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      // ============================================
      // SOCIAL LINKS TABLE
      // ============================================
      social_links: {
        Row: {
          id: string
          platform: string
          url: string
          icon: string | null
          display_order: number
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          platform: string
          url: string
          icon?: string | null
          display_order?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          platform?: string
          url?: string
          icon?: string | null
          display_order?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      // ============================================
      // SKILLS TABLE
      // ============================================
      skills: {
        Row: {
          id: string
          name_ar: string
          name_en: string
          name_de: string | null
          description_ar: string | null
          description_en: string | null
          description_de: string | null
          category: string
          icon: string | null
          proficiency: number
          display_order: number
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name_ar: string
          name_en: string
          name_de?: string | null
          description_ar?: string | null
          description_en?: string | null
          description_de?: string | null
          category?: string
          icon?: string | null
          proficiency?: number
          display_order?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name_ar?: string
          name_en?: string
          name_de?: string | null
          description_ar?: string | null
          description_en?: string | null
          description_de?: string | null
          category?: string
          icon?: string | null
          proficiency?: number
          display_order?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      // ============================================
      // PROJECTS TABLE
      // ============================================
      projects: {
        Row: {
          id: string
          slug: string
          title_ar: string
          title_en: string
          title_de: string | null
          description_ar: string | null
          description_en: string | null
          description_de: string | null
          content_ar: string | null
          content_en: string | null
          content_de: string | null
          role_ar: string | null
          role_en: string | null
          role_de: string | null
          highlights_ar: Json
          highlights_en: Json
          highlights_de: Json
          technologies: Json
          thumbnail_url: string | null
          images: Json
          project_url: string | null
          github_url: string | null
          is_public_link: boolean
          is_private: boolean
          start_date: string | null
          end_date: string | null
          is_ongoing: boolean
          display_order: number
          is_featured: boolean
          is_visible: boolean
          status: 'draft' | 'published' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title_ar: string
          title_en: string
          title_de?: string | null
          description_ar?: string | null
          description_en?: string | null
          description_de?: string | null
          content_ar?: string | null
          content_en?: string | null
          content_de?: string | null
          role_ar?: string | null
          role_en?: string | null
          role_de?: string | null
          highlights_ar?: Json
          highlights_en?: Json
          highlights_de?: Json
          technologies?: Json
          thumbnail_url?: string | null
          images?: Json
          project_url?: string | null
          github_url?: string | null
          is_public_link?: boolean
          is_private?: boolean
          start_date?: string | null
          end_date?: string | null
          is_ongoing?: boolean
          display_order?: number
          is_featured?: boolean
          is_visible?: boolean
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title_ar?: string
          title_en?: string
          title_de?: string | null
          description_ar?: string | null
          description_en?: string | null
          description_de?: string | null
          content_ar?: string | null
          content_en?: string | null
          content_de?: string | null
          role_ar?: string | null
          role_en?: string | null
          role_de?: string | null
          highlights_ar?: Json
          highlights_en?: Json
          highlights_de?: Json
          technologies?: Json
          thumbnail_url?: string | null
          images?: Json
          project_url?: string | null
          github_url?: string | null
          is_public_link?: boolean
          is_private?: boolean
          start_date?: string | null
          end_date?: string | null
          is_ongoing?: boolean
          display_order?: number
          is_featured?: boolean
          is_visible?: boolean
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
        }
      }

      // ============================================
      // BLOG POSTS TABLE
      // ============================================
      blog_posts: {
        Row: {
          id: string
          slug: string
          title_ar: string
          title_en: string
          title_de: string | null
          excerpt_ar: string | null
          excerpt_en: string | null
          excerpt_de: string | null
          content_ar: string | null
          content_en: string | null
          content_de: string | null
          cover_image_url: string | null
          tags: Json
          author_id: string | null
          reading_time_minutes: number
          is_featured: boolean
          is_visible: boolean
          status: 'draft' | 'published' | 'archived'
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title_ar: string
          title_en: string
          title_de?: string | null
          excerpt_ar?: string | null
          excerpt_en?: string | null
          excerpt_de?: string | null
          content_ar?: string | null
          content_en?: string | null
          content_de?: string | null
          cover_image_url?: string | null
          tags?: Json
          author_id?: string | null
          reading_time_minutes?: number
          is_featured?: boolean
          is_visible?: boolean
          status?: 'draft' | 'published' | 'archived'
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title_ar?: string
          title_en?: string
          title_de?: string | null
          excerpt_ar?: string | null
          excerpt_en?: string | null
          excerpt_de?: string | null
          content_ar?: string | null
          content_en?: string | null
          content_de?: string | null
          cover_image_url?: string | null
          tags?: Json
          author_id?: string | null
          reading_time_minutes?: number
          is_featured?: boolean
          is_visible?: boolean
          status?: 'draft' | 'published' | 'archived'
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // ============================================
      // CONTACT MESSAGES TABLE ⭐ المشكلة هنا
      // ============================================
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          whatsapp: string
          preferred_contact: 'email' | 'whatsapp'
          subject: string
          message: string
          attachment_url: string | null
          attachment_name: string | null
          status: 'new' | 'in_progress' | 'replied' | 'archived' | 'spam'
          notes: string | null
          replied_at: string | null
          replied_by: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          whatsapp: string
          preferred_contact: 'email' | 'whatsapp'
          subject: string
          message: string
          attachment_url?: string | null
          attachment_name?: string | null
          status?: 'new' | 'in_progress' | 'replied' | 'archived' | 'spam'
          notes?: string | null
          replied_at?: string | null
          replied_by?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          whatsapp?: string
          preferred_contact?: 'email' | 'whatsapp'
          subject?: string
          message?: string
          attachment_url?: string | null
          attachment_name?: string | null
          status?: 'new' | 'in_progress' | 'replied' | 'archived' | 'spam'
          notes?: string | null
          replied_at?: string | null
          replied_by?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // ============================================
      // SETTINGS TABLE
      // ============================================
      settings: {
        Row: {
          id: string
          key: string
          value: Json
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          category?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          category?: string
          created_at?: string
          updated_at?: string
        }
      }

      // ============================================
      // SECTION VISIBILITY TABLE
      // ============================================
      section_visibility: {
        Row: {
          id: string
          section_key: string
          is_visible: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          section_key: string
          is_visible?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          section_key?: string
          is_visible?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }

      // ============================================
      // ANALYTICS EVENTS TABLE
      // ============================================
      analytics_events: {
        Row: {
          id: string
          visitor_id: string
          event_type: string
          page_path: string | null
          referrer: string | null
          user_agent: string | null
          device_type: string | null
          browser: string | null
          os: string | null
          country: string | null
          session_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          visitor_id: string
          event_type?: string
          page_path?: string | null
          referrer?: string | null
          user_agent?: string | null
          device_type?: string | null
          browser?: string | null
          os?: string | null
          country?: string | null
          session_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          visitor_id?: string
          event_type?: string
          page_path?: string | null
          referrer?: string | null
          user_agent?: string | null
          device_type?: string | null
          browser?: string | null
          os?: string | null
          country?: string | null
          session_id?: string | null
          metadata?: Json
          created_at?: string
        }
      }

      // ============================================
      // LOGIN ATTEMPTS TABLE
      // ============================================
      login_attempts: {
        Row: {
          id: string
          email: string
          ip_address: string
          success: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          ip_address: string
          success?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          ip_address?: string
          success?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_owner: {
        Args: { user_id: string }
        Returns: boolean
      }
      check_login_attempts: {
        Args: { check_email: string; check_ip: string }
        Returns: boolean
      }
      get_daily_visitors: {
        Args: { target_date?: string }
        Returns: number
      }
      get_total_visitors: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// ============================================
// Helper Types
// ============================================
export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row']

export type InsertTables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert']

export type UpdateTables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update']

// Specific types for common use
export type Admin = Tables<'admins'>
export type Profile = Tables<'profile'>
export type SocialLink = Tables<'social_links'>
export type Skill = Tables<'skills'>
export type Project = Tables<'projects'>
export type BlogPost = Tables<'blog_posts'>
export type ContactMessage = Tables<'contact_messages'>
export type Setting = Tables<'settings'>
export type AnalyticsEvent = Tables<'analytics_events'>

// Message Status Type
export type MessageStatus = 'new' | 'in_progress' | 'replied' | 'archived' | 'spam'
