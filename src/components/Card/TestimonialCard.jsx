import React from 'react'

const TestimonialCard = ({ rating = 5, text, author, title, avatar, className = '' }) => {
  return (
    <div className={`bg-gradient-to-br from-gray-50 to-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <span key={i} className="text-amber-400 text-xl">★</span>
        ))}
      </div>
      
      {/* Testimonial Text */}
      <p className="text-gray-700 mb-6 leading-relaxed">{text}</p>
      
      {/* Author Info */}
      <div className="flex items-center gap-4">
        {avatar && (
          <img 
            src={avatar} 
            alt={author}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
        <div>
          <p className="font-semibold text-gray-900">{author}</p>
          {title && (
            <p className="text-sm text-gray-600">{title}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TestimonialCard

