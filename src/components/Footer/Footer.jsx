import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo/Logo'
import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer" dir="rtl" role="contentinfo">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo-link" aria-label="דף הבית">
              <Logo size="default" variant="footer" clickable={false} />
            </Link>
            <p className="footer-tagline">המזכירה האישית שלך ב-WhatsApp</p>
          </div>
          <div className="footer-links">
            <Link to="/" className="footer-link">דף הבית</Link>
            <Link to="/superpowers" className="footer-link">יכולות</Link>
            <Link to="/pricing" className="footer-link">תמחור</Link>
            <Link to="/privacy" className="footer-link">מדיניות פרטיות</Link>
            <Link to="/terms" className="footer-link">תנאי שימוש</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} דונה. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
