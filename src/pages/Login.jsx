import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getSafeRedirectPath } from '../lib/auth-redirect'

/**
 * Login Page - Redirects to Signup flow, forwarding any safe `redirect` param.
 */
const Login = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const redirectPath = getSafeRedirectPath(searchParams.get('redirect'))
    const target = redirectPath
      ? `/signup?redirect=${encodeURIComponent(redirectPath)}`
      : '/signup'
    navigate(target, { replace: true })
  }, [navigate, searchParams])

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">מעבירים אותך להתחברות…</p>
      </div>
    </div>
  )
}

export default Login
