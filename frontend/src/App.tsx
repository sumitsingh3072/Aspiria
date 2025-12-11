import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from '@/context/auth-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { queryClient } from '@/lib/query-client'

import LoginPage from '@/pages/auth/login'
import RegisterPage from '@/pages/auth/register'
import LandingPage from '@/pages/landing/index'
import DashboardLayout from '@/components/layout/dashboard-layout'
import DashboardPage from '@/pages/dashboard/index'
import ChatPage from '@/pages/chat/index'
import IngestionPage from '@/pages/ingestion/index'
import ProfilePage from '@/pages/profile/index'
import NotificationsPage from '@/pages/notifications/index'
import FeedbackPage from '@/pages/feedback/index'

// Protected Route Wrapper - Temporarily Disabled (Pass-through)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // const { user, isLoading } = useAuth()

  // if (isLoading) {
  //   return <div className="flex h-screen items-center justify-center bg-background text-foreground">Loading...</div>
  // }

  // if (!user) {
  //   return <Navigate to="/auth/login" replace />
  // }

  return <>{children}</>
}

// Layout Wrapper for App Routes
const AppLayout = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Route - Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* Auth Routes */}
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />

              {/* App Routes (Protected w/ Layout) */}
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/ingestion" element={<IngestionPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
