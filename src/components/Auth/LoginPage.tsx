import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../lib';
import { posthog } from '../../lib/posthog';
import { MotionDiv, SHAKE_VARIANTS } from '../ui/MotionPrimitives';
import { AppLogo } from '../Logo/AppLogo';

/**
 * LoginPage — 10MS Design System compliant.
 *
 * Input spec (DESIGN.md §5 Input Fields):
 *   Default: 1px border #D1D5DB, radius 12px, placeholder #6B7280
 *   Focus:   2px border #1CAB55, box-shadow 0 0 0 3px rgba(28,171,85,0.10)
 *   Error:   2px border #DC2626
 *   Disabled: bg #F3F4F6, border #E5E7EB, text #D1D5DB
 */

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

  // 10MS input style — applied via inline handlers to satisfy focus spec exactly
  const inputBaseStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,             // 10MS input radius
    border: '1px solid #D1D5DB', // outline-variant at rest
    background: 'var(--card)',
    color: 'var(--c-text, #111827)',
    fontSize: 13,
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    transition: 'border-color 150ms, box-shadow 150ms',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = '#1CAB55';
    e.currentTarget.style.borderWidth = '2px';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(28,171,85,0.10)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = '#D1D5DB';
    e.currentTarget.style.borderWidth = '1px';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center transition-colors duration-200"
      style={{ background: 'var(--c-surface-subtle, #F3F4F6)' }}
    >
      <MotionDiv
        className="max-w-md w-full mx-4"
        initial="hidden"
        animate="visible"
      >
        {/* Card — flat by default, border only */}
        <div
          style={{
            background: 'var(--card, #FFFFFF)',
            border: '1px solid var(--border, #E5E7EB)',
            borderRadius: 16,
            padding: '40px 32px',
          }}
        >
          {/* Header — AppLogo + title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <AppLogo layout="full" />
            </div>
            <h1
              className="text-xl font-semibold"
              style={{ color: 'var(--c-text, #111827)', fontFamily: 'Inter, sans-serif' }}
            >
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}
            >
              {isLogin
                ? 'Sign in to continue to AI-GG'
                : 'Join the SheSTEM learning community'}
            </p>
          </div>

          {/* Error alert — 10MS alert card spec */}
          {error && (
            <MotionDiv
              className="mb-5"
              variants={SHAKE_VARIANTS}
              initial="initial"
              animate="animate"
            >
              <div
                style={{
                  padding: '12px 16px',
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: 12,
                  color: '#DC2626',
                  fontSize: 13,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {error.message}
              </div>
            </MotionDiv>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (signup only) */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="auth-name"
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: 6,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Full Name
                </label>
                <input
                  id="auth-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={inputBaseStyle}
                  placeholder="Enter your full name"
                  required
                  autoComplete="name"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="auth-email"
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: 6,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Email Address
              </label>
              <input
                id="auth-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={inputBaseStyle}
                placeholder="Enter your email"
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="auth-password"
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: 6,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={{ ...inputBaseStyle, paddingRight: 44 }}
                  placeholder="Enter your password"
                  required
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 14, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#6B7280', padding: 0,
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password (signup only) */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="auth-confirm"
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: 6,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Confirm Password
                </label>
                <input
                  id="auth-confirm"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={inputBaseStyle}
                  placeholder="Confirm your password"
                  required
                  autoComplete="new-password"
                />
              </div>
            )}

            {/* Submit — 10MS primary button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 28px',
                borderRadius: 999,              // pill
                background: loading ? '#E5E7EB' : '#1CAB55',
                color: loading ? '#D1D5DB' : '#FFFFFF',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 150ms, transform 180ms, box-shadow 180ms',
                marginTop: 8,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = '#17994B';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = loading ? '#E5E7EB' : '#1CAB55';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {loading ? 'Please wait…' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <p
            className="mt-6 text-center text-sm"
            style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}
          >
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            {' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#149353',           // green-link
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                padding: 0,
              }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </MotionDiv>
    </div>
  );
};