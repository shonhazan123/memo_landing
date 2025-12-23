import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Login Page - Redirects to Signup flow
 * Kept for backward compatibility with existing links
 */
const Login = () => {
  const navigate = useNavigate()
  
  useEffect(() => {
    // Redirect to the new signup flow
    navigate('/signup', { replace: true })
  }, [navigate])
  
  // Show loading state while redirecting
  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">מעביר לדף ההרשמה...</p>
      </div>
    </div>
  )
}

export default Login
