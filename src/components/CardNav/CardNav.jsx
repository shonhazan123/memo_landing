import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from '../Logo/Logo'
import './CardNav.css'

const CardNav = ({
  items,
  baseColor = '#fff',
  menuColor = '#000',
  buttonBgColor = '#111',
  buttonTextColor = '#fff',
  ease = 'power3.out'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const navRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (isOpen && navRef.current) {
      // Calculate proper height including content
      const content = navRef.current.querySelector('.card-nav-content')
      if (content) {
        const contentHeight = content.scrollHeight
        const topHeight = 60
        const totalHeight = topHeight + contentHeight + 16 // 16px for padding
        navRef.current.style.height = `${totalHeight}px`
      }
    } else if (navRef.current) {
      navRef.current.style.height = '60px'
    }
  }, [isOpen])

  const handleItemClick = (path) => {
    navigate(path)
    setIsOpen(false)
  }

  return (
    <div className="card-nav-container" dir="rtl">
      <nav 
        ref={navRef}
        className={`card-nav ${isOpen ? 'open' : ''}`}
        style={{ 
          backgroundColor: baseColor,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}
      >
        <div className="card-nav-top">
          <div className="logo-container">
            <Logo />
          </div>
          <button
            className={`hamburger-menu ${isOpen ? 'open' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="תפריט"
            style={{ color: menuColor }}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
          <button
            className="card-nav-cta-button"
            onClick={() => handleItemClick('/login')}
            style={{
              backgroundColor: buttonBgColor,
              color: buttonTextColor
            }}
          >
            נסה עכשיו
          </button>
        </div>
        <div className="card-nav-content">
          {items.map((item, index) => (
            <div
              key={index}
              className="nav-card"
              style={{
                backgroundColor: item.bgColor,
                color: item.textColor
              }}
              onClick={() => {
                if (item.links && item.links.length > 0) {
                  handleItemClick(item.links[0].path)
                }
              }}
            >
              <div className="nav-card-label">{item.label}</div>
              <div className="nav-card-links">
                {item.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    className="nav-card-link"
                    href={link.path}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleItemClick(link.path)
                    }}
                    style={{ color: item.textColor }}
                    aria-label={link.ariaLabel || link.label}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default CardNav

