// ============================================
// Database Types - Supabase Schema
// ============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ============================================
// Database Interface
// ============================================

export interface Database {
  public: {
    Tables: {
      // ----------------------------------------
      // Blog Posts Table
      // ----------------------------------------
      blog_posts: {
        Row: {
          id: string
          title_ar: string
          title_en: string
          title_de: string
          slug: string
          content_ar: string
          content_en: string
          content_de: string
          excerpt_ar: string | null
          excerpt_en: string | null
          excerpt_de: string | null
          cover_image_url: string | null
          tags: string[]
          status: 'draft' | 'published' | 'archived'
          is_featured: boolean
          is_visible: boolean
          reading_time_minutes: number
          views_count: number
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title_ar: string
          title_en: string
          title_de: string
          slug: string
          content_ar: string
          content_en: string
          content_de: string
          excerpt_ar?: string | null
          excerpt_en?: string | null
          excerpt_de?: string | null
          cover_image_url?: string | null
          tags?: string[]
          status?: 'draft' | 'published' | 'archived'
          is_featured?: boolean
          is_visible?: boolean
          reading_time_minutes?: number
          views_count?: number
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title_ar?: string
          title_en?: string
          title_de?: string
          slug?: string
          content_ar?: string
          content_en?: string
          content_de?: string
          excerpt_ar?: string | null
          excerpt_en?: string | null
          excerpt_de?: string | null
          cover_image_url?: string | null
          tags?: string[]
          status?: 'draft' | 'published' | 'archived'
          is_featured?: boolean
          is_visible?: boolean
          reading_time_minutes?: number
          views_count?: number
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // ----------------------------------------
      // Projects Table
      // ----------------------------------------
      projects: {
        Row: {
          id: string
          title_ar: string
          title_en: string
          title_de: string
          slug: string
          description_ar: string
          description_en: string
          description_de: string
          content_ar: string | null
          content_en: string | null
          content_de: string | null
          cover_image_url: string | null
          images: string[]
          technologies: string[]
          live_url: string | null
          github_url: string | null
          is_featured: boolean
          is_visible: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title_ar: string
          title_en: string
          title_de: string
          slug: string
          description_ar: string
          description_en: string
          description_de: string
          content_ar?: string | null
          content_en?: string | null
          content_de?: string | null
          cover_image_url?: string | null
          images?: string[]
          technologies?: string[]
          live_url?: string | null
          github_url?: string | null
          is_featured?: boolean
          is_visible?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title_ar?: string
          title_en?: string
          title_de?: string
          slug?: string
          description_ar?: string
          description_en?: string
          description_de?: string
          content_ar?: string | null
          content_en?: string | null
          content_de?: string | null
          cover_image_url?: string | null
          images?: string[]
          technologies?: string[]
          live_url?: string | null
          github_url?: string | null
          is_featured?: boolean
          is_visible?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // ----------------------------------------
      // Skills Table
      // ----------------------------------------
      skills: {
        Row: {
          id: string
          name_ar: string
          name_en: string
          name_de: string
          category: string
          icon: string | null
          proficiency: number
          display_order: number
          is_visible: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name_ar: string
          name_en: string
          name_de: string
          category: string
          icon?: string | null
          proficiency?: number
          display_order?: number
          is_visible?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name_ar?: string
          name_en?: string
          name_de?: string
          category?: string
          icon?: string | null
          proficiency?: number
          display_order?: number
          is_visible?: boolean
          created_at?: string
        }
        Relationships: []
      }

      // ----------------------------------------
      // Contact Messages Table
      // ----------------------------------------
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          subject: string | null
          message: string
          is_read: boolean
          is_archived: boolean
          replied_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject?: string | null
          message: string
          is_read?: boolean
          is_archived?: boolean
          replied_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string | null
          message?: string
          is_read?: boolean
          is_archived?: boolean
          replied_at?: string | null
          created_at?: string
        }
        Relationships: []
      }

      // ----------------------------------------
      // Site Settings Table
      // ----------------------------------------
      site_settings: {
        Row: {
          id: string
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          updated_at?: string
        }
        Relationships: []
      }

      // ----------------------------------------
      // Admins Table
      // ----------------------------------------
      admins: {
        Row: {
          id: string
          user_id: string
          email: string
          role: 'super_admin' | 'admin' | 'editor'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          role?: 'super_admin' | 'admin' | 'editor'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          role?: 'super_admin' | 'admin' | 'editor'
          created_at?: string
        }
        Relationships: []
      }

      // ----------------------------------------
      // Analytics Table
      // ----------------------------------------
      analytics: {
        Row: {
          id: string
          page_path: string
          visitor_id: string
          country: string | null
          city: string | null
          device: string | null
          browser: string | null
          os: string | null
          referrer: string | null
          session_duration: number | null
          created_at: string
        }
        Insert: {
          id?: string
          page_path: string
          visitor_id: string
          country?: string | null
          city?: string | null
          device?: string | null
          browser?: string | null
          os?: string | null
          referrer?: string | null
          session_duration?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          page_path?: string
          visitor_id?: string
          country?: string | null
          city?: string | null
          device?: string | null
          browser?: string | null
          os?: string | null
          referrer?: string | null
          session_duration?: number | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      post_status: 'draft' | 'published' | 'archived'
      admin_role: 'super_admin' | 'admin' | 'editor'
    }
    CompositeTypes: {
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

// ============================================
// Exported Types for Easy Use
// ============================================

export type BlogPost = Tables<'blog_posts'>
export type BlogPostInsert = InsertTables<'blog_posts'>
export type BlogPostUpdate = UpdateTables<'blog_posts'>

export type Project = Tables<'projects'>
export type ProjectInsert = InsertTables<'projects'>
export type ProjectUpdate = UpdateTables<'projects'>

export type Skill = Tables<'skills'>
export type SkillInsert = InsertTables<'skills'>
export type SkillUpdate = UpdateTables<'skills'>

export type ContactMessage = Tables<'contact_messages'>
export type ContactMessageInsert = InsertTables<'contact_messages'>
export type ContactMessageUpdate = UpdateTables<'contact_messages'>

export type SiteSetting = Tables<'site_settings'>
export type SiteSettingInsert = InsertTables<'site_settings'>
export type SiteSettingUpdate = UpdateTables<'site_settings'>

export type Admin = Tables<'admins'>
export type AdminInsert = InsertTables<'admins'>
export type AdminUpdate = UpdateTables<'admins'>

export type AnalyticsEvent = Tables<'analytics'>
export type AnalyticsEventInsert = InsertTables<'analytics'>
export type AnalyticsEventUpdate = UpdateTables<'analytics'>
