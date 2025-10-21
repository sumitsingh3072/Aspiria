import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
// import ProtectedRoute from '@/components/protected/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Pages
import HomePage from '@/pages/public/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import OnboardingPage from '@/pages/dashboard/OnboardingPage';
import ChatPage from '@/pages/dashboard/ChatPage';
import ProfilePage from '@/pages/dashboard/ProfilePage';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route 
            path="/onboarding" 
            element={
              // <ProtectedRoute>
                <OnboardingPage />
              // </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              // <ProtectedRoute>
                <DashboardLayout />
              // </ProtectedRoute>
            }
          >
            <Route path="chat" element={<ChatPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route index element={<Navigate to="chat" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AuthProvider>
    </>
  );
}

export default App;