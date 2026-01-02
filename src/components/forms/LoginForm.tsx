// ============================================
// Admin Login Form Component
// ============================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, AlertCircle, Shield } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Captcha } from '@/components/common/Captcha';
import { useAuth } from '@/lib/hooks/useAuth';

export function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!captchaToken && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      setError('Please complete the verification');
      return;
    }

    setIsLoading(true);

    try {
      // Verify captcha on server
      if (captchaToken) {
        const captchaResponse = await fetch('/api/verify-captcha', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: captchaToken }),
        });

        if (!captchaResponse.ok) {
          throw new Error('CAPTCHA verification failed');
        }
      }

      // Sign in
      await signIn(email, password);
      
      // Redirect to dashboard
      router.push('/admin/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      
      if (err.message?.includes('Invalid login')) {
        setError('Invalid email or password');
      } else if (err.message?.includes('CAPTCHA')) {
        setError('CAPTCHA verification failed. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25"
        >
          <Shield className="h-8 w-8 text-white" />
        </motion.div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Admin Login</h1>
        <p className="text-muted-foreground">
          Sign in to access the admin panel
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        {/* Email */}
        <Input
          type="email"
          label="Email Address"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="h-5 w-5" />}
          required
        />

        {/* Password */}
        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="h-5 w-5" />}
          required
        />

        {/* CAPTCHA */}
        <Captcha
          onVerify={setCaptchaToken}
          onExpire={() => setCaptchaToken('')}
          onError={() => setError('CAPTCHA error. Please refresh and try again.')}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          isLoading={isLoading}
          leftIcon={<LogIn className="h-5 w-5" />}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      {/* Security Notice */}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        This is a protected area. All login attempts are logged.
      </p>
    </motion.div>
  );
}