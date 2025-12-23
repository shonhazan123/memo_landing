import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button/Button'
import FeatureCard from '../components/Card/FeatureCard'
import TestimonialCard from '../components/Card/TestimonialCard'
import StarBorder from '../components/StarBorder/StarBorder'
import Logo from '../components/Logo/Logo'
import heroImage from '../components/Logo/ChatGPT Image Dec 19, 2025, 03_40_34 PM.png'
import CardSwap, { Card } from '../components/CardSwap/CardSwap'
import ScrollReveal from '../components/ScrollReveal/ScrollReveal'
import BlurText from '../components/BlurText/BlurText'
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
  
  return (
    <div dir="rtl" className="min-h-screen">
      {/* Hero Section */}
      <section className="home-section bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-20 md:py-32 relative overflow-hidden" style={{ height: '1400px' }}>
        <div className="section-fade-bottom hero-to-stats-fade"></div>
        {/* Bottom fade for hero image - covers entire hero section */}
        <div className="hero-image-fade"></div>
        {/* Hero Image with transparency and fade */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-full h-full max-w-4xl mx-auto">
            <img 
              src={heroImage} 
              alt="מימו" 
              className="w-full h-auto opacity-80 md:opacity-40 object-contain"
              style={{
                filter: 'blur(0.5px)',
                maskImage: 'radial-gradient(ellipse 80% 70% at center, black 40%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at center, black 40%, transparent 100%)',
              }}
            />
            {/* Gradient overlay to fade image colors into background */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse 80% 70% at center, transparent 10%, rgba(238, 242, 255, 0.6) 60%, rgba(250, 245, 255, 0.8) 80%, rgba(253, 242, 248, 1) 100%)',
                mixBlendMode: 'multiply',
              }}
            />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 section-content">
          <div className="text-center max-w-3xl mx-auto">
            {/* Logo above header */}
            <div className="flex justify-center mb-0">
              <Logo size="xl" className="hover:scale-105 transition-transform duration-300" />
            </div>
            
            {/* Rating Stars */}
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-amber-400 text-2xl">★</span>
              ))}
            </div>
            
            {/* Main Headline */}
            <div className="mb-6 leading-tight">
              <ScrollReveal
                as="h1"
                baseOpacity={0}
                enableBlur={true}
                baseRotation={5}
                blurStrength={10}
                containerClassName="text-5xl md:text-7xl font-bold"
                textClassName="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent"
              >
                המזכיר האישי שלך
              </ScrollReveal>
              <br />
              <BlurText
                as="h1"
                text="ב-WhatsApp"
                delay={150}
                animateBy="words"
                direction="top"
                className="text-5xl md:text-7xl font-bold text-gray-900"
              />
            </div>
            
            {/* Subheadline */}
            <BlurText
              text="דע את היומן שלך, קבל תזכורות חכמות, ונהל את המשימות שלך - הכל בשיחה פשוטה עם מימו"
              delay={100}
              animateBy="words"
              direction="bottom"
              className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed"
            />
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/login">
                <StarBorder color="#EC4899" speed="5s" className="rounded-full">
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
          
          {/* Feature Cards Preview */}
          <div className="mt-16">
            <BlurText
              text="ניהול הזמן שלך מתבצע במקום אחד, בלי עוד אפליקציות שדורשות תכנון ניהול, פשוט שגר מה שעל הראש!"
              delay={120}
              animateBy="words"
              direction="top"
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 max-w-4xl mx-auto leading-relaxed"
            />
            <div className="flex justify-center items-center" style={{ height: '700px', position: 'relative' }}>
              <CardSwap
                cardDistance={80}
                verticalDistance={90}
                delay={5000}
                pauseOnHover={false}
                width={500}
                height={450}
              >
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  customClass="bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl md:rounded-3xl overflow-hidden"
                >
                  <div className="p-6 md:p-8 h-full flex flex-col">
                    {feature.icon && (
                      <div className="text-4xl mb-4">
                        {feature.icon}
                      </div>
                    )}
                    <h3 className="text-3xl md:text-4xl font-bold mb-4">{feature.title}</h3>
                    {feature.description && (
                      <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
                        {feature.description}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
              </CardSwap>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="home-section py-1 bg-white relative" style={{ paddingBottom: '15px' }}>
        <div className="section-fade-top hero-to-stats-fade"></div>
        <div className="section-fade-bottom stats-to-cta-fade"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-content relative z-10" style={{ display: 'grid', flexWrap: 'wrap', marginTop: '0px', paddingTop: '10px', paddingBottom: '10px' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-2">
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
            <StarBorder color="#EC4899" speed="5s" className="rounded-full">
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

