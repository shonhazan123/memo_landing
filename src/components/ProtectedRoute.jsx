import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    const intended = location.pathname + location.search
    const loginUrl = `/login?redirect=${encodeURIComponent(intended)}`
    return <Navigate to={loginUrl} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
