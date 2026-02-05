import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Button from '../components/Button/Button'
import FeatureCard from '../components/Card/FeatureCard'
import TestimonialCard from '../components/Card/TestimonialCard'
import StarBorder from '../components/StarBorder/StarBorder'
import Logo from '../components/Logo/Logo'
import heroImage from '../components/Logo/ChatGPT Image Dec 19, 2025, 03_40_34 PM.png'
import Gallery from '../components/Gallery/Gallery'
import ScrollReveal from '../components/ScrollReveal/ScrollReveal'
import BlurText from '../components/BlurText/BlurText'
import BackgroundVideo from '../components/BackgroundVideo/BackgroundVideo'
import ConversationFlow from '../components/ConversationFlow/ConversationFlow'
import { getAllAbilities } from '../data/abilities'
import './Home.css'

gsap.registerPlugin(ScrollTrigger)

// Chapter 3 – Real Life Examples: "You ask. Dona does."

const Home = () => {
  const chapter3SectionRef = useRef(null)
  const chapter3CardsRef = useRef(null)

  // Chapter 3 – scroll reveal for example cards (fade + translate up, staggered)
  useEffect(() => {
    const container = chapter3SectionRef.current
    if (!container) return
    const cards = container.querySelectorAll('.chapter3-card')
    const triggers = []
    cards.forEach((el, i) => {
      const tween = gsap.fromTo(
        el,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom-=12%',
            toggleActions: 'play none none none',
          },
          delay: i * 0.08,
        }
      )
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    })
    return () => triggers.forEach((t) => t.kill())
  }, [])
  const stats = [
    { number: '1,000+', label: 'משתמשים מרוצים' },
    { number: '50K+', label: 'משימות הושלמו' },
    { number: '99%', label: 'שיעור שביעות רצון' },
    { number: '24/7', label: 'זמינות' },
  ]
  
  const testimonials = [
    {
      rating: 5,
      text: 'דונה שינתה לי את החיים. אני כבר לא שוכח שום דבר, והיא עוזרת לי להיות מאורגן יותר ממה שאי פעם הייתי.',
      author: 'דני כהן',
      title: 'יזם',
    },
    {
      rating: 5,
      text: 'הדבר הכי טוב שקרה לי השנה. דונה מנהלת לי את כל היומן, ואני פשוט מדבר איתה ב-WhatsApp.',
      author: 'שרה לוי',
      title: 'מנהלת פרויקטים',
    },
    {
      rating: 5,
      text: 'פשוט מדהים. אני שולח הודעה לדונה, והיא עושה הכל. תזכורות, פגישות, רשימות - הכל במקום אחד.',
      author: 'מיכאל דוד',
      title: 'עורך דין',
    },
  ]
  


  // Gallery images from abilities data
  const abilities = getAllAbilities()
  const galleryImages = abilities.map(ability => ({
    id: ability.id,
    src: ability.image,
    title: ability.title,
    slug: ability.slug
  })).sort((a, b) => b.id - a.id)
  
  return (
    <div dir="rtl" className="min-h-screen">
      {/* Hero Section - Viewport-based positioning */}
      {/* Both video and text use viewport units (vw) for consistent coordinate system */}
      <section className="home-section bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden hero-section-root">
        <div className="hero-video-container">
          {/* Desktop hero video – visible at viewport > 900px */}
          <div className="hero-video-source hero-video-desktop">
            <BackgroundVideo src="/videos/dona_video.mp4" />
          </div>
          {/* Phone hero video – visible at viewport ≤ 900px (mobile/phone size) */}
          <div className="hero-video-source hero-video-mobile">
            <BackgroundVideo src="/videos/dona_iphone.mp4" />
          </div>
        </div>
        
        {/* Bottom fade for hero video - positioned in hero section to match video */}
        <div className="hero-image-fade"></div>
        
        {/* Text Container: Viewport-anchored, positioned to the right of video using math */}
        {/* Forbidden zone: Video's right edge = 50vw + (var(--hero-video-width) / 2) */}
        {/* Text starts at: calc(50vw + (var(--hero-video-width) / 2) + var(--hero-gap)) */}
        {/* Using viewport units (vw) ensures both video and text share the same coordinate system */}
        <div className="hero-text-container">
          <div className="hero-text-content">
            {/* Wrapper: mobile = buttons above H1 (CSS order); desktop = H1 then buttons */}
            <div className="hero-text-and-buttons">
              {/* Main Headline – desktop first; on mobile CSS order puts it below buttons */}
              <div className="text-center mb-6 leading-tight hero-headline-block">
                <ScrollReveal
                  as="h1"
                  baseOpacity={0}
                  enableBlur={true}
                  baseRotation={5}
                  blurStrength={10}
                  containerClassName="text-3xl md:text-7xl font-bold"
                  textClassName="text-center theme-gradient-text"
                >
                  המזכירה האישית  ב-WhatsApp
                </ScrollReveal>
                <br />
                <BlurText
                  as="h1"
                  delay={150}
                  animateBy="words"
                  direction="top"
                  className=" text-3xl md:text-7xl font-bold text-gray-900"
                />
              </div>

              {/* CTA Buttons – two stacked on mobile, row on desktop */}
              <div className="hero-buttons-mobile flex flex-row gap-3 md:gap-4 items-start justify-start">
                <Link to="/login">
                  <StarBorder color="var(--theme-accent)" speed="5s" className="w-full" thickness={2}>
                    <Button variant="primary" >
                      התחל עכשיו
                    </Button>
                  </StarBorder>
                </Link>
                <Link to="/superpowers" className="gradient-border-pill hero-cta-pill">
                  <span className="gradient-border-pill-inner hero-cta-pill-inner">גלה יכולות</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 3 – Conversation Flow: "You ask. Dona does." */}
      <section
        ref={chapter3SectionRef}
        className="home-section chapter3-section bg-white relative py-16 md:py-24"
        aria-labelledby="chapter3-title"
      >
        <div className="chapter3-container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <ScrollReveal
              as="h2"
              id="chapter3-title"
              baseOpacity={0}
              enableBlur={true}
              baseRotation={3}
              blurStrength={8}
              containerClassName="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
              textClassName="text-gray-900"
            >
              אתה מבקש דונה מבצעת.
            </ScrollReveal>
            <BlurText
              text="בהודעת טקסט בהקלטה קולית ואפילו בתמונה ! "
              delay={80}
              animateBy="words"
              direction="top"
              className="text-base md:text-lg text-gray-600"
            />
              <BlurText
              text="דונה מבינה"
              delay={80}
              animateBy="words"
              direction="top"
              className="text-base md:text-lg text-gray-600"
            />
          </div>
          <ConversationFlow />
          
          {/* Final CTA Section */}
          <div className="text-center mt-16 md:mt-20">
            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={5}
              blurStrength={10}
              containerClassName="text-2xl md:text-3xl font-bold mb-4 text-gray-900"
            >
               כותבים או מקליטים והכל קורה
            </ScrollReveal>
            <BlurText
              text="בלי אפליקציה חדשה, בלי מאמץ. פשוט מבקשים בשפה טבעית והיא דואגת לכל השאר."
              delay={100}
              animateBy="words"
              direction="top"
              className="text-base md:text-lg text-gray-600 mb-8"
            />
            <Link to="/login">
              <StarBorder color="var(--theme-accent)" speed="5s" className="inline-block">
                <Button variant="primary" size="large" className="flex items-center gap-2 mx-auto">
                 מחכה לכם !
                </Button>
              </StarBorder>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Gallery Section - Replaces Feature Cards Section */}
      <section className="home-section bg-white relative py-16 md:py-24">
        <div className="section-fade-top hero-to-stats-fade"></div>
        <div className="section-fade-bottom stats-to-cta-fade"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 section-content">
          <div className="text-center">
            <BlurText
              text="בוא נדבר תאכלס שום אפליקציית TODO לא באמת עובדת. אנחנו שוכחים 🧠 מתעצלים 😴 או פשוט לא נכנסים אליהן. מהיום, דונה המזכירה האישית שלך עושה את זה בשבילך ✨בלי אפליקציה חדשה, בלי מאמץ. פשוט מבקשים בשפה טבעית והיא דואגת לכל השאר."
              delay={120}
              animateBy="words"
              direction="top"
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 max-w-4xl mx-auto leading-relaxed"
            />
            <div className="mb-8">
              <Gallery images={galleryImages} scrollStep={400} />
            </div>
            <div className=" flex justify-center mt-8">
              <Link to="/superpowers">
                <Button variant="primary" size="large" className="flex items-center ">
                  לכל היכולות של דונה
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="home-section py-1 bg-white relative" style={{ paddingBottom: '15px' }}>
        <div className="section-fade-bottom stats-to-cta-fade"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-content relative z-10" style={{ display: 'grid', flexWrap: 'wrap', marginTop: '0px', paddingTop: '10px', paddingBottom: '10px' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-4xl md:text-5xl font-bold theme-gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="home-section py-1 bg-white relative">
        <div className="section-fade-top stats-to-cta-fade"></div>
        <div className="section-fade-bottom cta-to-testimonials-fade"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center section-content relative z-10" style={{ paddingTop: '15px', paddingBottom: '15px' }}>
          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            baseRotation={5}
            blurStrength={10}
            containerClassName="text-4xl md:text-6xl font-bold mb-6 text-gray-900"
          >
            מוכן להתחיל?
          </ScrollReveal>
          <BlurText
            text="הצטרף לאלפי משתמשים שכבר מנהלים את החיים שלהם עם דונה"
            delay={100}
            animateBy="words"
            direction="bottom"
            className="text-xl md:text-2xl text-gray-700 mb-8"
          />
          <Link to="/login">
            <StarBorder color="var(--theme-accent)" speed="5s" className="rounded-full">
              <Button variant="primary" size="large">
                התחל בחינם
              </Button>
            </StarBorder>
          </Link>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="home-section py-1 bg-gray-50 relative" style={{ paddingTop: '15px' }}>
        <div className="section-fade-top cta-to-testimonials-fade"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-content relative z-10" style={{ display: 'grid', flexWrap: 'wrap', marginTop: '0px', paddingTop: '10px', paddingBottom: '10px' }}>
          <BlurText
            text="מה אומרים עלינו"
            delay={150}
            animateBy="words"
            direction="top"
            className="text-4xl md:text-6xl font-bold text-center mb-1 text-gray-900"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                {...testimonial}
                className={index === 1 ? 'md:mt-10' : ''}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
