import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../lib';

export const LoginPage: React.FC = () => {
  const { signIn, signUp, loading, error, user } = useAuthContext();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'student' | 'mentor'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'student' || user.role === 'admin') {
        navigate('/student/dashboard');
      } else if (user.role === 'mentor') {
        navigate('/mentor/dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      if (isLogin) {
        const result = await signIn(formData.email, formData.password);
        if (result.error) {
          console.error('Sign in error:', result.error);
        } else {
          // Navigation will be handled by useEffect above
        }
      } else {
        const result = await signUp(formData.email, formData.password);
        if (result.error) {
          console.error('Sign up error:', result.error);
        } else {
          alert('Please check your email for verification link');
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center transition-colors duration-200 bg-gray-100">
      <div className="max-w-md w-full mx-4 p-8 rounded-xl shadow-lg border transition-colors duration-200 bg-white border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">10MS</span>
          </div>
          <h1 className="text-2xl font-bold transition-colors duration-200 text-gray-900">
            10MS SheSTEM
          </h1>
          <p className="text-sm mt-2 transition-colors duration-200 text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Role Toggle */}
        <div className="mb-6">
          <div className="flex rounded-lg p-1 transition-colors duration-200 bg-gray-100">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                role === 'student'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('mentor')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                role === 'mentor'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mentor
            </button>
          </div>
        </div>



        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error.message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-2 transition-colors duration-200 text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2 transition-colors duration-200 text-gray-700">
              Email Address
            </label>
                          <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 transition-colors duration-200 text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-2 transition-colors duration-200 text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                placeholder="Confirm your password"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        {/* Toggle Login/Signup */}
        <div className="mt-6 text-center">
          <p className="text-sm transition-colors duration-200 text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};