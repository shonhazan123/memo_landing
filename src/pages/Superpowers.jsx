import React, { useEffect, useRef } from 'react'
import { getAllAbilities } from '../data/abilities'
import AbilityCard from '../components/AbilityCard/AbilityCard'
import StarBorder from '../components/StarBorder/StarBorder'
import ScrollReveal from '../components/ScrollReveal/ScrollReveal'
import BlurText from '../components/BlurText/BlurText'
import './Superpowers.css'

const Superpowers = () => {
  const cardRefs = useRef([])
  const abilities = getAllAbilities()
  
  useEffect(() => {
    const observers = cardRefs.current.map((ref) => {
      if (!ref) return null
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1'
              entry.target.style.transform = 'translateY(0)'
            }
          })
        },
        { threshold: 0.1 }
      )
      
      observer.observe(ref)
      return observer
    })
    
    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [])
  
  const addToRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el)
    }
  }
  
  return (
    <div dir="rtl" className="min-h-screen">
      {/* Hero Section - gradient fades to white at bottom */}
      <section className="superpowers-hero-section py-20 md:py-22">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <BlurText
              text="היכולות של דונה"
              delay={150}
              animateBy="words"
              direction="top"
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight theme-gradient-text"
            />
            <BlurText
              text="ועוד הרבה בדרך !"
              delay={100}
              animateBy="words"
              direction="bottom"
              className="text-xl md:text-3xl text-black-900 mb-3 leading-relaxed"
            />
          </div>
        </div>
      </section>
      
      {/* Abilities Grid - fades in from hero at top */}
      <section className="superpowers-abilities-section pt-16 pb-0">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
            {abilities.map((ability, index) => (
              <div
                key={ability.id}
                ref={addToRefs}
                className="opacity-0 transform translate-y-8 transition-all duration-600 ease-out"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <AbilityCard
                  ability={ability}
                  className="h-full w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            baseRotation={5}
            blurStrength={10}
            containerClassName="text-4xl md:text-6xl font-bold mb-6 text-gray-900"
          >
            מוכן להתחיל להשתמש בכוחות האלה?
          </ScrollReveal>
          <BlurText
            text="התחל עכשיו וקבל גישה לכל היכולות האלה"
            delay={100}
            animateBy="words"
            direction="bottom"
            className="text-xl md:text-2xl text-gray-700 mb-8"
          />
          <a href="/login">
            <StarBorder color="var(--theme-accent)" speed="5s" className="rounded-full">
              <button className="theme-gradient-bg text-white text-xl font-semibold px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all">
                התחל עכשיו
              </button>
            </StarBorder>
          </a>
        </div>
      </section>
    </div>
  )
}

export default Superpowers

