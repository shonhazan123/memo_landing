import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button/Button'
import Logo from '../components/Logo/Logo'
// import { auth } from '../config/supabase' // Prepared for future implementation

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // TODO: Implement Google OAuth with Supabase
      // const { data, error } = await auth.signInWithGoogle()
      // if (error) throw error
      
      // Simulated for now - will be replaced with actual Supabase auth
      setTimeout(() => {
        setIsLoading(false)
        // Navigate to success or dashboard
        // navigate('/dashboard')
      }, 2000)
    } catch (err) {
      setError(err.message || 'משהו השתבש. נסה שוב.')
      setIsLoading(false)
    }
  }
  
  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo className="w-16 h-16" />
        </div>
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          כדי שמימו ינהל לך את היומן,
          <br />
          צריך חיבור לגוגל
        </h1>
        
        {/* Explanation */}
        <p className="text-lg text-gray-600 mb-6 text-center">
          מימו צריך גישה ליומן שלך כדי לנהל את הפגישות והתזכורות שלך.
        </p>
        
        {/* Benefits List */}
        <ul className="space-y-2 mb-8">
          <li className="flex items-start text-gray-700">
            <span className="text-indigo-600 mr-2">✓</span>
            <span>גישה בטוחה ליומן</span>
          </li>
          <li className="flex items-start text-gray-700">
            <span className="text-indigo-600 mr-2">✓</span>
            <span>סנכרון אוטומטי</span>
          </li>
          <li className="flex items-start text-gray-700">
            <span className="text-indigo-600 mr-2">✓</span>
            <span>שליטה מלאה בהרשאות</span>
          </li>
        </ul>
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-600">
              <span className="text-xl">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">מתחבר לגוגל...</p>
          </div>
        ) : (
          <>
            {/* Google Sign-In Button */}
            <Button
              variant="secondary"
              className="w-full mb-4"
              onClick={handleGoogleSignIn}
            >
              <div className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>התחבר עם Google</span>
              </div>
            </Button>
            
            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-lg">🔒</span>
              <span className="text-sm text-gray-500">מאובטח ופרטי</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Login

