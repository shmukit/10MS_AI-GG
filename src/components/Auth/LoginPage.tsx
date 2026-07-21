import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../lib';
import { posthog } from '../../lib/posthog';
import { MotionDiv, SHAKE_VARIANTS } from '../ui/MotionPrimitives';
import { AppLogo } from '../Logo/AppLogo';
import { Button } from '../ui/Button';
import { CardAlert } from '../ui/Card';

export const LoginPage: React.FC = () => {
  const { signIn, signUp, loading, error, user, roleLoading } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname !== '/signup');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  useEffect(() => {
    setIsLogin(location.pathname !== '/signup');
  }, [location.pathname]);

  // Always land on student dashboard after auth — role switching is via profile menu
  useEffect(() => {
    if (!user || roleLoading) return;
    navigate('/student/dashboard');
  }, [user, roleLoading, navigate]);

  useEffect(() => {
    posthog?.capture('$pageview', { page: isLogin ? 'login' : 'signup' });
  }, [isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmPasswordError(null);

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

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
    if (e.target.name === 'confirmPassword' || e.target.name === 'password') {
      setConfirmPasswordError(null);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setConfirmPasswordError(null);
    navigate(isLogin ? '/signup' : '/login', { replace: true });
  };

  const inputClass =
    'w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15 transition-all';

  const formPanel = (
    <MotionDiv className="max-w-md w-full mx-4 md:mx-0" initial="hidden" animate="visible">
      <div className="bg-card border border-border rounded-2xl px-8 py-10">
        <div className="text-center mb-8 md:hidden">
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

        <div className="hidden md:block mb-8">
          <h1 className="text-xl font-semibold text-foreground">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm mt-1 text-muted-foreground">
            {isLogin ? 'Sign in to continue to AI-GG' : 'Join the SheSTEM learning community'}
          </p>
        </div>

        {(error || confirmPasswordError) && (
          <MotionDiv className="mb-5" variants={SHAKE_VARIANTS} initial="initial" animate="animate">
            <CardAlert>
              <p className="text-sm text-destructive">{confirmPasswordError || error?.message}</p>
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
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="auth-password" className="block text-xs font-medium text-foreground">
                Password
              </label>
              {isLogin && (
                <a
                  href="#forgot"
                  className="text-xs text-primary hover:underline"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot password?
                </a>
              )}
            </div>
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
            onClick={toggleMode}
            className="text-primary font-semibold bg-transparent border-none cursor-pointer p-0 hover:underline"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </MotionDiv>
  );

  return (
    <div className="min-h-screen flex bg-muted">
      <div className="hidden md:flex md:w-1/2 lg:w-[45%] flex-col justify-center items-center px-12 bg-card border-r border-border">
        <AppLogo layout="full" />
        <h2 className="mt-8 text-2xl font-bold text-foreground text-center">
          Master Your Career with Expert-led Roadmaps
        </h2>
        <p className="mt-3 text-sm text-muted-foreground text-center max-w-sm leading-relaxed">
          Join the SheSTEM learning community and get mentored by industry experts.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center py-10">
        {formPanel}
      </div>
    </div>
  );
};
