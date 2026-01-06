'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login(email, password);
      toast.success('Login successful!');
      // Use replace instead of push to prevent back navigation to login
      router.replace('/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-xl animate-pulse animation-delay-200" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <GraduationCap className="w-10 h-10" />
            </div>
            <span className="text-3xl font-bold">School ERP</span>
          </div>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Transform Your<br />
            School Management
          </h1>

          <p className="text-xl text-white/80 max-w-md">
            Enterprise-grade school management system designed for modern educational institutions.
            Streamline administration, enhance communication, and improve outcomes.
          </p>

          {/* Features */}
          <div className="mt-12 space-y-4">
            {[
              'Multi-tenant architecture',
              'Role-based access control',
              'Real-time analytics',
              'Secure & OWASP compliant',
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="p-2 bg-primary rounded-xl">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold">School ERP</span>
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">Welcome Back</h2>
            <p className="text-muted-foreground mt-2">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 text-destructive">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className={cn(
                    "w-full pl-10 pr-4 py-3 rounded-lg border bg-background",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                    "transition-all duration-200"
                  )}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className={cn(
                    "w-full pl-10 pr-12 py-3 rounded-lg border bg-background",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                    "transition-all duration-200"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-3 px-4 rounded-lg font-medium text-white",
                "bg-primary hover:bg-primary/90 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center justify-center gap-2"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium text-foreground mb-3">🚀 Quick Demo Login:</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  const { setUser } = useAuthStore.getState();
                  setUser({
                    id: 'SUPER001',
                    email: 'superadmin@schoolerp.com',
                    firstName: 'Super',
                    lastName: 'Admin',
                    role: 'SUPER_ADMIN',
                    tenantId: null,
                    permissions: ['*'],
                    isEmailVerified: true,
                    phone: '+91 99999 99999',
                    tenant: null
                  });
                  toast.success('Logged in as Super Admin (Demo)');
                  router.replace('/dashboard');
                }}
                className="w-full py-2.5 border-2 border-border bg-background hover:bg-muted rounded-lg text-sm font-medium transition-colors"
              >
                🔑 Login as Super Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  const { setUser } = useAuthStore.getState();
                  setUser({
                    id: 'ADM001',
                    email: 'admin@demo-school.edu',
                    firstName: 'School',
                    lastName: 'Admin',
                    role: 'SCHOOL_ADMIN',
                    tenantId: 'tenant-1',
                    permissions: ['school:*'],
                    isEmailVerified: true,
                    phone: '+91 98888 88888',
                    tenant: { id: 't1', name: 'Demo School', code: 'DS', isActive: true }
                  });
                  toast.success('Logged in as School Admin (Demo)');
                  router.replace('/dashboard');
                }}
                className="w-full py-2.5 border-2 border-border bg-background hover:bg-muted rounded-lg text-sm font-medium transition-colors"
              >
                🏫 Login as School Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  const { setUser } = useAuthStore.getState();
                  setUser({
                    id: 'TCH001',
                    email: 'sarah.wilson@school.edu',
                    firstName: 'Sarah',
                    lastName: 'Wilson',
                    role: 'TEACHER',
                    tenantId: 'tenant-1',
                    permissions: [],
                    isEmailVerified: true,
                    phone: '+91 98765 00000',
                    tenant: { id: 't1', name: 'Demo School', code: 'DS', isActive: true }
                  });
                  toast.success('Logged in as Teacher (Demo)');
                  router.replace('/dashboard');
                }}
                className="w-full py-2.5 border-2 border-border bg-background hover:bg-muted rounded-lg text-sm font-medium transition-colors"
              >
                👨‍🏫 Login as Teacher
              </button>
              <button
                type="button"
                onClick={() => {
                  const { setUser } = useAuthStore.getState();
                  setUser({
                    id: 'STU001',
                    email: 'arjun.sharma@school.edu',
                    firstName: 'Arjun',
                    lastName: 'Sharma',
                    role: 'STUDENT',
                    tenantId: 'tenant-1',
                    permissions: [],
                    isEmailVerified: true,
                    phone: '+91 98765 43210',
                    tenant: { id: 't1', name: 'Demo School', code: 'DS', isActive: true }
                  });
                  toast.success('Logged in as Student (Demo)');
                  router.replace('/dashboard');
                }}
                className="w-full py-2.5 border-2 border-border bg-background hover:bg-muted rounded-lg text-sm font-medium transition-colors"
              >
                🎓 Login as Student
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                💡 Click any button above for instant demo access (no password needed)
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} School ERP. All rights reserved.
        </p>
      </div>
    </div>
  );
}
