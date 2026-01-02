// ============================================
// Sanitization Utilities
// ============================================

// Simple HTML escape for preventing XSS
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

// Sanitize user input
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .slice(0, 10000); // Limit length
}

// Sanitize email
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase().slice(0, 255);
}

// Sanitize phone number (keep only digits and +)
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, '').slice(0, 20);
}

// Generate slug from text
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\u0600-\u06FF-]/g, '') // Keep Arabic characters
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}