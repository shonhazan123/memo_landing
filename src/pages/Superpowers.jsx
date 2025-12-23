import React, { useEffect, useRef } from 'react'
import FeatureCard from '../components/Card/FeatureCard'
import StarBorder from '../components/StarBorder/StarBorder'

const Superpowers = () => {
  const featureRefs = useRef([])
  
  useEffect(() => {
    const observers = featureRefs.current.map((ref) => {
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
    if (el && !featureRefs.current.includes(el)) {
      featureRefs.current.push(el)
    }
  }
  const features = [
    {
      icon: '📅',
      title: 'לדבר עם היומן',
      description: 'פשוט תגיד למימו מה אתה צריך, והוא ידאג לכל השאר. תזמין פגישות, תבטל, תשנה - הכל בשיחה טבעית.',
      benefits: [
        'תזמון פגישות בשפה טבעית',
        'ביטול ושינוי פגישות בקלות',
        'סנכרון אוטומטי עם Google Calendar',
        'תזכורות לפני פגישות',
      ],
      color: 'indigo-600',
    },
    {
      icon: '🔔',
      title: 'תזכורות חכמות',
      description: 'תזכורות שמגיעות בדיוק בזמן הנכון, מבוססות על ההקשר שלך והמיקום שלך.',
      benefits: [
        'תזכורות מבוססות מיקום',
        'תזכורות מבוססות זמן',
        'תזכורות מותאמות אישית',
        'התראות חכמות',
      ],
      color: 'purple-600',
    },
    {
      icon: '🔄',
      title: 'תזכורות חוזרות',
      description: 'הגדר תזכורת פעם אחת, ומימו יזכיר לך באופן אוטומטי בכל פעם שצריך.',
      benefits: [
        'תזכורות יומיות',
        'תזכורות שבועיות',
        'תזכורות חודשיות',
        'תזכורות מותאמות אישית',
      ],
      color: 'pink-600',
    },
    {
      icon: '⏰',
      title: 'נודניקים',
      description: 'תזכורות שממשיכות להגיע עד שתבצע את המשימה. מושלם למשימות חשובות שלא רוצים לשכוח.',
      benefits: [
        'תזכורות חוזרות עד ביצוע',
        'התאמה אישית של תדירות',
        'עדיפויות למשימות חשובות',
        'ללא הגבלה',
      ],
      color: 'amber-500',
    },
    {
      icon: '📝',
      title: 'רשימות',
      description: 'נהל את כל הרשימות שלך במקום אחד. רשימת קניות, משימות, רעיונות - הכל נגיש בקלות.',
      benefits: [
        'רשימות מרובות',
        'עריכה ושיתוף קלים',
        'סנכרון אוטומטי',
        'גישה מכל מקום',
      ],
      color: 'green-600',
    },
    {
      icon: '🧠',
      title: 'זיכרון אישי',
      description: 'מימו זוכר הכל - פרטים חשובים, העדפות, הרגלים, וכל מה שצריך לדעת עליך.',
      benefits: [
        'זיכרון של פרטים אישיים',
        'התאמה אישית מלאה',
        'למידה מההרגלים שלך',
        'חיפוש מהיר במידע',
      ],
      color: 'gradient',
    },
  ]
  
  return (
    <div dir="rtl" className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                היכולות של מימו
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
              כל מה שצריך כדי לנהל את החיים שלך בקלות. כל יכולת היא כמו כוח על שמקל עליך את החיים.
            </p>
          </div>
        </div>
      </section>
      
      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                ref={addToRefs}
                className="opacity-0 transform translate-y-8 transition-all duration-600 ease-out"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  benefits={feature.benefits}
                  className="h-full hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            מוכן להתחיל להשתמש בכוחות האלה?
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            התחל עכשיו וקבל גישה לכל היכולות האלה
          </p>
          <a href="/login">
            <StarBorder color="#EC4899" speed="5s" className="rounded-full">
              <button className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-xl font-semibold px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all">
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

