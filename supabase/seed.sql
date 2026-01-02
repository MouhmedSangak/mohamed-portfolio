-- ============================================
-- Seed Data for Mohamed Portfolio
-- ============================================

-- Insert default profile
INSERT INTO public.profile (
    name_ar, name_en, name_de,
    title_ar, title_en, title_de,
    bio_ar, bio_en, bio_de,
    university_ar, university_en, university_de,
    faculty_ar, faculty_en, faculty_de,
    year_ar, year_en, year_de,
    country, is_visible
) VALUES (
    'محمد السيد محمود سنجق',
    'Mohamed Sayed Sangak',
    'Mohamed Sayed Sangak',
    'طالب طب',
    'Medical Student',
    'Medizinstudent',
    'طالب طب بشري في السنة الأولى بجامعة سوهاج، مصر. شغوف بالتكنولوجيا والبرمجة إلى جانب دراستي الطبية. أسعى لتطوير مهاراتي والمساهمة في مشاريع تجمع بين الطب والتقنية.',
    'First-year medical student at Sohag University, Egypt. Passionate about technology and programming alongside my medical studies. I strive to develop my skills and contribute to projects that combine medicine and technology.',
    'Medizinstudent im ersten Jahr an der Universität Sohag, Ägypten. Leidenschaftlich für Technologie und Programmierung neben meinem Medizinstudium. Ich strebe danach, meine Fähigkeiten zu entwickeln und zu Projekten beizutragen, die Medizin und Technologie verbinden.',
    'جامعة سوهاج',
    'Sohag University',
    'Universität Sohag',
    'كلية الطب البشري',
    'Faculty of Medicine (Human Medicine)',
    'Fakultät für Humanmedizin',
    'السنة الأولى',
    'First Year',
    'Erstes Jahr',
    'Egypt',
    true
);

-- Insert default social links
INSERT INTO public.social_links (platform, url, icon, display_order, is_visible) VALUES
    ('email', 'mailto:mahmedsangak07@gmail.com', 'mail', 1, true),
    ('facebook', 'https://web.facebook.com/MSANGAK27', 'facebook', 2, true),
    ('instagram', 'https://www.instagram.com/msangak27/', 'instagram', 3, true),
    ('whatsapp', 'https://wa.me/', 'message-circle', 4, false),
    ('telegram', 'https://t.me/', 'send', 5, false),
    ('linkedin', 'https://linkedin.com/in/', 'linkedin', 6, false),
    ('github', 'https://github.com/', 'github', 7, false),
    ('twitter', 'https://twitter.com/', 'twitter', 8, false);

-- Insert default section visibility
INSERT INTO public.section_visibility (section_key, is_visible, display_order) VALUES
    ('hero', true, 1),
    ('about', true, 2),
    ('skills', true, 3),
    ('projects', true, 4),
    ('blog', true, 5),
    ('contact', true, 6);

-- Insert skills
INSERT INTO public.skills (name_ar, name_en, name_de, category, icon, proficiency, display_order, is_visible) VALUES
    ('بايثون', 'Python', 'Python', 'programming', 'code', 85, 1, true),
    ('تطوير بوتات تيليجرام', 'Telegram Bot Development', 'Telegram-Bot-Entwicklung', 'programming', 'bot', 90, 2, true),
    ('تطوير الويب', 'Web Development', 'Webentwicklung', 'programming', 'globe', 75, 3, true),
    ('قواعد البيانات', 'Databases', 'Datenbanken', 'technical', 'database', 70, 4, true),
    ('إدارة المشاريع', 'Project Management', 'Projektmanagement', 'soft', 'briefcase', 80, 5, true),
    ('حل المشكلات', 'Problem Solving', 'Problemlösung', 'soft', 'lightbulb', 85, 6, true),
    ('التواصل', 'Communication', 'Kommunikation', 'soft', 'users', 80, 7, true);

-- Insert Projects

-- Project 1: Dentistry Bot
INSERT INTO public.projects (
    slug,
    title_ar, title_en, title_de,
    description_ar, description_en, description_de,
    content_ar, content_en, content_de,
    role_ar, role_en, role_de,
    highlights_ar, highlights_en, highlights_de,
    technologies,
    is_public_link, is_private, is_featured, is_visible, status, display_order
) VALUES (
    'dentistry-sohag-bot',
    'بوت كلية طب وجراحة الفم والأسنان بسوهاج',
    'Dentistry Faculty Sohag Bot',
    'Bot der Zahnmedizinischen Fakultät Sohag',
    'بوت تيليجرام متكامل لخدمة طلاب كلية طب وجراحة الفم والأسنان بجامعة سوهاج، يوفر وصولاً سهلاً للمحاضرات والملفات الدراسية.',
    'A comprehensive Telegram bot serving students of the Faculty of Dentistry at Sohag University, providing easy access to lectures and study materials.',
    'Ein umfassender Telegram-Bot für Studenten der Zahnmedizinischen Fakultät der Universität Sohag, der einfachen Zugang zu Vorlesungen und Studienmaterialien bietet.',
    '## نظرة عامة
بوت تيليجرام متطور يخدم طلاب كلية طب وجراحة الفم والأسنان بجامعة سوهاج.

## المميزات الرئيسية
- تسجيل دخول الطلاب باستخدام كود خاص
- تصفح المحاضرات والملفات حسب المادة
- دعم الملفات الصوتية والفيديو
- لوحة تحكم للمشرفين
- نظام البث والاستطلاعات
- نظام الشكاوى والاقتراحات
- إدارة صلاحيات المشرفين',
    '## Overview
An advanced Telegram bot serving students of the Faculty of Dentistry at Sohag University.

## Key Features
- Student login with special code
- Browse lectures and files by subject
- Audio and video file support
- Admin control panel
- Broadcast and polls system
- Complaints and suggestions system
- Admin permissions management',
    '## Überblick
Ein fortschrittlicher Telegram-Bot für Studenten der Zahnmedizinischen Fakultät der Universität Sohag.

## Hauptfunktionen
- Studentenanmeldung mit speziellem Code
- Vorlesungen und Dateien nach Fach durchsuchen
- Audio- und Videodatei-Unterstützung
- Admin-Kontrollpanel
- Broadcast- und Umfragesystem
- Beschwerde- und Vorschlagssystem
- Admin-Berechtigungsverwaltung',
    'المطور الرئيسي',
    'Lead Developer',
    'Hauptentwickler',
    '["نظام تسجيل دخول آمن للطلاب", "إدارة كاملة للمحتوى التعليمي", "نظام صلاحيات متعدد المستويات", "دعم البث الجماعي"]',
    '["Secure student login system", "Complete educational content management", "Multi-level permission system", "Mass broadcast support"]',
    '["Sicheres Studenten-Login-System", "Vollständige Bildungsinhaltverwaltung", "Mehrstufiges Berechtigungssystem", "Massenbroadcast-Unterstützung"]',
    '["Python", "Telegram Bot API", "JSON Storage", "File-ID Technique"]',
    false,
    true,
    true,
    true,
    'published',
    1
);

-- Project 2: MUE Medicine 2 Bot
INSERT INTO public.projects (
    slug,
    title_ar, title_en, title_de,
    description_ar, description_en, description_de,
    content_ar, content_en, content_de,
    role_ar, role_en, role_de,
    highlights_ar, highlights_en, highlights_de,
    technologies,
    project_url, is_public_link, is_private, is_featured, is_visible, status, display_order
) VALUES (
    'mue-medicine-bot',
    'بوت MUE Medicine 2',
    'MUE Medicine 2 Bot',
    'MUE Medicine 2 Bot',
    'بوت تيليجرام لخدمة طلاب الطب، يوفر وصولاً منظماً للمواد الدراسية والمحاضرات.',
    'A Telegram bot serving medical students, providing organized access to study materials and lectures.',
    'Ein Telegram-Bot für Medizinstudenten, der organisierten Zugang zu Studienmaterialien und Vorlesungen bietet.',
    '## نظرة عامة
بوت تيليجرام متخصص لخدمة طلاب كلية الطب.

## المميزات
- نظام تسجيل دخول بكود خاص
- تصنيف المحاضرات حسب المادة والسنة
- دعم متعدد أنواع الملفات
- لوحة تحكم للمشرفين
- نظام الإشعارات والبث',
    '## Overview
A specialized Telegram bot serving medical students.

## Features
- Login system with special code
- Lectures classified by subject and year
- Multi-file type support
- Admin control panel
- Notification and broadcast system',
    '## Überblick
Ein spezialisierter Telegram-Bot für Medizinstudenten.

## Funktionen
- Anmeldesystem mit speziellem Code
- Vorlesungen nach Fach und Jahr klassifiziert
- Unterstützung mehrerer Dateitypen
- Admin-Kontrollpanel
- Benachrichtigungs- und Broadcast-System',
    'المطور الرئيسي',
    'Lead Developer',
    'Hauptentwickler',
    '["واجهة سهلة الاستخدام", "نظام بحث متقدم", "إدارة مركزية للمحتوى"]',
    '["User-friendly interface", "Advanced search system", "Centralized content management"]',
    '["Benutzerfreundliche Oberfläche", "Erweitertes Suchsystem", "Zentralisierte Inhaltsverwaltung"]',
    '["Python", "Telegram Bot API", "JSON Storage"]',
    'https://t.me/mue_medicinebot',
    false,
    false,
    true,
    true,
    'published',
    2
);

-- Project 3: MUE Complaints System
INSERT INTO public.projects (
    slug,
    title_ar, title_en, title_de,
    description_ar, description_en, description_de,
    content_ar, content_en, content_de,
    role_ar, role_en, role_de,
    highlights_ar, highlights_en, highlights_de,
    technologies,
    is_public_link, is_private, is_featured, is_visible, status, display_order
) VALUES (
    'mue-complaints-system',
    'نظام الشكاوى والاقتراحات MUE',
    'MUE Complaints & Suggestions System',
    'MUE Beschwerde- und Vorschlagssystem',
    'نظام متكامل لإدارة شكاوى واقتراحات الطلاب مع لوحة تحكم ويب للمشرفين.',
    'A comprehensive system for managing student complaints and suggestions with an admin web dashboard.',
    'Ein umfassendes System zur Verwaltung von Studentenbeschwerden und Vorschlägen mit einem Admin-Web-Dashboard.',
    '## نظرة عامة
نظام متكامل يجمع بين بوت تيليجرام ولوحة تحكم ويب لإدارة شكاوى واقتراحات الطلاب.

## المميزات
- استقبال الشكاوى عبر البوت
- لوحة تحكم ويب للمشرفين
- تصفية وفرز حسب الطالب
- نظام الرد السريع
- دعم المرفقات
- تحكم كامل للمشرفين',
    '## Overview
A comprehensive system combining a Telegram bot and web dashboard for managing student complaints and suggestions.

## Features
- Receive complaints via bot
- Web admin dashboard
- Filter and sort by student
- Quick reply system
- Attachment support
- Full admin control',
    '## Überblick
Ein umfassendes System, das einen Telegram-Bot und ein Web-Dashboard zur Verwaltung von Studentenbeschwerden und Vorschlägen kombiniert.

## Funktionen
- Beschwerden über Bot empfangen
- Web-Admin-Dashboard
- Nach Student filtern und sortieren
- Schnellantwort-System
- Anhang-Unterstützung
- Volle Admin-Kontrolle',
    'المطور الرئيسي',
    'Lead Developer',
    'Hauptentwickler',
    '["لوحة تحكم ويب احترافية", "نظام إشعارات فوري", "تقارير وإحصائيات", "أمان عالي"]',
    '["Professional web dashboard", "Instant notification system", "Reports and statistics", "High security"]',
    '["Professionelles Web-Dashboard", "Sofortiges Benachrichtigungssystem", "Berichte und Statistiken", "Hohe Sicherheit"]',
    '["Python", "Flask", "HTML/CSS/JS", "Telegram Bot API"]',
    false,
    true,
    false,
    true,
    'published',
    3
);

-- Project 4: File Sharing App
INSERT INTO public.projects (
    slug,
    title_ar, title_en, title_de,
    description_ar, description_en, description_de,
    content_ar, content_en, content_de,
    role_ar, role_en, role_de,
    highlights_ar, highlights_en, highlights_de,
    technologies,
    is_public_link, is_private, is_featured, is_visible, status, display_order
) VALUES (
    'private-file-sharing',
    'نظام مشاركة الملفات الخاص',
    'Private File Sharing System',
    'Privates Dateifreigabesystem',
    'تطبيق ويب لمشاركة الملفات بشكل آمن مع نظام تتبع التحميلات.',
    'A web application for secure file sharing with download tracking system.',
    'Eine Webanwendung für sichere Dateifreigabe mit Download-Tracking-System.',
    '## نظرة عامة
تطبيق ويب خاص لمشاركة الملفات بين العميل والمستخدمين.

## المميزات
- رفع وتحميل الملفات بسهولة
- روابط مشاركة سهلة
- سجل تحميلات مفصل
- واجهة مستخدم بسيطة',
    '## Overview
A private web application for file sharing between client and users.

## Features
- Easy file upload and download
- Easy sharing links
- Detailed download log
- Simple user interface',
    '## Überblick
Eine private Webanwendung für die Dateifreigabe zwischen Client und Benutzern.

## Funktionen
- Einfaches Hochladen und Herunterladen von Dateien
- Einfache Freigabelinks
- Detailliertes Download-Protokoll
- Einfache Benutzeroberfläche',
    'المطور',
    'Developer',
    'Entwickler',
    '["نظام رفع ملفات متقدم", "تتبع التحميلات", "روابط مشاركة آمنة"]',
    '["Advanced upload system", "Download tracking", "Secure sharing links"]',
    '["Erweitertes Upload-System", "Download-Tracking", "Sichere Freigabelinks"]',
    '["Python", "Flask", "SQLite", "HTML/CSS"]',
    false,
    true,
    false,
    true,
    'published',
    4
);

-- Insert default settings
INSERT INTO public.settings (key, value, category) VALUES
    ('site_title', '{"ar": "محمد سيد سنجق", "en": "Mohamed Sayed Sangak", "de": "Mohamed Sayed Sangak"}', 'general'),
    ('site_description', '{"ar": "موقع شخصي لعرض المشاريع والمهارات", "en": "Personal website showcasing projects and skills", "de": "Persönliche Website zur Präsentation von Projekten und Fähigkeiten"}', 'general'),
    ('contact_email', '"mahmedsangak07@gmail.com"', 'contact'),
    ('enable_blog', 'true', 'features'),
    ('enable_contact_form', 'true', 'features'),
    ('enable_attachments', 'true', 'features'),
    ('animations_enabled', 'true', 'appearance'),
    ('animation_intensity', '"normal"', 'appearance'),
    ('dark_mode_default', 'true', 'appearance'),
    ('maintenance_mode', 'false', 'general');