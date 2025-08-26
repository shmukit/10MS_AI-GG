import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './lib';
import { supabase } from './lib/supabase';

// Import components
import { LoginPage } from './components/Auth/LoginPage';
import { StudentDashboard } from './components/Student/StudentDashboard';
import { StudentRoadmap } from './components/Student/StudentRoadmap';
import { StudentProfile } from './components/Student/StudentProfile';
import { StudentCommunity } from './components/Student/StudentCommunity';
import { MentorDashboard } from './components/Mentor/MentorDashboard';
import { MentorRoadmaps } from './components/Mentor/MentorRoadmaps';
import { MentorStudents } from './components/Mentor/MentorStudents';
import { MentorNotices } from './components/Mentor/MentorNotices';
import { MentorSettings } from './components/Mentor/MentorSettings';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  const { user, loading } = useAuthContext();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has required role (safely handle undefined role)
  const userRole = user.role || 'student'; // Default to student if no role
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};

// Unauthorized Page Component
const UnauthorizedPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
      <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
      <button 
        onClick={() => window.history.back()} 
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Go Back
      </button>
    </div>
  </div>
);

// Student Routes Component
const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<StudentDashboard />} />
      <Route path="/roadmap" element={<StudentRoadmap />} />
      <Route path="/roadmap/:roadmapSlug" element={<StudentRoadmap />} />
      <Route path="/profile" element={<StudentProfile />} />
      <Route path="/community" element={<StudentCommunity />} />
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
  const { user, loading } = useAuthContext();
  
  // Test database connection
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing Supabase connection...');
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error) {
          console.error('Database connection failed:', error);
        } else {
          console.log('✅ Database connection successful!');
        }
      } catch (err) {
        console.error('Connection test error:', err);
      }
    };
    
    testConnection();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role (safely handle undefined role)
  const userRole = user.role || 'student'; // Default to student if no role
  
  if (userRole === 'student' || userRole === 'admin') {
    return <Navigate to="/student/dashboard" replace />;
  } else if (userRole === 'mentor') {
    return <Navigate to="/mentor/dashboard" replace />;
  }

  // Fallback for unknown roles
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
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
              <ProtectedRoute allowedRoles={['student', 'admin']}>
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
    </AuthProvider>
  );
}

export default App;