// ============================================
// Contact Form API Route
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sanitizeInput, sanitizeEmail, sanitizePhone } from '@/lib/utils/sanitize';

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

async function verifyCaptcha(token: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) {
    // Skip verification in development
    console.warn('CAPTCHA verification skipped - no secret key');
    return true;
  }

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET,
        response: token,
      }),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('CAPTCHA verification error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract fields
    const name = sanitizeInput(formData.get('name') as string || '');
    const email = sanitizeEmail(formData.get('email') as string || '');
    const whatsapp = sanitizePhone(formData.get('whatsapp') as string || '');
    const preferredContact = formData.get('preferredContact') as string;
    const subject = sanitizeInput(formData.get('subject') as string || '');
    const message = sanitizeInput(formData.get('message') as string || '');
    const captchaToken = formData.get('captchaToken') as string;
    const attachment = formData.get('attachment') as File | null;

    // Validate required fields
    if (!name || !email || !whatsapp || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate preferred contact
    if (!['email', 'whatsapp'].includes(preferredContact)) {
      return NextResponse.json(
        { error: 'Invalid preferred contact method' },
        { status: 400 }
      );
    }

    // Verify CAPTCHA
    const isValidCaptcha = await verifyCaptcha(captchaToken);
    if (!isValidCaptcha) {
      return NextResponse.json(
        { error: 'CAPTCHA verification failed' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Handle attachment upload
    let attachmentUrl = null;
    let attachmentName = null;

    if (attachment && attachment.size > 0) {
      // Validate file size (5MB max)
      if (attachment.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'File too large (max 5MB)' },
          { status: 400 }
        );
      }

      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];

      if (!allowedTypes.includes(attachment.type)) {
        return NextResponse.json(
          { error: 'Invalid file type' },
          { status: 400 }
        );
      }

      // Upload to Supabase Storage
      const fileExt = attachment.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `contact/${fileName}`;

      const arrayBuffer = await attachment.arrayBuffer();
      const fileBuffer = new Uint8Array(arrayBuffer);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(filePath, fileBuffer, {
          contentType: attachment.type,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
      } else {
        const { data: urlData } = supabase.storage
          .from('attachments')
          .getPublicUrl(filePath);
        
        attachmentUrl = urlData.publicUrl;
        attachmentName = attachment.name;
      }
    }

    // Get IP and User Agent
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || '';

    // Insert message into database
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        whatsapp,
        preferred_contact: preferredContact,
        subject,
        message,
        attachment_url: attachmentUrl,
        attachment_name: attachmentName,
        ip_address: ip,
        user_agent: userAgent,
        status: 'new',
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, messageId: data.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}