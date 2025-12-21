import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from '../Logo/Logo'
import Button from '../Button/Button'
import StarBorder from '../StarBorder/StarBorder'

const Menu = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const navLinks = [
    { path: '/', label: 'בית' },
    { path: '/superpowers', label: 'יכולות' },
    { path: '/pricing', label: 'תמחור' },
  ]
  
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }
  
  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md' 
          : 'bg-white/90 backdrop-blur-md shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-base transition-colors duration-200 hover:text-indigo-600 ${
                  isActive(link.path)
                    ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1'
                    : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/login">
              <StarBorder color="#EC4899" speed="5s" className="rounded-full">
                <Button variant="primary" size="small">
                  נסה עכשיו
                </Button>
              </StarBorder>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="תפריט"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden absolute top-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg animate-slide-down"
        >
          <div className="flex flex-col gap-4 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base text-right transition-colors duration-200 hover:text-indigo-600 ${
                  isActive(link.path)
                    ? 'text-indigo-600 font-semibold'
                    : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link 
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4"
            >
              <StarBorder color="#EC4899" speed="5s" className="rounded-full w-full">
                <Button variant="primary" className="w-full">
                  נסה עכשיו
                </Button>
              </StarBorder>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Menu

