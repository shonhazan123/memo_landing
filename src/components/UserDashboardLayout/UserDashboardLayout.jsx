import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const UserDashboardLayout = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-3 md:py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="חזרה לדף הבית"
          >
            <ArrowRight className="w-5 h-5" />
            <span className="text-sm hidden md:inline">חזרה</span>
          </button>

          <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
            הגדרות
          </h1>

          <span className="text-xs md:text-sm text-gray-400 truncate max-w-[140px] md:max-w-[200px]">
            {user?.email || ''}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <Outlet />
      </div>
    </div>
  )
}

export default UserDashboardLayout
