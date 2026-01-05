import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../lib';
import { posthog } from '../../lib/posthog';
import { MotionDiv, HoverScale, HoverLift, SHAKE_VARIANTS } from '../ui/MotionPrimitives';

export const LoginPage: React.FC = () => {
  const { signIn, signUp, loading, error, user } = useAuthContext();
  const navigate = useNavigate();
  // const posthog = usePostHog();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  // Redirect if already logged in - All users go to student dashboard
  useEffect(() => {
    if (user) {
      navigate('/student/dashboard');
    }
  }, [user, navigate]);

  // Track page view
  useEffect(() => {
    posthog?.capture('$pageview', {
      page: isLogin ? 'login' : 'signup'
    });
  }, [posthog, isLogin]);



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
          if (result.requiresEmailConfirmation) {
            posthog?.capture('email_confirmation_required', { email: formData.email });
          }
        } else {
          posthog?.capture('signup_failed', { email: formData.email, error: result.error });
        }
      }
    } catch (error) {
      posthog?.capture('auth_error', {
        action: isLogin ? 'login' : 'signup',
        email: formData.email,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center transition-colors duration-200 bg-gray-100 dark:bg-zinc-900">
      <MotionDiv
        className="max-w-md w-full mx-4 p-8 rounded-xl shadow-lg border transition-colors duration-200 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <HoverLift className="inline-block">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
              <span className="text-white font-bold text-lg">10MS</span>
            </div>
          </HoverLift>
          <h1 className="text-2xl font-bold transition-colors duration-200 text-gray-900 dark:text-gray-100">
            10MS SheSTEM
          </h1>
          <p className="text-sm mt-2 transition-colors duration-200 text-gray-600 dark:text-gray-400">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <MotionDiv
            className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg"
            variants={SHAKE_VARIANTS}
            initial="initial"
            animate="animate"
          >
            {error.message}
          </MotionDiv>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <MotionDiv delay={0.1}>
              <label className="block text-sm font-medium mb-2 transition-colors duration-200 text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-gray-100 placeholder-gray-500"
                placeholder="Enter your full name"
                required
              />
            </MotionDiv>
          )}

          <MotionDiv delay={0.15}>
            <label className="block text-sm font-medium mb-2 transition-colors duration-200 text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-gray-100 placeholder-gray-500"
              placeholder="Enter your email"
              required
            />
          </MotionDiv>

          <MotionDiv delay={0.2}>
            <label className="block text-sm font-medium mb-2 transition-colors duration-200 text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-gray-100 placeholder-gray-500"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </MotionDiv>

          {!isLogin && (
            <MotionDiv delay={0.25}>
              <label className="block text-sm font-medium mb-2 transition-colors duration-200 text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-gray-100 placeholder-gray-500"
                placeholder="Confirm your password"
                required
              />
            </MotionDiv>
          )}

          <HoverScale>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20"
            >
              {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </HoverScale>
        </form>

        {/* Toggle Login/Signup */}
        <MotionDiv className="mt-6 text-center" delay={0.3}>
          <p className="text-sm transition-colors duration-200 text-gray-600 dark:text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-blue-600 hover:text-blue-700 dark:hover:text-blue-400 font-medium"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </MotionDiv>


      </MotionDiv>
    </div>
  );
};