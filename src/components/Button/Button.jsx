import React from 'react'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'default',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
  
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-300',
    small: 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white hover:shadow-lg'
  }
  
  const sizes = {
    default: 'px-12 py-4 text-xl',
    small: 'px-6 py-2 text-base',
    large: 'px-16 py-5 text-2xl'
  }
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

