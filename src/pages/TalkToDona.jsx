/**
 * Talk to Dona Page
 * Post-signup / post-payment destination.
 * Shows account summary, WhatsApp CTA, and payment success confirmation overlay.
 */

import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import StarBorder from '../components/StarBorder/StarBorder'
import Logo from '../components/Logo/Logo'
import './TalkToDona.css'

const TalkToDona = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    user,
    isAuthenticated,
    isLoading,
    completeOnboarding,
    getWhatsAppUrl,
    signupState
  } = useAuth()

  const [whatsappUrl, setWhatsappUrl] = useState('https://wa.me/972501234567')
  const paymentResult = searchParams.get('payment')
  const [showPaymentCard, setShowPaymentCard] = useState(false)
  const [paymentReturnReady, setPaymentReturnReady] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/signup', { replace: true })
    }
  }, [isLoading, isAuthenticated, navigate])

  useEffect(() => {
    const fetchUrl = async () => {
      const url = await getWhatsAppUrl("היי דונה , איך את יכולה לעזור לי ? 🤔")
      setWhatsappUrl(url)
    }
    if (isAuthenticated) fetchUrl()
  }, [getWhatsAppUrl, isAuthenticated])

  useEffect(() => {
    if (paymentResult === 'success') {
      const timer = setTimeout(() => {
        setPaymentReturnReady(true)
        setShowPaymentCard(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [paymentResult])

  useEffect(() => {
    if (!showPaymentCard || !paymentResult) return
    const t = setTimeout(() => {
      dismissPayment()
    }, 8000)
    return () => clearTimeout(t)
  }, [showPaymentCard, paymentResult])

  const dismissPayment = () => {
    setShowPaymentCard(false)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('payment')
      return next
    }, { replace: true })
  }

  const handleStartConversation = async () => {
    await completeOnboarding()
    window.open(whatsappUrl, '_blank')
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="talk-to-dona-page">
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div dir="rtl" className="talk-to-dona-page min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      {/* Decorative elements */}
      <div className="signup-decorations">
        <div className="decoration decoration-1"></div>
        <div className="decoration decoration-2"></div>
        <div className="decoration decoration-3"></div>
      </div>

      {/* Payment loading overlay */}
      {paymentResult === 'success' && !paymentReturnReady && (
        <div className="pricing-return-loading" aria-live="polite">
          <div className="pricing-return-loading-content">
            <div className="pricing-return-loading-spinner" />
            <p className="pricing-return-loading-text">טוען...</p>
          </div>
        </div>
      )}

      {/* Payment success overlay */}
      {showPaymentCard && paymentResult === 'success' && (
        <div className="pricing-result-overlay" role="dialog" aria-modal="true" aria-label="תוצאת תשלום">
          <div className="pricing-result-backdrop" aria-hidden="true" onClick={dismissPayment} />
          <div className="pricing-result-card-wrapper" onClick={(e) => e.stopPropagation()}>
            <div className="pricing-message-card pricing-message-success">
              <div className="pricing-message-icon success">
                <span className="text-white text-3xl">✓</span>
              </div>
              <h3 className="pricing-message-title">התשלום בוצע בהצלחה. תודה.</h3>
              <button type="button" onClick={dismissPayment} className="pricing-message-dismiss">אישור</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-2xl">
          {/* Celebration */}
          <div className="flex justify-center mb-6">
            <div className="celebration-container">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-bounce-slow">
                <span className="text-white text-5xl">🎉</span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            מושלם! הכל מוכן
          </h1>

          <p className="text-lg text-gray-600 mb-8 text-center">
            עכשיו נותר רק להתחיל שיחה עם דונה בוואטסאפ
          </p>

          {/* Account summary */}
          <div className="mb-8 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
            <h3 className="font-semibold text-gray-900 mb-4 text-right">פרטי החשבון שלך:</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-900">{user?.email}</span>
                <span className="text-gray-500">📧 אימייל</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dir-ltr">{user?.whatsappNumber || signupState.whatsappNumber}</span>
                <span className="text-gray-500">📱 וואטסאפ</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-green-600 font-medium">מחובר ✓</span>
                <span className="text-gray-500">📅 יומן גוגל</span>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <StarBorder color="#25D366" speed="4s" className="rounded-full w-full mb-4">
            <button
              onClick={handleStartConversation}
              className="whatsapp-btn w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white text-xl font-semibold rounded-full hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>התחל שיחה עם דונה</span>
            </button>
          </StarBorder>

          <button
            onClick={() => navigate('/')}
            className="w-full py-3 text-gray-600 hover:text-indigo-600 transition-colors"
          >
            חזור לדף הבית
          </button>
        </div>
      </div>
    </div>
  )
}

export default TalkToDona
