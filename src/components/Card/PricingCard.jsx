import React from 'react'
import Button from '../Button/Button'

const PricingCard = ({ 
  name, 
  price, 
  originalPrice, 
  period, 
  savings, 
  features = [], 
  isPopular = false,
  badge,
  ctaText = 'נסה בחינם',
  onCtaClick,
  className = '' 
}) => {
  const cardClasses = isPopular 
    ? 'bg-gradient-to-r from-indigo-500 to-pink-500 p-0.5 rounded-3xl md:scale-105 z-10'
    : 'bg-zinc-950 rounded-3xl'
  
  const innerClasses = isPopular
    ? 'bg-zinc-950 rounded-3xl p-6'
    : 'p-6'
  
  return (
    <div className={`${cardClasses} ${className}`}>
      <div className={innerClasses}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-white">{name}</h3>
          {badge && (
            <span className="bg-lime-400 text-black text-xs px-2 py-1 rounded">
              {badge}
            </span>
          )}
        </div>
        
        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-white">{price}</span>
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
          variant={isPopular ? 'primary' : 'primary'}
          className={`w-full mb-6 ${isPopular ? '' : 'bg-indigo-500 hover:bg-indigo-600'}`}
          onClick={onCtaClick}
        >
          {ctaText}
        </Button>
        
        {/* Features */}
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="text-gray-300 text-sm flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default PricingCard

