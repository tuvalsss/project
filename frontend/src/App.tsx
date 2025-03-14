import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './components/Auth/LoginPage'
import { Dashboard } from './components/Dashboard'
import { UserProfile } from './components/User/UserProfile'
import { AiDashboard } from './components/AI/AiDashboard'
import { AffiliateDashboard } from './components/Affiliate/AffiliateDashboard'
import { IntegrationsPage } from './components/Integrations/IntegrationsPage'
import { PrivateRoute } from './components/Auth/PrivateRoute'
import { UserRole } from './client'
import { AdminDashboard } from './components/Admin/AdminDashboard'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <ReactQueryDevtools initialIsOpen={false} />
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/ai-dashboard"
              element={
                <PrivateRoute requiredPermission="canAccessAdvancedAnalytics">
                  <AiDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/affiliate-dashboard"
              element={
                <PrivateRoute requiredPermission="canAccessAffiliate">
                  <AffiliateDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/integrations"
              element={
                <PrivateRoute requiredPermission="canAccessIntegrations">
                  <IntegrationsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute requiredRole={UserRole.ADMIN_LOW}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </ChakraProvider>
    </QueryClientProvider>
  )
} 