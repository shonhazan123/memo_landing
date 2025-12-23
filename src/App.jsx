import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import CardNav from './components/CardNav/CardNav'
import Home from './pages/Home'
import Superpowers from './pages/Superpowers'
import Pricing from './pages/Pricing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import './styles/index.css'

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
        { label: 'כל היכולות', path: '/superpowers', ariaLabel: 'כל היכולות של מימו' }
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
      <AuthProvider>
        <div className="min-h-screen">
          <CardNav
            items={navItems}
            baseColor="rgba(255, 255, 255, 0.9)"
            menuColor="#000"
            buttonBgColor="#111"
            buttonTextColor="#fff"
            ease="power3.out"
          />
          <main className="pt-0" style={{ borderRadius: '0px' }}> {/* Padding for CardNav */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/superpowers" element={<Superpowers />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
