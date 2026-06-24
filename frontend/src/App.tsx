import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { I18nProvider } from './contexts/I18nContext';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import InfrastructurePage from './pages/InfrastructurePage';
import QualityPage from './pages/QualityPage';
import ComplaintsPage from './pages/ComplaintsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import MapsPage from './pages/MapsPage';
import AlertsPage from './pages/AlertsPage';
import AIAssistantPage from './pages/AIAssistantPage';
import SettingsPage from './pages/SettingsPage';
import { LoadingSpinner } from './components/common/LoadingSpinner';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullPage text="Loading..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const RoleRoute: React.FC<{ children: React.ReactNode; allowedRoles: string[] }> = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullPage text="Loading..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="infrastructure/*" element={
          <RoleRoute allowedRoles={['super_admin', 'gp_admin', 'vWSC_member', 'district_officer']}>
            <InfrastructurePage />
          </RoleRoute>
        } />
        <Route path="quality" element={
          <RoleRoute allowedRoles={['super_admin', 'gp_admin', 'vWSC_member', 'citizen', 'district_officer']}>
            <QualityPage />
          </RoleRoute>
        } />
        <Route path="complaints/*" element={
          <RoleRoute allowedRoles={['super_admin', 'gp_admin', 'vWSC_member', 'citizen', 'district_officer']}>
            <ComplaintsPage />
          </RoleRoute>
        } />
        <Route path="analytics" element={
          <RoleRoute allowedRoles={['super_admin', 'district_officer']}>
            <AnalyticsPage />
          </RoleRoute>
        } />
        <Route path="maps" element={
          <RoleRoute allowedRoles={['super_admin', 'gp_admin', 'district_officer']}>
            <MapsPage />
          </RoleRoute>
        } />
        <Route path="alerts" element={
          <RoleRoute allowedRoles={['super_admin', 'gp_admin', 'district_officer']}>
            <AlertsPage />
          </RoleRoute>
        } />
        <Route path="ai-assistant" element={
          <RoleRoute allowedRoles={['super_admin', 'gp_admin', 'vWSC_member', 'district_officer']}>
            <AIAssistantPage />
          </RoleRoute>
        } />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <I18nProvider>
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#f9fafb',
                borderRadius: '12px',
                padding: '16px',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
    </I18nProvider>
  );
};

export default App;
