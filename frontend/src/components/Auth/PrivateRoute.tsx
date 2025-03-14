import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { RolePermissions, UserRole, Permission } from '../../client'

interface PrivateRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
  requiredPermission?: Permission
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
}) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div>טוען...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  if (requiredPermission && !RolePermissions[user.role][requiredPermission]) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
} 