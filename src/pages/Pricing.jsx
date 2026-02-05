import React, { useState } from 'react'
import PricingCard from '../components/Card/PricingCard'
import Button from '../components/Button/Button'
import StarBorder from '../components/StarBorder/StarBorder'
import ScrollReveal from '../components/ScrollReveal/ScrollReveal'
import BlurText from '../components/BlurText/BlurText'
import './Pricing.css'

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
        price: '₪21',
        period: 'חודש',
        features: [
          'תזכורות ללא הגבלה',
          'רשימות מרובות',
          'תמיכה ב-WhatsApp',
          'סנכרון עם Google Calendar',
          'הקלטות קוליות',
          'ניהול יומן',
          'זכרון אישי',
          'תדרוך בוקר',
        ],
      },
      {
        name: 'מקצועי',
        price: '₪28',
        period: 'חודש',
        badge: 'הכי פופולרי',
        isPopular: true,
        features: [
          'כל מה שבבסיסי',
          'סנכרון עם Gmail',
          'ניתוח תמונות',
          'תכנון מטרות והצבת יעדים',
          'תזכורות חכמות',
          'נודניקים',
          'זיכרון אישי',
          'עדיפות בתמיכה',
        ],
      },
      {
        name: 'עסקי',
        price: '₪42',
        period: 'חודש',
        features: [
          'כל מה שבמקצועי',
          'חיפוש מידע ב-Google Docs / Google Sheets',
          'סנכרון עם Google Drive',
          'יצירת מסמכים ב-Google Docs',
          'יצירת גיליונות ב-Google Sheets',
        ],
      },
    ],
    annual: [
      {
        name: 'בסיסי',
        price: '₪15',
        originalPrice: '₪21',
        period: 'חודש',
        savings: '30%',
        features: [
          'תזכורות ללא הגבלה',
          'רשימות מרובות',
          'תמיכה ב-WhatsApp',
          'סנכרון עם Google Calendar',
          'הקלטות קוליות',
          'ניהול יומן',
          'זכרון אישי',
          'תדרוך בוקר',
        ],
      },
      {
        name: 'מקצועי',
        price: '₪20',
        originalPrice: '₪28',
        period: 'חודש',
        savings: '30%',
        badge: 'הכי פופולרי',
        isPopular: true,
        features: [
          'כל מה שבבסיסי',
          'סנכרון עם Gmail',
          'ניתוח תמונות',
          'תכנון מטרות והצבת יעדים',
          'תזכורות חכמות',
          'נודניקים',
          'זיכרון אישי',
          'עדיפות בתמיכה',
        ],
      },
      {
        name: 'עסקי',
        price: '₪30',
        originalPrice: '₪42',
        period: 'חודש',
        savings: '30%',
        features: [
          'כל מה שבמקצועי',
          'חיפוש מידע ב-Google Docs / Google Sheets',
          'סנכרון עם Google Drive',
          'יצירת מסמכים ב-Google Docs',
          'יצירת גיליונות ב-Google Sheets',
        ],
      },
    ],
  }
  
  /** Feature comparison table: each row has feature name + value for בסיסי, מקצועי, עסקי. Value: true = ✓, false = —, string = shown as-is. */
  const comparisonRows = [
    { feature: 'תזכורות ללא הגבלה', basic: true, pro: true, business: true },
    { feature: 'זיכרון אישי', basic: true, pro: true, business: true },
    { feature: 'סנכרון יומן (Google Calendar)', basic: true, pro: true, business: true },
    { feature: 'יצירה וניהול רשימות', basic: true, pro: true, business: true },
    { feature: 'תזכורות לחברים', basic: '100/חודש | 20 חברים', pro: '500/חודש | 100 חברים', business: '1000/חודש | 200 חברים' },
    { feature: 'תדרוך בוקר', basic: true, pro: true, business: true },
    { feature: 'סנכרון עם Gmail', basic: false, pro: true, business: true },
    { feature: 'זיכרון ארוך טווח', basic: false, pro: true, business: true },
    { feature: 'ניתוח תמונות (Image to Action)', basic: false, pro: true, business: true },
    { feature: 'לוח בקרה מלא', basic: false, pro: true, business: true },
    { feature: 'אינטגרציית Google Workspace', basic: false, pro: false, business: true },
  ]
  
  
  const faqs = [
    {
      question: 'איך מתחילים?',
      answer: 'פשוט לחץ על "נסה עכשיו", התחבר עם Google, ומיד תוכל להתחיל לדבר עם דונה ב-WhatsApp.',
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
      <section className="py-16 md:py-24 pricing-hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BlurText
            text="מי אמר שמזכירה צריכה להיות רק לבעלי עסקים ?"
            delay={150}
            animateBy="words"
            direction="top"
            className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 pricing-hero-blurtext"
          />
          <BlurText
            text="דונה הופכת את WhatsApp למוח השני שלך — כך שתוכל לחשוב פחות ולעשות יותר."
            delay={100}
            animateBy="words"
            direction="bottom"
            className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto"
          />
        </div>
      </section>
      
      {/* Pricing Cards + Billing Toggle */}
      <section className="py-8 pricing-cards-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div 
              className="rounded-full p-1 flex items-center gap-2 justify-start"
              style={{
                background: 'radial-gradient(ellipse at 50% 50%, rgba(175, 181, 253, 1) 29%, rgba(255, 255, 255, 1) 100%)',
                border: 'none',
                boxShadow: '0px 4px 12px 10px rgba(0, 0, 0, 0.15)'
              }}
            >
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  billingPeriod === 'monthly'
                    ? 'bg-gradient-to-r from-[#A7B3E3] via-[#DB4BEA] to-[#FF6363] text-white'
                    : 'text-white'
                }`}
              >
                חודשי
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`px-6 py-2 rounded-full transition-all duration-300 relative ${
                  billingPeriod === 'annual'
                    ? 'theme-gradient-bg text-white'
                    : 'text-white'
                }`}
              >
                שנתי
                <span className="absolute -top-2 -right-2 bg-green-500 text-xs px-2 py-1 rounded-full text-black">
                  -30%
                </span>
              </button>
            </div>
          </div>
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
      
      {/* Feature Comparison Table */}
      <section className="py-16 pricing-comparison-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            baseRotation={5}
            blurStrength={10}
            containerClassName="text-2xl font-semibold text-center mb-8 text-gray-900"
          >
            השווה יכולות
          </ScrollReveal>
          <div className="pricing-comparison-table-wrapper">
            <table className="pricing-comparison-table" dir="rtl">
              <thead>
                <tr>
                  <th className="pricing-comparison-th pricing-comparison-th-feature">יכולות</th>
                  <th className="pricing-comparison-th">בסיסי</th>
                  <th className="pricing-comparison-th pricing-comparison-th-popular">
                    <span className="pricing-comparison-badge">הכי פופולרי</span>
                    מקצועי
                  </th>
                  <th className="pricing-comparison-th">עסקי</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, index) => (
                  <tr key={index} className={index % 2 === 1 ? 'pricing-comparison-row-alt' : ''}>
                    <td className="pricing-comparison-td pricing-comparison-td-feature">{row.feature}</td>
                    <td className="pricing-comparison-td pricing-comparison-cell">
                      {row.basic === true && <span className="pricing-comparison-check">✓</span>}
                      {row.basic === false && <span className="pricing-comparison-dash">—</span>}
                      {typeof row.basic === 'string' && <span>{row.basic}</span>}
                    </td>
                    <td className="pricing-comparison-td pricing-comparison-cell pricing-comparison-cell-popular">
                      {row.pro === true && <span className="pricing-comparison-check pricing-comparison-check-popular">✓</span>}
                      {row.pro === false && <span className="pricing-comparison-dash">—</span>}
                      {typeof row.pro === 'string' && <span className="pricing-comparison-value-popular">{row.pro}</span>}
                    </td>
                    <td className="pricing-comparison-td pricing-comparison-cell">
                      {row.business === true && <span className="pricing-comparison-check">✓</span>}
                      {row.business === false && <span className="pricing-comparison-dash">—</span>}
                      {typeof row.business === 'string' && <span>{row.business}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      

      
      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlurText
            text="שאלות נפוצות"
            delay={150}
            animateBy="words"
            direction="top"
            className="text-4xl md:text-6xl font-bold text-center mb-12 text-gray-900"
          />
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-16 pricing-cta-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
            text="התחל תקופת ניסיון של 14 יום ללא תשלום"
            delay={100}
            animateBy="words"
            direction="bottom"
            className="text-xl md:text-2xl text-gray-700 mb-8"
          />
          <a href="/login">
            <StarBorder color="var(--theme-accent)" speed="5s" className="rounded-full">
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

