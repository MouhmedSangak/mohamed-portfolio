# 🚀 دليل الإعداد - Mohamed Portfolio

## المتطلبات الأساسية

- Node.js 18+ 
- npm أو yarn أو pnpm
- حساب [Supabase](https://supabase.com)
- حساب [Cloudflare](https://cloudflare.com) (للـ Turnstile CAPTCHA)
- حساب [Vercel](https://vercel.com) (للنشر)

---

## 1️⃣ إنشاء مشروع Supabase

### أ. إنشاء المشروع
1. اذهب إلى [supabase.com](https://supabase.com)
2. أنشئ حساب جديد أو سجل دخول
3. اضغط "New Project"
4. اختر اسم المشروع والمنطقة وكلمة المرور
5. انتظر حتى يتم إنشاء المشروع

### ب. الحصول على المفاتيح
من صفحة Settings > API:
- `Project URL` → هذا هو `NEXT_PUBLIC_SUPABASE_URL`
- `anon/public` key → هذا هو `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` key → هذا هو `SUPABASE_SERVICE_ROLE_KEY` (سري!)

### ج. إنشاء الجداول
1. اذهب إلى SQL Editor
2. شغّل الملفات بالترتيب:

```sql
-- 1. أولاً: schema.sql
-- انسخ محتوى supabase/schema.sql وشغّله

-- 2. ثانياً: rls-policies.sql
-- انسخ محتوى supabase/rls-policies.sql وشغّله

-- 3. ثالثاً: storage-policies.sql
-- انسخ محتوى supabase/storage-policies.sql وشغّله

-- 4. أخيراً: seed.sql
-- انسخ محتوى supabase/seed.sql وشغّله