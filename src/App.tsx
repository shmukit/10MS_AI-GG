import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuthContext } from './lib';
import { ThemeProvider } from './lib/ThemeContext';
import { ToastProvider } from './components/ui/ToastProvider';
import { ConfirmProvider } from './components/ui/ConfirmProvider';
// import { PostHogProvider } from 'posthog-js/react';
// import { posthog } from './lib/posthog';
import { PageTransition } from './components/ui/MotionPrimitives';

// Critical components (loaded immediately for first paint)
import { LoginPage } from './components/Auth/LoginPage';
import { MarketingPage } from './components/Marketing/MarketingPage';
import { StyleLabPage } from './components/StyleLab/StyleLabPage';

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
const AgenticDecisionTreePage = lazy(() => import('./components/Playbooks/AgenticDecisionTreePage').then(module => ({ default: module.AgenticDecisionTreePage })));
const AdminLayout = lazy(() => import('./components/Admin/AdminLayout').then(module => ({ default: module.AdminLayout })));
const AdminDashboard = lazy(() => import('./components/Admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const AdminUsers = lazy(() => import('./components/Admin/AdminUsers').then(module => ({ default: module.AdminUsers })));
const AdminSettings = lazy(() => import('./components/Admin/AdminSettings').then(module => ({ default: module.AdminSettings })));
const CapabilitiesTable = lazy(() => import('./components/Admin/CapabilitiesTable').then(module => ({ default: module.CapabilitiesTable })));
const PublicCertificatePage = lazy(() => import('./components/Public/PublicCertificatePage').then(module => ({ default: module.PublicCertificatePage })));

// Loading component for lazy-loaded routes
const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Role-protected route — checks users.role (+ mentor profile) via accessibleRoles
const ProtectedRouteWithRole = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user, loading, userRole, accessibleRoles, roleLoading } = useAuthContext();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    console.log('🔄 ProtectedRoute: No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Only block on first role resolution — not on background token refresh
  if (roleLoading && !userRole) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const roles = accessibleRoles?.length
    ? accessibleRoles
    : (userRole ? [userRole] : ['student']);
  const allowed = roles.some((r) => allowedRoles.includes(r));

  if (!allowed) {
    console.log(`⛔ Access denied. User platforms: ${roles.join(', ')}. Allowed: ${allowedRoles.join(', ')}`);
    if (roles.includes('admin')) return <Navigate to="/admin/dashboard" replace />;
    if (roles.includes('mentor')) return <Navigate to="/mentor/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  }

  return <>{children}</>;
};

// Student Routes Component
import { StudentLayout } from './components/Layout/StudentLayout';

const StudentRoutes = () => {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route element={<StudentLayout />}>
          <Route path="/dashboard" element={<PageTransition><StudentDashboard /></PageTransition>} />
          <Route path="/roadmap" element={<PageTransition><RoadmapInterface onBack={() => window.history.back()} /></PageTransition>} />
          <Route path="/roadmap/:roadmapSlug" element={<PageTransition><RoadmapInterface onBack={() => window.history.back()} /></PageTransition>} />
          <Route path="/playbooks/agentic-decision" element={<PageTransition><AgenticDecisionTreePage /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><StudentProfile /></PageTransition>} />
          <Route path="/community" element={<PageTransition><StudentCommunity /></PageTransition>} />
          <Route path="/community/:roadmapSlug" element={<PageTransition><StudentCommunity /></PageTransition>} />
        </Route>
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
        <Route path="/dashboard" element={<PageTransition><MentorDashboard /></PageTransition>} />
        <Route path="/roadmaps" element={<PageTransition><MentorRoadmaps /></PageTransition>} />
        <Route path="/students" element={<PageTransition><MentorStudents /></PageTransition>} />
        <Route path="/notices" element={<PageTransition><MentorNotices /></PageTransition>} />
        <Route path="/settings" element={<PageTransition><MentorSettings /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><StudentProfile /></PageTransition>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

// Admin Routes Component
const AdminRoutes = () => {
  return (
    <Suspense fallback={<RouteLoader />}>
      <AdminLayout>
        <Routes>
          <Route path="/dashboard" element={<PageTransition><AdminDashboard /></PageTransition>} />
          <Route path="/users" element={<PageTransition><AdminUsers /></PageTransition>} />
          <Route path="/capabilities" element={<PageTransition><CapabilitiesTable /></PageTransition>} />
          <Route path="/settings" element={<PageTransition><AdminSettings /></PageTransition>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AdminLayout>
    </Suspense>
  );
};

// Simplified App Routes - All users go to student dashboard (Unused, replaced by role-based routing)
// const AppRoutes = () => {
//   const { user, loading } = useAuthContext();
// 
//   if (loading) {
//     return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
//   }
// 
//   if (!user) {
//     console.log('🔄 AppRoutes: No user, redirecting to login');
//     return <Navigate to="/login" replace />;
//   }
// 
//   // All authenticated users go to student dashboard by default
//   console.log('🔄 AppRoutes: User authenticated, redirecting to student dashboard');
//   return <Navigate to="/student/dashboard" replace />;
// };

// Public Default Route - No redirection to login
const PublicDefaultRoute = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Default landing after auth: student dashboard (multi-role users switch via profile menu)
  if (user) {
    return <Navigate to="/student/dashboard" replace />;
  }

  return <MarketingPage />;
};

const AnimatedAppContent = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PublicDefaultRoute />} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/certificate/:id" element={<PageTransition><Suspense fallback={<RouteLoader />}><PublicCertificatePage /></Suspense></PageTransition>} />
        <Route path="/style-lab" element={<StyleLabPage />} />

        {/* Student Routes — all authenticated roles */}
        <Route
          path="/student/*"
          element={
            <ProtectedRouteWithRole allowedRoles={['student', 'mentor', 'admin']}>
              <StudentRoutes />
            </ProtectedRouteWithRole>
          }
        />

        {/* Mentor Routes — mentors and admins */}
        <Route
          path="/mentor/*"
          element={
            <ProtectedRouteWithRole allowedRoles={['mentor', 'admin']}>
              <MentorRoutes />
            </ProtectedRouteWithRole>
          }
        />

        {/* Admin Routes — admins only */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRouteWithRole allowedRoles={['admin']}>
              <AdminRoutes />
            </ProtectedRouteWithRole>
          }
        />

        {/* Default Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <ConfirmProvider>
            <Router>
              <AnimatedAppContent />
            </Router>
          </ConfirmProvider>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;