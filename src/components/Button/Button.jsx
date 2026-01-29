import React from 'react'
import './Button.css'

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
  const baseClasses = 'font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-white text-gray-700 border-2 border-gray-200',
    small: 'text-white hover:shadow-lg'
  }
  
  const sizes = {
    default: 'px-12 py-4 text-xl',
    small: 'px-6 py-2 text-base',
    large: 'px-[50px] py-5 text-2xl h-[60px]'
  }
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  // Apply gradient using theme button gradient for primary and small variants
  const buttonStyle = (variant === 'primary' || variant === 'small') 
    ? { 
        background: 'var(--theme-button-gradient)',
      }
    : {}
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

