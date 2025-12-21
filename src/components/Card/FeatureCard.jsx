import React from 'react'

const FeatureCard = ({ icon, title, description, benefits = [], className = '' }) => {
  return (
    <div className={`bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 ${className}`}>
      {icon && (
        <div className="text-4xl mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-3xl md:text-4xl font-bold mb-4">{title}</h3>
      {description && (
        <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {benefits.length > 0 && (
        <ul className="space-y-2">
          {benefits.map((benefit, index) => (
            <li key={index} className="text-base text-gray-700 flex items-start">
              <span className="text-indigo-600 mr-2">•</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default FeatureCard

