-- ============================================
-- Row Level Security Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_visibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SETTINGS POLICIES
-- ============================================
CREATE POLICY "Settings: Public read" ON public.settings
    FOR SELECT USING (true);

CREATE POLICY "Settings: Admin update" ON public.settings
    FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "Settings: Admin insert" ON public.settings
    FOR INSERT WITH CHECK (is_admin(auth.uid()));

-- ============================================
-- ADMINS POLICIES
-- ============================================
CREATE POLICY "Admins: Self read" ON public.admins
    FOR SELECT USING (auth.uid() = id OR is_owner(auth.uid()));

CREATE POLICY "Admins: Owner manage" ON public.admins
    FOR ALL USING (is_owner(auth.uid()));

-- ============================================
-- PROFILE POLICIES
-- ============================================
CREATE POLICY "Profile: Public read visible" ON public.profile
    FOR SELECT USING (is_visible = true OR is_admin(auth.uid()));

CREATE POLICY "Profile: Admin update" ON public.profile
    FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "Profile: Admin insert" ON public.profile
    FOR INSERT WITH CHECK (is_admin(auth.uid()));

-- ============================================
-- SOCIAL LINKS POLICIES
-- ============================================
CREATE POLICY "Social Links: Public read visible" ON public.social_links
    FOR SELECT USING (is_visible = true OR is_admin(auth.uid()));

CREATE POLICY "Social Links: Admin manage" ON public.social_links
    FOR ALL USING (is_admin(auth.uid()));

-- ============================================
-- SKILLS POLICIES
-- ============================================
CREATE POLICY "Skills: Public read visible" ON public.skills
    FOR SELECT USING (is_visible = true OR is_admin(auth.uid()));

CREATE POLICY "Skills: Admin manage" ON public.skills
    FOR ALL USING (is_admin(auth.uid()));

-- ============================================
-- PROJECTS POLICIES
-- ============================================
CREATE POLICY "Projects: Public read published" ON public.projects
    FOR SELECT USING (
        (status = 'published' AND is_visible = true)
        OR is_admin(auth.uid())
    );

CREATE POLICY "Projects: Admin manage" ON public.projects
    FOR ALL USING (is_admin(auth.uid()));

-- ============================================
-- BLOG POSTS POLICIES
-- ============================================
CREATE POLICY "Blog: Public read published" ON public.blog_posts
    FOR SELECT USING (
        (status = 'published' AND is_visible = true)
        OR is_admin(auth.uid())
    );

CREATE POLICY "Blog: Admin manage" ON public.blog_posts
    FOR ALL USING (is_admin(auth.uid()));

-- ============================================
-- CONTACT MESSAGES POLICIES
-- ============================================
CREATE POLICY "Contact: Public insert" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Contact: Admin read" ON public.contact_messages
    FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Contact: Admin update" ON public.contact_messages
    FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "Contact: Admin delete" ON public.contact_messages
    FOR DELETE USING (is_admin(auth.uid()));

-- ============================================
-- ANALYTICS POLICIES
-- ============================================
CREATE POLICY "Analytics: Public insert" ON public.analytics_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Analytics: Admin read" ON public.analytics_events
    FOR SELECT USING (is_admin(auth.uid()));

-- ============================================
-- SECTION VISIBILITY POLICIES
-- ============================================
CREATE POLICY "Section Visibility: Public read" ON public.section_visibility
    FOR SELECT USING (true);

CREATE POLICY "Section Visibility: Admin manage" ON public.section_visibility
    FOR ALL USING (is_admin(auth.uid()));

-- ============================================
-- LOGIN ATTEMPTS POLICIES
-- ============================================
CREATE POLICY "Login Attempts: Insert only" ON public.login_attempts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Login Attempts: Admin read" ON public.login_attempts
    FOR SELECT USING (is_admin(auth.uid()));