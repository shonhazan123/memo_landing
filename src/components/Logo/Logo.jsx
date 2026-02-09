import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import logoSrc from './logo.png'
import logo2Src from './logo2.png'

const Logo = ({ className = '', size = 'xl', clickable = true, variant = 'default' }) => {
  const imgSrc = variant === 'footer' ? logo2Src : logoSrc
  const location = useLocation()
  const isHome = location.pathname === '/'

  const handleLogoClick = (e) => {
    if (isHome) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  // Size options: 'small' (h-8), 'default' (h-12), 'large' (h-16), 'xl' (h-[60px] w-[90px])
  const sizeClasses = {
    small: 'h-8',
    default: 'h-12',
    large: 'h-16',
    xl: 'h-[60px] w-[90px]',
  }
  
  const logoSize = sizeClasses[size] || sizeClasses.default
  const useAutoWidth = size !== 'xl'
  
  const logoElement = (
    <div className={`flex items-center ${className}`}>
      <img 
        src={imgSrc} 
        alt="דונה" 
        className={`${logoSize} ${useAutoWidth ? 'w-auto' : ''} cursor-pointer transition-opacity hover:opacity-80`}
        style={{ marginLeft: '10px', marginRight: '10px' }}
        onError={(e) => {
          // Fallback: try public folder path
          if (e.target.src !== '/Gemini_Generated_Image_1mpjsw1mpjsw1mpj-remove-background.com (1).png') {
            e.target.src = '/Gemini_Generated_Image_1mpjsw1mpjsw1mpj-remove-background.com (1).png'
          } else {
            // If both fail, show text
            e.target.style.display = 'none'
            const textLogo = e.target.parentNode.querySelector('.text-logo-fallback')
            if (textLogo) {
              textLogo.style.display = 'block'
            }
          }
        }}
      />
      <span className="text-logo-fallback text-2xl font-bold text-indigo-600 ml-2" style={{ display: 'none' }}>
        דונה
      </span>
    </div>
  )
  
  if (clickable) {
    return (
      <Link to="/" className="inline-block" onClick={handleLogoClick}>
        {logoElement}
      </Link>
    )
  }
  
  return logoElement
}

export default Logo

