-- ============================================
-- Storage Buckets Setup
-- ============================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('profile', 'profile', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
    ('projects', 'projects', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
    ('blog', 'blog', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
    ('attachments', 'attachments', false, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Storage Policies
-- ============================================

-- Profile bucket: Public read, Admin write
CREATE POLICY "Profile: Public read" ON storage.objects
    FOR SELECT USING (bucket_id = 'profile');

CREATE POLICY "Profile: Admin upload" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'profile' 
        AND (SELECT is_admin(auth.uid()))
    );

CREATE POLICY "Profile: Admin update" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'profile' 
        AND (SELECT is_admin(auth.uid()))
    );

CREATE POLICY "Profile: Admin delete" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'profile' 
        AND (SELECT is_admin(auth.uid()))
    );

-- Projects bucket: Public read, Admin write
CREATE POLICY "Projects: Public read" ON storage.objects
    FOR SELECT USING (bucket_id = 'projects');

CREATE POLICY "Projects: Admin upload" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'projects' 
        AND (SELECT is_admin(auth.uid()))
    );

CREATE POLICY "Projects: Admin update" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'projects' 
        AND (SELECT is_admin(auth.uid()))
    );

CREATE POLICY "Projects: Admin delete" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'projects' 
        AND (SELECT is_admin(auth.uid()))
    );

-- Blog bucket: Public read, Admin write
CREATE POLICY "Blog: Public read" ON storage.objects
    FOR SELECT USING (bucket_id = 'blog');

CREATE POLICY "Blog: Admin upload" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'blog' 
        AND (SELECT is_admin(auth.uid()))
    );

CREATE POLICY "Blog: Admin update" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'blog' 
        AND (SELECT is_admin(auth.uid()))
    );

CREATE POLICY "Blog: Admin delete" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'blog' 
        AND (SELECT is_admin(auth.uid()))
    );

-- Attachments bucket: Admin only
CREATE POLICY "Attachments: Admin read" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'attachments' 
        AND (SELECT is_admin(auth.uid()))
    );

CREATE POLICY "Attachments: Public upload" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'attachments');

CREATE POLICY "Attachments: Admin delete" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'attachments' 
        AND (SELECT is_admin(auth.uid()))
    );