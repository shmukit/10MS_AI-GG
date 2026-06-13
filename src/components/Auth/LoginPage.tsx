import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../lib';
import { posthog } from '../../lib/posthog';
import { MotionDiv, SHAKE_VARIANTS } from '../ui/MotionPrimitives';
import { AppLogo } from '../Logo/AppLogo';
import { Button } from '../ui/Button';
import { CardAlert } from '../ui/Card';

export const LoginPage: React.FC = () => {
  const { signIn, signUp, loading, error, user } = useAuthContext();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) navigate('/student/dashboard');
  }, [user, navigate]);

  useEffect(() => {
    posthog?.capture('$pageview', { page: isLogin ? 'login' : 'signup' });
  }, [isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        posthog?.capture('login_attempt', { email: formData.email });
        const result = await signIn(formData.email, formData.password);
        if (result.success) {
          posthog?.capture('login_success', { email: formData.email });
          posthog?.identify(formData.email, { email: formData.email });
        } else {
          posthog?.capture('login_failed', { email: formData.email, error: result.error });
        }
      } else {
        posthog?.capture('signup_attempt', { email: formData.email, name: formData.name });
        const result = await signUp(formData.email, formData.password, formData.name);
        if (result.success) {
          posthog?.capture('signup_success', { email: formData.email, name: formData.name });
          posthog?.identify(formData.email, { email: formData.email, name: formData.name });
        } else {
          posthog?.capture('signup_failed', { email: formData.email, error: result.error });
        }
      }
    } catch (err) {
      posthog?.capture('auth_error', {
        action: isLogin ? 'login' : 'signup',
        email: formData.email,
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClass =
    'w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15 transition-all';

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <MotionDiv className="max-w-md w-full mx-4" initial="hidden" animate="visible">
        <div className="bg-card border border-border rounded-2xl px-8 py-10">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <AppLogo layout="full" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-sm mt-1 text-muted-foreground">
              {isLogin ? 'Sign in to continue to AI-GG' : 'Join the SheSTEM learning community'}
            </p>
          </div>

          {error && (
            <MotionDiv className="mb-5" variants={SHAKE_VARIANTS} initial="initial" animate="animate">
              <CardAlert>
                <p className="text-sm text-destructive">{error.message}</p>
              </CardAlert>
            </MotionDiv>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="auth-name" className="block text-xs font-medium text-foreground mb-1.5">
                  Full Name
                </label>
                <input
                  id="auth-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="Enter your full name"
                  required
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-xs font-medium text-foreground mb-1.5">
                Email Address
              </label>
              <input
                id="auth-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="Enter your email"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-xs font-medium text-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`${inputClass} pr-11`}
                  placeholder="Enter your password"
                  required
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground bg-transparent border-none cursor-pointer p-0"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="auth-confirm" className="block text-xs font-medium text-foreground mb-1.5">
                  Confirm Password
                </label>
                <input
                  id="auth-confirm"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="Confirm your password"
                  required
                  autoComplete="new-password"
                />
              </div>
            )}

            <Button type="submit" disabled={loading} isLoading={loading} className="w-full mt-2">
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#149353] font-semibold bg-transparent border-none cursor-pointer p-0 hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </MotionDiv>
    </div>
  );
};
