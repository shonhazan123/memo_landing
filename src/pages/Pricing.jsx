import React, { useState } from 'react'
import PricingCard from '../components/Card/PricingCard'
import Button from '../components/Button/Button'
import StarBorder from '../components/StarBorder/StarBorder'

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-lg font-semibold text-gray-900 text-right"
      >
        <span>{question}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <p className="text-gray-600 mt-2 text-right">{answer}</p>
      )}
    </div>
  )
}

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly') // 'monthly' or 'annual'
  
  const plans = {
    monthly: [
      {
        name: 'בסיסי',
        price: '₪49',
        period: 'חודש',
        features: [
          'תזכורות ללא הגבלה',
          'רשימות מרובות',
          'תמיכה ב-WhatsApp',
          'סנכרון עם Google Calendar',
        ],
      },
      {
        name: 'מקצועי',
        price: '₪99',
        originalPrice: '₪149',
        period: 'חודש',
        savings: '33%',
        badge: 'הכי פופולרי',
        isPopular: true,
        features: [
          'כל מה שבבסיסי',
          'תזכורות חכמות',
          'נודניקים',
          'זיכרון אישי',
          'עדיפות בתמיכה',
        ],
      },
      {
        name: 'עסקי',
        price: '₪199',
        period: 'חודש',
        features: [
          'כל מה שבמקצועי',
          'משתמשים מרובים',
          'ניהול צוות',
          'דוחות מתקדמים',
          'תמיכה ייעודית',
        ],
      },
    ],
    annual: [
      {
        name: 'בסיסי',
        price: '₪390',
        originalPrice: '₪588',
        period: 'חודש',
        savings: '33%',
        features: [
          'תזכורות ללא הגבלה',
          'רשימות מרובות',
          'תמיכה ב-WhatsApp',
          'סנכרון עם Google Calendar',
        ],
      },
      {
        name: 'מקצועי',
        price: '₪790',
        originalPrice: '₪1,788',
        period: 'חודש',
        savings: '40%',
        badge: 'הכי פופולרי',
        isPopular: true,
        features: [
          'כל מה שבבסיסי',
          'תזכורות חכמות',
          'נודניקים',
          'זיכרון אישי',
          'עדיפות בתמיכה',
        ],
      },
      {
        name: 'עסקי',
        price: '₪1,590',
        originalPrice: '₪2,388',
        period: 'חודש',
        savings: '33%',
        features: [
          'כל מה שבמקצועי',
          'משתמשים מרובים',
          'ניהול צוות',
          'דוחות מתקדמים',
          'תמיכה ייעודית',
        ],
      },
    ],
  }
  
  const features = [
    { icon: '🔄', label: 'תזכורות ללא הגבלה' },
    { icon: '📝', label: 'רשימות מרובות' },
    { icon: '🔔', label: 'תזכורות חכמות' },
    { icon: '⏰', label: 'נודניקים' },
    { icon: '🧠', label: 'זיכרון אישי' },
    { icon: '👥', label: 'משתמשים מרובים' },
  ]
  
  const comingSoon = [
    { name: '📧 Gmail', label: 'Gmail' },
    { name: '📱 SMS', label: 'SMS' },
    { name: '📞 טלפון', label: 'טלפון' },
    { name: '🤖 AI מתקדם', label: 'AI מתקדם' },
  ]
  
  const faqs = [
    {
      question: 'איך מתחילים?',
      answer: 'פשוט לחץ על "נסה עכשיו", התחבר עם Google, ומיד תוכל להתחיל לדבר עם מימו ב-WhatsApp.',
    },
    {
      question: 'האם יש תקופת ניסיון?',
      answer: 'כן! כל התוכניות כוללות תקופת ניסיון של 14 יום ללא תשלום. תוכל לבטל בכל עת.',
    },
    {
      question: 'מה קורה אם אני רוצה לבטל?',
      answer: 'אתה יכול לבטל את המנוי שלך בכל עת מלוח הבקרה. לא יהיו חיובים נוספים לאחר הביטול.',
    },
    {
      question: 'האם המידע שלי בטוח?',
      answer: 'כן, אנו משתמשים בהצפנה מתקדמת ושומרים על כל המידע שלך פרטי ובטוח. אנו עומדים בתקני אבטחה מחמירים.',
    },
  ]
  
  const currentPlans = plans[billingPeriod]
  
  return (
    <div dir="rtl" className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900">
            תמחור פשוט וברור
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            בחר את התוכנית שמתאימה לך. כל התוכניות כוללות תקופת ניסיון של 14 יום.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-stone-900 border border-white/20 rounded-full p-1 flex items-center gap-2">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  billingPeriod === 'monthly'
                    ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white'
                    : 'text-white'
                }`}
              >
                חודשי
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`px-6 py-2 rounded-full transition-all duration-300 relative ${
                  billingPeriod === 'annual'
                    ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white'
                    : 'text-white'
                }`}
              >
                שנתי
                <span className="absolute -top-2 -right-2 bg-green-500 text-xs px-2 py-1 rounded-full text-black">
                  -40%
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Cards */}
      <section className="py-8 bg-zinc-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentPlans.map((plan, index) => (
              <PricingCard
                key={index}
                name={plan.name}
                price={plan.price}
                originalPrice={plan.originalPrice}
                period={plan.period}
                savings={plan.savings}
                badge={plan.badge}
                isPopular={plan.isPopular}
                features={plan.features}
                onCtaClick={() => window.location.href = '/login'}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Feature Comparison */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-center mb-8 text-gray-900">
            השווה יכולות
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-2xl shadow-lg text-center"
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <div className="text-white text-xs font-medium">{feature.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Coming Soon */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            בקרוב
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {comingSoon.map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-xl border-2 border-dashed border-gray-300 text-center"
              >
                <div className="text-gray-600">{item.name}</div>
                <div className="text-gray-600 text-sm mt-2">בקרוב</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-12 text-gray-900">
            שאלות נפוצות
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            מוכן להתחיל?
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            התחל תקופת ניסיון של 14 יום ללא תשלום
          </p>
          <a href="/login">
            <StarBorder color="#EC4899" speed="5s" className="rounded-full">
              <Button variant="primary" size="large">
                התחל עכשיו
              </Button>
            </StarBorder>
          </a>
        </div>
      </section>
    </div>
  )
}

export default Pricing

