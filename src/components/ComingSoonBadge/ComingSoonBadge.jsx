import React from 'react'
import './ComingSoonBadge.css'

const ComingSoonBadge = ({ 
  className = '', 
  position = { bottom: '30%', right: '10%' },
  size = { width: '200px', height: '60px' }
}) => {
  const style = {
    position: 'absolute',
    bottom: position.bottom,
    right: position.right,
    width: size.width,
    height: size.height,
    zIndex: 20,
    pointerEvents: 'none'
  }

  return (
    <div className={`coming-soon-badge ${className}`} style={style}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 600 400" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
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

