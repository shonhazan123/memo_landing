import React from 'react'
import { Link } from 'react-router-dom'
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
import './Home.css'

const Home = () => {
  const stats = [
    { number: '10,000+', label: 'משתמשים מרוצים' },
    { number: '500K+', label: 'משימות הושלמו' },
    { number: '99%', label: 'שיעור שביעות רצון' },
    { number: '24/7', label: 'זמינות' },
  ]
  
  const testimonials = [
    {
      rating: 5,
      text: 'מימו שינה לי את החיים. אני כבר לא שוכח שום דבר, והוא עוזר לי להיות מאורגן יותר ממה שאי פעם הייתי.',
      author: 'דני כהן',
      title: 'יזם',
    },
    {
      rating: 5,
      text: 'הדבר הכי טוב שקרה לי השנה. מימו מנהל לי את כל היומן, ואני פשוט מדבר איתו ב-WhatsApp.',
      author: 'שרה לוי',
      title: 'מנהלת פרויקטים',
    },
    {
      rating: 5,
      text: 'פשוט מדהים. אני שולח הודעה למימו, והוא עושה הכל. תזכורות, פגישות, רשימות - הכל במקום אחד.',
      author: 'מיכאל דוד',
      title: 'עורך דין',
    },
  ]
  
  const features = [
    {
      icon: '📅',
      title: 'לדבר עם היומן',
      description: 'פשוט תגיד למימו מה אתה צריך, והוא ידאג לכל השאר.',
    },
    {
      icon: '🔔',
      title: 'תזכורות חכמות',
      description: 'תזכורות שמגיעות בדיוק בזמן הנכון, מבוססות על ההקשר שלך.',
    },
    {
      icon: '🧠',
      title: 'זיכרון אישי',
      description: 'מימו זוכר הכל - פרטים חשובים, העדפות, והרגלים שלך.',
    },
  ]

  // Gallery images from public/photos/
  const galleryImages = [
    {
      src: '/photos/ChatGPT Image Jan 26, 2026, 04_51_35 PM.png',
      title: ''
    },
    {
      src: '/photos/ChatGPT Image Jan 26, 2026, 04_57_29 PM.png',
      title: ''
    },
    {
      src: '/photos/ChatGPT Image Jan 26, 2026, 05_06_37 PM.png',
      title: ''
    },
    {
      src: '/photos/ChatGPT Image Jan 26, 2026, 06_06_20 PM.png',
      title: ''
    }
  ]
  
  return (
    <div dir="rtl" className="min-h-screen">
      {/* Hero Section - Viewport-based positioning */}
      {/* Both video and text use viewport units (vw) for consistent coordinate system */}
      <section className="home-section bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden hero-section-root">
        {/* Video Container: Viewport-anchored, horizontally centered */}
        {/* Using 50vw (not 50%) ensures positioning relative to viewport, not parent */}
        {/* This allows text to calculate position using the same viewport coordinate system */}
        {/* Video does NOT participate in flex/grid and does NOT affect text positioning */}
        <div className="hero-video-container">
          <BackgroundVideo 
            src="/videos/dona_video.mp4"
          />
        </div>
        
        {/* Bottom fade for hero video - positioned in hero section to match video */}
        <div className="hero-image-fade"></div>
        
        {/* Text Container: Viewport-anchored, positioned to the right of video using math */}
        {/* Forbidden zone: Video's right edge = 50vw + (var(--hero-video-width) / 2) */}
        {/* Text starts at: calc(50vw + (var(--hero-video-width) / 2) + var(--hero-gap)) */}
        {/* Using viewport units (vw) ensures both video and text share the same coordinate system */}
        <div className="hero-text-container">
          <div className="hero-text-content">
            {/* Logo above header */}

            

            
            {/* Main Headline */}
            {/* Mobile: text-3xl (smaller), Desktop: text-7xl (larger) */}
            <div className="mb-6 leading-tight">
              <ScrollReveal
                as="h1"
                baseOpacity={0}
                enableBlur={true}
                baseRotation={5}
                blurStrength={10}
                containerClassName="text-3xl md:text-7xl font-bold"
                textClassName="theme-gradient-text"
              >
                המזכירה האישית  ב-WhatsApp
              </ScrollReveal>
              <br />
              <BlurText
                as="h1"
                delay={150}
                animateBy="words"
                direction="top"
                className="text-3xl md:text-7xl font-bold text-gray-900"
              />
            </div>
            
            {/* Subheadline */}
            {/* Mobile: text-base (smaller), Desktop: text-2xl (larger) */}

            
            {/* CTA Buttons */}
            {/* Mobile: Smaller buttons, right-aligned. Desktop: Normal size, left-aligned */}
            <div className="flex flex-row gap-3 md:gap-4 items-start hero-buttons-mobile">
              <Link to="/login">
                <StarBorder color="var(--theme-accent)" speed="5s" className="w-full">
                  <Button variant="primary">
                    התחל עכשיו
                  </Button>
                </StarBorder>
              </Link>
              <Link to="/superpowers">
                <Button variant="secondary">
                  גלה יכולות
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Gallery Section - Replaces Feature Cards Section */}
      <section className="home-section bg-white relative py-16 md:py-24">
        <div className="section-fade-top hero-to-stats-fade"></div>
        <div className="section-fade-bottom stats-to-cta-fade"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 section-content">
          <div>
            <BlurText
              text="בוא נדבר תאכלס , שום אפליקציית TODO  לא עובדת. אנחנו מתעצלים 😴 או שוכחים 🧠 להוסיף משימות ותזכורות בעצמנו📝, מהיום דונה המזכירה האישית שלך עושה הכל בשבילך ✨! ללא עוד אפליקציה מיותרת 📱, פשוט תבקש ממנה בשפה טבעית מה אתה רוצה והיא תדאג לכל השאר !"
              delay={120}
              animateBy="words"
              direction="top"
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 max-w-4xl mx-auto leading-relaxed"
            />
            <div className="mb-8">
              <Gallery images={galleryImages} scrollStep={400} />
            </div>
            <div className="flex justify-center mt-8">
              <Link to="/superpowers">
                <Button variant="primary" size="large" className="flex items-center gap-2">
                  לכל היכולות של דונה
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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
            text="הצטרף לאלפי משתמשים שכבר מנהלים את החיים שלהם עם מימו"
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
