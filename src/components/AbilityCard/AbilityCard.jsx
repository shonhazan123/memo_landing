import React from 'react'
import { useNavigate } from 'react-router-dom'
import './AbilityCard.css'

const AbilityCard = ({ ability, className = '' }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/superpowers/${ability.slug}`)
  }

  return (
    <div 
      className={`ability-card ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
      aria-label={`לחץ כדי לראות פרטים על ${ability.title}`}
    >
      <div className="ability-card-image-wrapper">
        <img
          src={ability.image}
          alt={ability.title}
          className="ability-card-image"
          loading="lazy"
        />
        <div className="ability-card-overlay">
          <h3 className="ability-card-title">{ability.title}</h3>
        </div>
        <div className="ability-card-plus-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  )
}

export default AbilityCard

