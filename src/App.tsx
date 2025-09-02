import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './lib';
import { ThemeProvider } from './lib/ThemeContext';

// Critical components (loaded immediately for first paint)
import { LoginPage } from './components/Auth/LoginPage';

// Lazy load non-critical components
const StudentDashboard = lazy(() => import('./components/Student/StudentDashboard').then(module => ({ default: module.StudentDashboard })));
const StudentProfile = lazy(() => import('./components/Student/StudentProfile').then(module => ({ default: module.StudentProfile })));
const StudentCommunity = lazy(() => import('./components/Student/StudentCommunity').then(module => ({ default: module.StudentCommunity })));
const MentorDashboard = lazy(() => import('./components/Mentor/MentorDashboard').then(module => ({ default: module.MentorDashboard })));
const MentorRoadmaps = lazy(() => import('./components/Mentor/MentorRoadmaps').then(module => ({ default: module.MentorRoadmaps })));
const MentorStudents = lazy(() => import('./components/Mentor/MentorStudents').then(module => ({ default: module.MentorStudents })));
const MentorNotices = lazy(() => import('./components/Mentor/MentorNotices').then(module => ({ default: module.MentorNotices })));
const MentorSettings = lazy(() => import('./components/Mentor/MentorSettings').then(module => ({ default: module.MentorSettings })));
const RoadmapInterface = lazy(() => import('./components/Roadmap/RoadmapInterface').then(module => ({ default: module.RoadmapInterface })));

// Loading component for lazy-loaded routes
const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
      <p className="text-sm text-gray-600">Loading...</p>
    </div>
  </div>
);

// Simplified Protected Route Component - No role checking
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthContext();
  
  console.log('🔄 ProtectedRoute: user =', user?.email || 'no user', 'loading =', loading);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    console.log('🔄 ProtectedRoute: No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('🔄 ProtectedRoute: User authenticated, rendering children');
  return <>{children}</>;
};

// Student Routes Component
const StudentRoutes = () => {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/roadmap" element={<RoadmapInterface onBack={() => window.history.back()} />} />
        <Route path="/roadmap/:roadmapSlug" element={<RoadmapInterface onBack={() => window.history.back()} />} />
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/community" element={<StudentCommunity />} />
        <Route path="/community/:roadmapSlug" element={<StudentCommunity />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

// Mentor Routes Component
const MentorRoutes = () => {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route path="/dashboard" element={<MentorDashboard />} />
        <Route path="/roadmaps" element={<MentorRoadmaps />} />
        <Route path="/students" element={<MentorStudents />} />
        <Route path="/notices" element={<MentorNotices />} />
        <Route path="/settings" element={<MentorSettings />} />
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

// Simplified App Routes - All users go to student dashboard
const AppRoutes = () => {
  const { user, loading } = useAuthContext();

  console.log('🔄 AppRoutes: user =', user?.email || 'no user', 'loading =', loading);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    console.log('🔄 AppRoutes: No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // All authenticated users go to student dashboard by default
  console.log('🔄 AppRoutes: User authenticated, redirecting to student dashboard');
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