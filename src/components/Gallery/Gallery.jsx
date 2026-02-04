import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ComingSoonBadge from '../ComingSoonBadge/ComingSoonBadge'
import './Gallery.css'

const Gallery = ({ images = [], scrollStep = 400, className = '' }) => {
  const navigate = useNavigate()
  const scrollContainerRef = useRef(null)
  const cardRefs = useRef([])
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Initialize card refs
  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, images.length)
  }, [images])

  const findCurrentCardIndex = () => {
    const container = scrollContainerRef.current
    if (!container || cardRefs.current.length === 0) return 0

    const containerRect = container.getBoundingClientRect()
    const containerLeft = containerRect.left
    const containerRight = containerRect.right
    const isRTL = document.documentElement.dir === 'rtl' || container.closest('[dir="rtl"]')

    // Find the card that is most visible in the viewport
    let bestIndex = 0
    let maxVisible = 0

    cardRefs.current.forEach((cardRef, index) => {
      if (!cardRef) return
      
      const cardRect = cardRef.getBoundingClientRect()
      const cardLeft = cardRect.left
      const cardRight = cardRect.right

      // Calculate how much of the card is visible
      const visibleLeft = Math.max(cardLeft, containerLeft)
      const visibleRight = Math.min(cardRight, containerRight)
      const visibleWidth = Math.max(0, visibleRight - visibleLeft)
      const visibleRatio = visibleWidth / cardRect.width

      if (visibleRatio > maxVisible) {
        maxVisible = visibleRatio
        bestIndex = index
      }
    })

    return bestIndex
  }

  const checkScrollability = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const currentIdx = findCurrentCardIndex()
    setCurrentIndex(currentIdx)
    
    setCanScrollLeft(currentIdx > 0)
    setCanScrollRight(currentIdx < images.length - 1)
  }

  useEffect(() => {
    checkScrollability()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollability)
      window.addEventListener('resize', checkScrollability)
      return () => {
        container.removeEventListener('scroll', checkScrollability)
        window.removeEventListener('resize', checkScrollability)
      }
    }
  }, [images])

  const scroll = (direction) => {
    const container = scrollContainerRef.current
    if (!container || cardRefs.current.length === 0) return

    // Standardize arrow direction: left = previous, right = next (regardless of RTL)
    let targetIndex = currentIndex
    if (direction === 'left') {
      targetIndex = Math.max(currentIndex - 1, 0)
    } else {
      targetIndex = Math.min(currentIndex + 1, images.length - 1)
    }

    const targetCard = cardRefs.current[targetIndex]
    if (targetCard) {
      // Use scrollIntoView which respects scroll-snap and handles RTL automatically
      targetCard.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      })
      
      // Update index after scroll starts
      setCurrentIndex(targetIndex)
    }
  }

  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className={`gallery-container ${className}`}>
      <div className="gallery-scroll-container" ref={scrollContainerRef}>
        <div className="gallery-cards">
          {images.map((image, index) => {
            const handleClick = () => {
              if (image.slug) {
                navigate(`/superpowers/${image.slug}`)
              }
            }

            return (
              <div 
                key={image.id || index} 
                className={`gallery-card ${image.slug ? 'gallery-card-clickable' : ''}`}
                ref={el => cardRefs.current[index] = el}
                onClick={image.slug ? handleClick : undefined}
                onKeyDown={image.slug ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleClick()
                  }
                } : undefined}
                role={image.slug ? 'button' : undefined}
                tabIndex={image.slug ? 0 : undefined}
                aria-label={image.slug ? `לחץ כדי לראות פרטים על ${image.title}` : undefined}
              >
                <div className="gallery-card-image-wrapper">
                  <img
                    src={image.src || image.image}
                    alt={image.title || `Gallery image ${index + 1}`}
                    className="gallery-card-image"
                    loading="lazy"
                  />
                  <div className="gallery-card-title-overlay">
                    <h3 className="gallery-card-title">{image.title || ''}</h3>
                  </div>
                  {(image.slug === 'emails' || image.slug === 'google-workspace') && (
                    <ComingSoonBadge 
                      position={{ bottom: '10px', right: '0px' }}
                      size={{ width: '130px', height: '60px' }}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="gallery-arrows-container">
        <button
          className={`gallery-arrow gallery-arrow-right ${!canScrollRight ? 'disabled' : ''}`}
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          disabled={!canScrollRight}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          className={`gallery-arrow gallery-arrow-left ${!canScrollLeft ? 'disabled' : ''}`}
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          disabled={!canScrollLeft}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Gallery
