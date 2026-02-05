import React from 'react'
import './ComingSoonBadge.css'

const ComingSoonBadge = ({ 
  className = '', 
  positionMobile = { bottom: '2%', right: '2%', left: 'auto', top: 'auto' },
  positionDesktop = { bottom: '2%', right: '2%', left: 'auto', top: 'auto' },
  sizeMobile = { width: '26%', aspectRatio: '3.33' },
  sizeDesktop = { width: '26%', aspectRatio: '3.33' }
}) => {
  // Calculate padding-bottom for aspect ratio
  const getPaddingBottom = (size) => {
    if (size.aspectRatio) {
      return `${100 / parseFloat(size.aspectRatio)}%`
    }
    return size.height ? 'auto' : '0'
  }

  // Use CSS custom properties for responsive positioning and sizing
  const style = {
    position: 'absolute',
    '--badge-bottom-mobile': positionMobile.bottom,
    '--badge-right-mobile': positionMobile.right,
    '--badge-left-mobile': positionMobile.left || 'auto',
    '--badge-top-mobile': positionMobile.top || 'auto',
    '--badge-width-mobile': sizeMobile.width,
    '--badge-padding-mobile': getPaddingBottom(sizeMobile),
    '--badge-height-mobile': sizeMobile.height || '0',
    '--badge-bottom-desktop': positionDesktop.bottom,
    '--badge-right-desktop': positionDesktop.right,
    '--badge-left-desktop': positionDesktop.left || 'auto',
    '--badge-top-desktop': positionDesktop.top || 'auto',
    '--badge-width-desktop': sizeDesktop.width,
    '--badge-padding-desktop': getPaddingBottom(sizeDesktop),
    '--badge-height-desktop': sizeDesktop.height || '0',
    zIndex: 20,
    pointerEvents: 'none'
  }

  const hasHeightMobile = !!sizeMobile.height
  const hasHeightDesktop = !!sizeDesktop.height

  return (
    <div 
      className={`coming-soon-badge ${className}`} 
      style={style}
      data-has-height-mobile={hasHeightMobile}
      data-has-height-desktop={hasHeightDesktop}
    >
      <svg 
        viewBox="0 0 600 400" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        className="coming-soon-svg"
      >
        <defs>
          <linearGradient id="comingSoonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff4d6d"/>
            <stop offset="50%" stopColor="#8b5cf6"/>
            <stop offset="100%" stopColor="#3b82f6"/>
          </linearGradient>
        </defs>

        {/* Diagonal Ribbon */}
        <g transform="rotate(-35 300 200)">
          <rect
            x="100"
            y="170"
            width="400"
            height="60"
            rx="12"
            fill="url(#comingSoonGrad)"
          />
          <text
            x="300"
            y="210"
            textAnchor="middle"
            fontSize="32"
            fontWeight="700"
            fill="white"
            fontFamily="Arial, Helvetica, sans-serif"
            letterSpacing="2"
          >
            COMING SOON
          </text>
        </g>
      </svg>
    </div>
  )
}

export default ComingSoonBadge

