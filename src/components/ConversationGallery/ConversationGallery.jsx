import React, { useRef, useState, useEffect } from 'react'
import './ConversationGallery.css'

/** Format Dona response string: newlines → <br />, **text** → <strong>text</strong> */
function formatDonnaResponse(text) {
  if (typeof text !== 'string') return text
  const lines = text.split('\n')
  return lines.map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g)
    const content = parts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j}>{part.slice(2, -2)}</strong>
      }
      return part
    })
    return (
      <React.Fragment key={i}>
        {i > 0 && <br />}
        {content}
      </React.Fragment>
    )
  })
}

const ConversationGallery = ({ conversations = [], className = '' }) => {
  const scrollContainerRef = useRef(null)
  const cardRefs = useRef([])
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Initialize card refs
  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, conversations.length)
  }, [conversations])

  const findCurrentCardIndex = () => {
    const container = scrollContainerRef.current
    if (!container || cardRefs.current.length === 0) return 0

    const containerRect = container.getBoundingClientRect()
    const containerLeft = containerRect.left
    const containerRight = containerRect.right

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
    setCanScrollRight(currentIdx < conversations.length - 1)
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
  }, [conversations])

  const scroll = (direction) => {
    const container = scrollContainerRef.current
    if (!container || cardRefs.current.length === 0) return

    // Standardize arrow direction: left = previous, right = next (regardless of RTL)
    let targetIndex = currentIndex
    if (direction === 'left') {
      targetIndex = Math.max(currentIndex - 1, 0)
    } else {
      targetIndex = Math.min(currentIndex + 1, conversations.length - 1)
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

  const goToIndex = (index) => {
    const container = scrollContainerRef.current
    if (!container || cardRefs.current.length === 0) return

    const targetCard = cardRefs.current[index]
    if (targetCard) {
      targetCard.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      })
      setCurrentIndex(index)
    }
  }

  if (!conversations || conversations.length === 0) {
    return null
  }

  return (
    <div className={`conversation-gallery-container ${className}`}>
      <div className="conversation-gallery-scroll-container" ref={scrollContainerRef}>
        <div className="conversation-gallery-cards">
          {conversations.map((conversation, index) => (
            <div 
              key={conversation.id || index} 
              className="conversation-gallery-card"
              ref={el => cardRefs.current[index] = el}
            >
              <div className="conversation-card-content">
                {/* Scenario header */}
                <div className="conversation-card-header">
                  <h3 className="conversation-card-heading">{conversation.heading}</h3>
                  <p className="conversation-card-subheading">{conversation.subheading}</p>
                </div>

                {/* WhatsApp container */}
                <div className="conversation-card-whatsapp-wrapper">
                  <div className="conversation-card-donna-header">
                    <div className="conversation-card-donna-content">
                      <div className="conversation-card-donna-avatar">
                        <img 
                          src="/photos/donna_whatssap_hero.png" 
                          alt="Donna" 
                          className="conversation-card-donna-avatar-img" 
                        />
                      </div>
                      <div className="conversation-card-donna-name-section">
                        <div className="conversation-card-donna-name">Donna</div>
                        <div className="conversation-card-donna-status">מקוון</div>
                      </div>
                    </div>
                  </div>

                  {/* Messages Container */}
                  <div className="conversation-card-messages-container">
                    {/* User Message */}
                    <div className="conversation-card-user-message-bubble">
                      <div className="conversation-card-message-content">
                        <p className="conversation-card-message-text">{conversation.userMessage}</p>
                        <div className="conversation-card-message-timestamp">{conversation.timestamp}</div>
                      </div>
                    </div>

                    {/* Donna Response */}
                    <div className="conversation-card-donna-message-bubble">
                      <div className="conversation-card-message-content">
                        <p className="conversation-card-message-text">
                          {typeof conversation.donnaResponse === 'string'
                            ? formatDonnaResponse(conversation.donnaResponse)
                            : conversation.donnaResponse}
                        </p>
                        <div className="conversation-card-message-footer">
                          <svg width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.00118164 0.561182L7.87706 8.43882" stroke="#3B82F6" strokeWidth="1" strokeLinecap="round"/>
                          </svg>
                          <span className="conversation-card-message-timestamp">{conversation.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Arrows */}
      <div className="conversation-gallery-arrows-container">
        <button
          className={`conversation-gallery-arrow conversation-gallery-arrow-right ${!canScrollRight ? 'disabled' : ''}`}
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          disabled={!canScrollRight}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          className={`conversation-gallery-arrow conversation-gallery-arrow-left ${!canScrollLeft ? 'disabled' : ''}`}
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          disabled={!canScrollLeft}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Pagination Dots */}
      {conversations.length > 1 && (
        <div className="conversation-gallery-pagination">
          {conversations.map((_, index) => (
            <button
              key={index}
              className={`conversation-gallery-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToIndex(index)}
              aria-label={`Go to conversation ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ConversationGallery

