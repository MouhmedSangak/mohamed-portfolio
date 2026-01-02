-- ============================================
-- Mohamed Portfolio Database Schema
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. SETTINGS TABLE (Site Configuration)
-- ============================================
CREATE TABLE public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL DEFAULT '{}',
    category VARCHAR(50) NOT NULL DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. ADMINS TABLE (Admin Users)
-- ============================================
CREATE TABLE public.admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'editor' CHECK (role IN ('owner', 'admin', 'editor')),
    permissions JSONB NOT NULL DEFAULT '{
        "manage_projects": true,
        "manage_blog": true,
        "manage_skills": true,
        "manage_inbox": true,
        "manage_settings": false,
        "manage_admins": false,
        "view_analytics": true
    }',
    is_active BOOLEAN DEFAULT true,
    mfa_enabled BOOLEAN DEFAULT false,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. PROFILE TABLE (About Section)
-- ============================================
CREATE TABLE public.profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_ar VARCHAR(255) NOT NULL DEFAULT 'محمد السيد محمود سنجق',
    name_en VARCHAR(255) NOT NULL DEFAULT 'Mohamed Sayed Sangak',
    name_de VARCHAR(255) NOT NULL DEFAULT 'Mohamed Sayed Sangak',
    
    title_ar VARCHAR(255) NOT NULL DEFAULT 'طالب طب',
    title_en VARCHAR(255) NOT NULL DEFAULT 'Medical Student',
    title_de VARCHAR(255) NOT NULL DEFAULT 'Medizinstudent',
    
    bio_ar TEXT,
    bio_en TEXT,
    bio_de TEXT,
    
    university_ar VARCHAR(255) DEFAULT 'جامعة سوهاج',
    university_en VARCHAR(255) DEFAULT 'Sohag University',
    university_de VARCHAR(255) DEFAULT 'Universität Sohag',
    
    faculty_ar VARCHAR(255) DEFAULT 'كلية الطب البشري',
    faculty_en VARCHAR(255) DEFAULT 'Faculty of Medicine (Human Medicine)',
    faculty_de VARCHAR(255) DEFAULT 'Fakultät für Humanmedizin',
    
    year_ar VARCHAR(100) DEFAULT 'السنة الأولى',
    year_en VARCHAR(100) DEFAULT 'First Year',
    year_de VARCHAR(100) DEFAULT 'Erstes Jahr',
    
    country VARCHAR(100) DEFAULT 'Egypt',
    
    profile_image_url TEXT,
    resume_url TEXT,
    
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. SOCIAL LINKS TABLE
-- ============================================
CREATE TABLE public.social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    icon VARCHAR(50),
    display_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. SKILLS TABLE
-- ============================================
CREATE TABLE public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    name_de VARCHAR(255),
    
    description_ar TEXT,
    description_en TEXT,
    description_de TEXT,
    
    category VARCHAR(50) NOT NULL DEFAULT 'technical',
    icon VARCHAR(50),
    proficiency INT DEFAULT 80 CHECK (proficiency >= 0 AND proficiency <= 100),
    display_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. PROJECTS TABLE
-- ============================================
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_de VARCHAR(255),
    
    description_ar TEXT,
    description_en TEXT,
    description_de TEXT,
    
    content_ar TEXT,
    content_en TEXT,
    content_de TEXT,
    
    role_ar VARCHAR(255),
    role_en VARCHAR(255),
    role_de VARCHAR(255),
    
    highlights_ar JSONB DEFAULT '[]',
    highlights_en JSONB DEFAULT '[]',
    highlights_de JSONB DEFAULT '[]',
    
    technologies JSONB DEFAULT '[]',
    
    thumbnail_url TEXT,
    images JSONB DEFAULT '[]',
    
    project_url TEXT,
    github_url TEXT,
    is_public_link BOOLEAN DEFAULT false,
    is_private BOOLEAN DEFAULT false,
    
    start_date DATE,
    end_date DATE,
    is_ongoing BOOLEAN DEFAULT false,
    
    display_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_visible BOOLEAN DEFAULT true,
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. BLOG POSTS TABLE
-- ============================================
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_de VARCHAR(255),
    
    excerpt_ar TEXT,
    excerpt_en TEXT,
    excerpt_de TEXT,
    
    content_ar TEXT,
    content_en TEXT,
    content_de TEXT,
    
    cover_image_url TEXT,
    
    tags JSONB DEFAULT '[]',
    
    author_id UUID REFERENCES public.admins(id),
    
    reading_time_minutes INT DEFAULT 5,
    
    is_featured BOOLEAN DEFAULT false,
    is_visible BOOLEAN DEFAULT true,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. CONTACT MESSAGES TABLE (Inbox)
-- ============================================
CREATE TABLE public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50) NOT NULL,
    preferred_contact VARCHAR(20) NOT NULL CHECK (preferred_contact IN ('email', 'whatsapp')),
    
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    
    attachment_url TEXT,
    attachment_name VARCHAR(255),
    
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'replied', 'archived', 'spam')),
    
    notes TEXT,
    replied_at TIMESTAMPTZ,
    replied_by UUID REFERENCES public.admins(id),
    
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. ANALYTICS TABLE
-- ============================================
CREATE TABLE public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    visitor_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(50) NOT NULL DEFAULT 'pageview',
    page_path VARCHAR(500),
    referrer TEXT,
    
    user_agent TEXT,
    device_type VARCHAR(20),
    browser VARCHAR(50),
    os VARCHAR(50),
    country VARCHAR(100),
    
    session_id VARCHAR(100),
    
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster analytics queries
CREATE INDEX idx_analytics_created_at ON public.analytics_events(created_at);
CREATE INDEX idx_analytics_visitor_id ON public.analytics_events(visitor_id);
CREATE INDEX idx_analytics_event_type ON public.analytics_events(event_type);

-- ============================================
-- 10. SECTION VISIBILITY TABLE
-- ============================================
CREATE TABLE public.section_visibility (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key VARCHAR(50) UNIQUE NOT NULL,
    is_visible BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 11. LOGIN ATTEMPTS TABLE (Rate Limiting)
-- ============================================
CREATE TABLE public.login_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    ip_address INET NOT NULL,
    success BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_login_attempts_email ON public.login_attempts(email, created_at);
CREATE INDEX idx_login_attempts_ip ON public.login_attempts(ip_address, created_at);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON public.admins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profile_updated_at BEFORE UPDATE ON public.profile
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE ON public.social_links
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON public.skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON public.contact_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_section_visibility_updated_at BEFORE UPDATE ON public.section_visibility
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admins
        WHERE id = user_id AND is_active = true
    );
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Function to check if user is owner
CREATE OR REPLACE FUNCTION is_owner(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admins
        WHERE id = user_id AND role = 'owner' AND is_active = true
    );
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Function to check login attempts (rate limiting)
CREATE OR REPLACE FUNCTION check_login_attempts(check_email VARCHAR, check_ip INET)
RETURNS BOOLEAN AS $$
DECLARE
    attempt_count INT;
BEGIN
    SELECT COUNT(*) INTO attempt_count
    FROM public.login_attempts
    WHERE (email = check_email OR ip_address = check_ip)
        AND success = false
        AND created_at > NOW() - INTERVAL '15 minutes';
    
    RETURN attempt_count < 5;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Function to get daily visitors count
CREATE OR REPLACE FUNCTION get_daily_visitors(target_date DATE DEFAULT CURRENT_DATE)
RETURNS INT AS $$
BEGIN
    RETURN (
        SELECT COUNT(DISTINCT visitor_id)
        FROM public.analytics_events
        WHERE DATE(created_at) = target_date
    );
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Function to get total visitors
CREATE OR REPLACE FUNCTION get_total_visitors()
RETURNS INT AS $$
BEGIN
    RETURN (
        SELECT COUNT(DISTINCT visitor_id)
        FROM public.analytics_events
    );
END;
$$ language 'plpgsql' SECURITY DEFINER;