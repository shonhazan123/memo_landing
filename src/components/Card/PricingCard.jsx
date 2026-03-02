import React from 'react'
import Button from '../Button/Button'

const PricingCard = ({ 
  name, 
  price, 
  originalPrice, 
  period, 
  savings, 
  features = [], 
  badge,
  ctaText = 'נסה בחינם',
  disabled = false,
  onCtaClick,
  className = '' 
}) => {
  const cardStyle = {
    textAlign: 'center',
    background: 'radial-gradient(ellipse at 50% 50%, rgba(175, 181, 253, 1) 0%, rgba(255, 255, 255, 1) 100%)',
  }
  
  return (
    <div className={`rounded-3xl ${className}`} style={cardStyle}>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-700">{name}</h3>
          {badge && (
            <span className="bg-lime-400 text-black text-xs px-2 py-1 rounded">
              {badge}
            </span>
          )}
        </div>
        
        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-gray-700">{price}</span>
            {originalPrice && (
              <span className="text-2xl text-gray-400 line-through">{originalPrice}</span>
            )}
            <span className="text-gray-400 text-sm">/{period}</span>
          </div>
          {savings && (
            <p className="text-gray-400 text-sm">חסכון של {savings}</p>
          )}
        </div>
        
        {/* CTA Button */}
        <Button
          variant="primary"
          className="w-full mb-6 bg-indigo-500 hover:bg-indigo-600"
          onClick={onCtaClick}
          disabled={disabled}
        >
          {ctaText}
        </Button>
        
        {/* Features */}
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="text-sm flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-[rgba(5,5,5)] font-semibold">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default PricingCard

