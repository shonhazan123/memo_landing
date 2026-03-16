import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import CardNav from './components/CardNav/CardNav'
import Footer from './components/Footer/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import UserDashboardLayout from './components/UserDashboardLayout/UserDashboardLayout'
import Home from './pages/Home'
import Superpowers from './pages/Superpowers'
import AbilityDetail from './pages/AbilityDetail'
import Pricing from './pages/Pricing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import TalkToDona from './pages/TalkToDona'
import Settings from './pages/Settings'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import CancellationPolicy from './pages/CancellationPolicy'
import './styles/index.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/** Pages that use the dashboard layout (no CardNav / Footer) */
const DASHBOARD_PATHS = ['/settings']

function MainLayout({ navItems, children }) {
  const { pathname } = useLocation()
  const isDashboard = DASHBOARD_PATHS.some(p => pathname.startsWith(p))

  if (isDashboard) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <CardNav
        items={navItems}
        baseColor="rgba(255, 255, 255, 0.9)"
        menuColor="#000"
        buttonBgColor="#111"
        buttonTextColor="#fff"
        ease="power3.out"
      />
      <main className="pt-0 flex-1" style={{ borderRadius: '0px' }}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

function App() {
  const navItems = [
    {
      label: 'בית',
      bgColor: '#0D0716',
      textColor: '#fff',
      links: [
        { label: 'דף הבית', path: '/', ariaLabel: 'דף הבית' }
      ]
    },
    {
      label: 'יכולות',
      bgColor: '#170D27',
      textColor: '#fff',
      links: [
        { label: 'כל היכולות', path: '/superpowers', ariaLabel: 'כל היכולות של דונה' }
      ]
    },
    {
      label: 'תמחור',
      bgColor: '#271E37',
      textColor: '#fff',
      links: [
        { label: 'תוכניות ותמחור', path: '/pricing', ariaLabel: 'תוכניות ותמחור' }
      ]
    }
  ]

  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <MainLayout navItems={navItems}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/superpowers" element={<Superpowers />} />
            <Route path="/superpowers/:slug" element={<AbilityDetail />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/talk-to-dona" element={<TalkToDona />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cancellation-policy" element={<CancellationPolicy />} />

            {/* Protected dashboard routes (own layout, no CardNav/Footer) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<UserDashboardLayout />}>
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>
          </Routes>
        </MainLayout>
      </AuthProvider>
    </Router>
  )
}

export default App
