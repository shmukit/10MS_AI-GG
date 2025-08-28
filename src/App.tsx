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

// Simplified Protected Route Component - No role checking
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthContext();
  
  console.log('🔒 ProtectedRoute - User:', user, 'Loading:', loading);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    console.log('🔒 No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('🔒 Access granted');
  return <>{children}</>;
};

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
      <Route path="/profile" element={<StudentProfile />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

// Simplified App Routes - All users go to student dashboard
const AppRoutes = () => {
  const { user, loading } = useAuthContext();
  
  // Test database connection
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🔧 Initializing app...');
        
        // Test database connection
        console.log('Testing Supabase connection...');
        const { error } = await supabase.from('users').select('count').limit(1);
        if (error) {
          console.error('Database connection failed:', error);
        } else {
          console.log('✅ Database connection successful!');
        }
      } catch (err) {
        console.error('App initialization error:', err);
      }
    };
    
    initializeApp();
  }, []);

  console.log('🔍 AppRoutes - User:', user, 'Loading:', loading);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    console.log('🔍 No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // All authenticated users go to student dashboard by default
  console.log('🔍 User logged in, redirecting to student dashboard');
  return <Navigate to="/student/dashboard" replace />;
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
            
            {/* Student Routes - All authenticated users can access */}
            <Route 
              path="/student/*" 
              element={
                <ProtectedRoute>
                  <StudentRoutes />
                </ProtectedRoute>
              } 
            />
            
            {/* Mentor Routes - Hidden but accessible to all authenticated users */}
            <Route 
              path="/mentor/*" 
              element={
                <ProtectedRoute>
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