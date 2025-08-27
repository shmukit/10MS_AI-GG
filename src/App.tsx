import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './lib';
import { supabase } from './lib/supabase';
import { ThemeProvider } from './lib/ThemeContext';

// Import components
import { LoginPage } from './components/Auth/LoginPage';
import { StudentDashboard } from './components/Student/StudentDashboard';

import { StudentProfile } from './components/Student/StudentProfile';
import { StudentCommunity } from './components/Student/StudentCommunity';
import { MentorDashboard } from './components/Mentor/MentorDashboard';
import { MentorRoadmaps } from './components/Mentor/MentorRoadmaps';
import { MentorStudents } from './components/Mentor/MentorStudents';
import { MentorNotices } from './components/Mentor/MentorNotices';
import { MentorSettings } from './components/Mentor/MentorSettings';
import { RoadmapInterface } from './components/Roadmap/RoadmapInterface';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  const { user, loading, userRole } = useAuthContext();
  
  console.log('🔒 ProtectedRoute - User:', user, 'Loading:', loading, 'User Role:', userRole, 'Allowed roles:', allowedRoles);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    console.log('🔒 No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has required role - use database role, not form selection
  const role = userRole || 'student'; // Use database role, fallback to student
  console.log('🔒 User role (database):', userRole, 'Final role:', role, 'Allowed roles:', allowedRoles);
  
  if (!allowedRoles.includes(role)) {
    console.log('🔒 Access denied, redirecting to unauthorized');
    console.log('🔒 Role check failed: role =', role, 'allowedRoles =', allowedRoles, 'includes =', allowedRoles.includes(role));
    return <Navigate to="/unauthorized" replace />;
  }
  
  console.log('🔒 Access granted');
  return <>{children}</>;
};

// Unauthorized Page Component
const UnauthorizedPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
      <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
      <div className="space-y-3">
        <a 
          href="/login"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-3 no-underline"
        >
          Go to Login
        </a>
        <button 
          onClick={() => window.history.back()} 
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
);

// Student Routes Component
const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<StudentDashboard />} />
      <Route path="/roadmap" element={<RoadmapInterface onBack={() => window.history.back()} />} />
      <Route path="/roadmap/:roadmapSlug" element={<RoadmapInterface onBack={() => window.history.back()} />} />
      <Route path="/profile" element={<StudentProfile />} />
      <Route path="/community" element={<StudentCommunity />} />
      <Route path="/community/:roadmapSlug" element={<StudentCommunity />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

// Mentor Routes Component
const MentorRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<MentorDashboard />} />
      <Route path="/roadmaps" element={<MentorRoadmaps />} />
      <Route path="/students" element={<MentorStudents />} />
      <Route path="/notices" element={<MentorNotices />} />
      <Route path="/settings" element={<MentorSettings />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

// Main App Routes
const AppRoutes = () => {
  const { user, loading, userRole } = useAuthContext();
  
  // Test database connection and cleanup duplicate profiles
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🔧 Initializing app...');
        
        // Test database connection
        console.log('Testing Supabase connection...');
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error) {
          console.error('Database connection failed:', error);
        } else {
          console.log('✅ Database connection successful!');
          
          // If user is logged in, run system-wide cleanup
          if (user?.id) {
            console.log('🧹 Running system-wide cleanup of duplicate profiles...');
            try {
              const { DatabaseService } = await import('./services/database');
              await DatabaseService.cleanupAllDuplicateProfiles();
            } catch (cleanupErr) {
              console.error('Cleanup error:', cleanupErr);
            }
          }
        }
      } catch (err) {
        console.error('App initialization error:', err);
      }
    };
    
    initializeApp();
  }, [user?.id]);

  console.log('🔍 AppRoutes - User:', user, 'Loading:', loading);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    console.log('🔍 No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check user role and redirect accordingly
  const role = userRole || 'student'; // Use database role, fallback to student
  
  console.log('🔍 User logged in with database role:', role);
  
  if (role === 'mentor' || role === 'admin') {
    return <Navigate to="/mentor/dashboard" replace />;
  } else {
    return <Navigate to="/student/dashboard" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Student Routes */}
            <Route 
              path="/student/*" 
              element={
                <ProtectedRoute allowedRoles={['student', 'mentor', 'admin']}>
                  <StudentRoutes />
                </ProtectedRoute>
              } 
            />
            
            {/* Mentor Routes */}
            <Route 
              path="/mentor/*" 
              element={
                <ProtectedRoute allowedRoles={['mentor', 'admin']}>
                  <MentorRoutes />
                </ProtectedRoute>
              } 
            />
            
            {/* Default Route */}
            <Route path="/" element={<AppRoutes />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;