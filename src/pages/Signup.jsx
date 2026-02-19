/**
 * Signup Page - Multi-step Authentication Flow
 * Step 1: Google Sign-in
 * Step 2: Phone Number Input
 * Step 3: WhatsApp Conversation Redirect
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, SIGNUP_STEPS } from '../context/AuthContext'
import Button from '../components/Button/Button'
import Logo from '../components/Logo/Logo'
import StarBorder from '../components/StarBorder/StarBorder'
import './Signup.css'

/**
 * Google Sign-in Step Component
 *
 * Three visual states:
 *   1. Idle       → Google button + change-phone link
 *   2. Redirecting → spinner + cancel button (recoverable)
 *   3. Loading     → short API spinner (getGoogleAuthUrl call)
 */
const GoogleAuthStep = ({
  onSignIn,
  onGoBackToPhone,
  onCancelRedirect,
  isLoading,
  isRedirecting,
  error,
  whatsappNumber
}) => {
  // Show the idle / interactive view when NOT loading and NOT redirecting
  const showIdleView = !isLoading && !isRedirecting

  return (
    <div className="signup-step fade-in">
      {/* Success checkmark */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-scale-in">
          <span className="text-white text-4xl">✓</span>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
        מספר הטלפון אומת בהצלחה! ✓
      </h1>

      {/* Explanation */}
      <p className="text-lg text-gray-600 mb-8 text-center">
        עכשיו נחבר את היומן שלך בגוגל כדי שדונה תוכל לנהל את הפגישות שלך.
      </p>

      {/* Show phone number that was entered */}
      {whatsappNumber && (
        <div className="mb-8 p-4 bg-indigo-50 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-gray-900 dir-ltr font-medium">{whatsappNumber}</span>
            <span className="text-gray-500">📱 מספר וואטסאפ</span>
          </div>
        </div>
      )}

      {/* Benefits List */}
      <ul className="space-y-3 mb-8">
        <li className="flex items-center text-gray-700 bg-indigo-50/50 px-4 py-3 rounded-xl">
          <span className="text-indigo-600 text-xl ml-3">✓</span>
          <span>גישה בטוחה ליומן</span>
        </li>
        <li className="flex items-center text-gray-700 bg-purple-50/50 px-4 py-3 rounded-xl">
          <span className="text-purple-600 text-xl ml-3">✓</span>
          <span>סנכרון אוטומטי</span>
        </li>
        <li className="flex items-center text-gray-700 bg-pink-50/50 px-4 py-3 rounded-xl">
          <span className="text-pink-600 text-xl ml-3">✓</span>
          <span>שליטה מלאה בהרשאות</span>
        </li>
      </ul>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-2 text-red-600">
            <span className="text-xl">⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* ── Redirecting to Google (recoverable spinner) ── */}
      {isRedirecting && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 mb-6">ממתין לחיבור גוגל...</p>

          {/* Cancel → returns to idle so user can retry or go back */}
          <button
            type="button"
            onClick={onCancelRedirect}
            className="py-2 px-6 text-gray-500 hover:text-indigo-600 border border-gray-300 rounded-full transition-colors text-sm"
          >
            ביטול
          </button>

          {onGoBackToPhone && (
            <button
              type="button"
              onClick={onGoBackToPhone}
              className="mt-3 py-2 text-gray-400 hover:text-indigo-500 transition-colors text-xs"
            >
              שינוי מספר טלפון
            </button>
          )}
        </div>
      )}

      {/* ── Short API loading (fetching auth URL) ── */}
      {isLoading && !isRedirecting && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">מתחבר לגוגל...</p>
        </div>
      )}

      {/* ── Idle view: button + links ── */}
      {showIdleView && (
        <>
          {/* Google Sign-In Button */}
          <button
            onClick={onSignIn}
            className="google-signin-btn w-full py-4 px-6 bg-white border-2 border-gray-200 rounded-full text-lg font-semibold text-gray-700 hover:border-indigo-400 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>התחבר עם Google</span>
          </button>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <span className="text-lg">🔒</span>
            <span className="text-sm text-gray-500">מאובטח ופרטי</span>
          </div>

          {/* Change phone number */}
          {onGoBackToPhone && (
            <button
              type="button"
              onClick={onGoBackToPhone}
              className="w-full mt-6 py-3 text-gray-500 hover:text-indigo-600 transition-colors text-sm"
            >
              שינוי מספר טלפון
            </button>
          )}
        </>
      )}
    </div>
  )
}

/**
 * Phone Number Step Component (First Step)
 */
const PhoneNumberStep = ({ onSubmit, isLoading, error, initialPhoneNumber, initialUserName }) => {
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber || '')
  const [userName, setUserName] = useState(initialUserName || '')
  const [localError, setLocalError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError(null)
    
    // Basic validation
    if (!phoneNumber || phoneNumber.length < 9) {
      setLocalError('אנא הזן מספר טלפון תקין')
      return
    }
    const trimmedName = (userName || '').trim()
    if (!trimmedName) {
      setLocalError('אנא הזן איך תרצה שדונה תקראה לך')
      return
    }
    
    const result = await onSubmit(phoneNumber, trimmedName)
    if (!result.success) {
      setLocalError(result.error)
    }
  }

  const displayError = localError || error

  return (
    <div className="signup-step fade-in">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <Logo size="lg" className="hover:scale-105 transition-transform duration-300" />
      </div>
      
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        ברוך הבא לדונה!
      </h1>
      
      <p className="text-lg text-gray-600 mb-8 text-center">
        התחל בהזנת מספר הוואטסאפ שלך
      </p>
      
      {/* Phone Number Form */}
      <form onSubmit={handleSubmit}>
        <label className="block text-gray-700 font-semibold mb-3 text-right">
          מספר הוואטסאפ שלך
        </label>
        
        <div className="relative mb-4">
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">
            📱
          </div>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="050-123-4567"
            className="phone-input w-full py-4 pr-14 pl-4 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors text-right"
            dir="ltr"
            style={{ textAlign: 'left' }}
          />
        </div>
        
        <p className="text-sm text-gray-500 mb-4 text-right">
          דונה תשלח לך הודעות והתראות לוואטסאפ הזה
        </p>

        <label className="block text-gray-700 font-semibold mb-3 text-right">
          איך תרצה שדונה תקראה לך?
        </label>
        <div className="relative mb-6">
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xl">
            👤
          </div>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="השם שלך"
            className="phone-input w-full py-4 pr-12 pl-4 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors text-right"
            dir="rtl"
          />
        </div>
        
        {/* Error Message */}
        {displayError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2 text-red-600">
              <span className="text-xl">⚠️</span>
              <span>{displayError}</span>
            </div>
          </div>
        )}
        
        {/* Submit Button */}
        <StarBorder color="var(--theme-accent)" speed="5s" className="rounded-full w-full">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>שומר...</span>
              </div>
            ) : (
              'המשך'
            )}
          </Button>
        </StarBorder>
      </form>
    </div>
  )
}

/**
 * WhatsApp Redirect Step Component
 */
const WhatsAppRedirectStep = ({ user, whatsappNumber, onComplete, getWhatsAppUrl }) => {
  const navigate = useNavigate()
  const [whatsappUrl, setWhatsappUrl] = useState('https://wa.me/972501234567')
  
  useEffect(() => {
    const fetchUrl = async () => {
      const url = await getWhatsAppUrl('היי דונה! סיימתי את ההרשמה ואני מוכן להתחיל 🎉')
      setWhatsappUrl(url)
    }
    fetchUrl()
  }, [getWhatsAppUrl])
  
  const handleStartConversation = async () => {
    await onComplete()
    window.open(whatsappUrl, '_blank')
  }
  
  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <div className="signup-step fade-in">
      {/* Celebration Animation */}
      <div className="flex justify-center mb-6">
        <div className="celebration-container">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-bounce-slow">
            <span className="text-white text-5xl">🎉</span>
          </div>
        </div>
      </div>
      
      {/* Success message */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        מושלם! הכל מוכן
      </h1>
      
      <p className="text-lg text-gray-600 mb-8 text-center">
        עכשיו נותר רק להתחיל שיחה עם דונה בוואטסאפ
      </p>
      
      {/* User summary card */}
      <div className="mb-8 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
        <h3 className="font-semibold text-gray-900 mb-4 text-right">פרטי החשבון שלך:</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-900">{user?.email}</span>
            <span className="text-gray-500">📧 אימייל</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-900 dir-ltr">{whatsappNumber}</span>
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
      
      {/* Secondary action */}
      <button
        onClick={handleGoHome}
        className="w-full py-3 text-gray-600 hover:text-indigo-600 transition-colors"
      >
        חזור לדף הבית
      </button>
    </div>
  )
}

/**
 * Completed Step Component (for returning users)
 */
const CompletedStep = ({ user, getWhatsAppUrl }) => {
  const navigate = useNavigate()
  const [whatsappUrl, setWhatsappUrl] = useState('https://wa.me/972501234567')
  
  useEffect(() => {
    const fetchUrl = async () => {
      const url = await getWhatsAppUrl('היי דונה!')
      setWhatsappUrl(url)
    }
    fetchUrl()
  }, [getWhatsAppUrl])
  
  return (
    <div className="signup-step fade-in">
      {/* Welcome back */}
      <div className="flex justify-center mb-6">
        <Logo size="lg" className="hover:scale-105 transition-transform duration-300" />
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        {user?.name ? `ברוך הבא, ${user.name.split(' ')[0]}! 👋` : 'ברוך הבא! 👋'}
      </h1>
      
      <p className="text-lg text-gray-600 mb-8 text-center">
        החשבון שלך פעיל ומחובר
      </p>
      
      {/* Quick actions */}
      <div className="space-y-4">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white text-xl font-semibold rounded-full hover:shadow-xl transition-all duration-300 text-center"
        >
          <span className="flex items-center justify-center gap-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            המשך שיחה עם דונה
          </span>
        </a>
        
        <button
          onClick={() => navigate('/')}
          className="w-full py-3 text-gray-600 hover:text-indigo-600 transition-colors"
        >
          חזור לדף הבית
        </button>
      </div>
    </div>
  )
}

/**
 * Progress Indicator Component
 */
const ProgressIndicator = ({ currentStep, SIGNUP_STEPS }) => {
  const steps = [
    { key: SIGNUP_STEPS.PHONE_NUMBER, label: 'טלפון' },
    { key: SIGNUP_STEPS.GOOGLE_AUTH, label: 'גוגל' },
    { key: SIGNUP_STEPS.WHATSAPP_REDIRECT, label: 'וואטסאפ' }
  ]
  
  const getCurrentIndex = () => {
    return steps.findIndex(s => s.key === currentStep)
  }
  
  const currentIndex = getCurrentIndex()
  
  // Don't show for completed step
  if (currentStep === SIGNUP_STEPS.COMPLETED) return null
  
  return (
    <div className="progress-indicator mb-8">
      <div className="flex items-center justify-center gap-2">
        {steps.map((step, index) => (
          <React.Fragment key={step.key}>
            <div className={`
              progress-step
              ${index <= currentIndex ? 'active' : ''}
              ${index < currentIndex ? 'completed' : ''}
            `}>
              <div className="step-circle">
                {index < currentIndex ? '✓' : index + 1}
              </div>
              <span className="step-label">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`step-line ${index < currentIndex ? 'active' : ''}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

/**
 * Main Signup Page Component
 */
const Signup = () => {
  const {
    isLoading,
    isRedirectingToOAuth,
    user,
    error,
    currentStep,
    signupState,
    signInWithGoogle,
    submitPhoneNumber,
    completeOnboarding,
    goBackToPhoneStep,
    cancelOAuthRedirect,
    getWhatsAppUrl,
    SIGNUP_STEPS
  } = useAuth()
  
  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case SIGNUP_STEPS.GOOGLE_AUTH:
        return (
          <GoogleAuthStep 
            onSignIn={signInWithGoogle}
            onGoBackToPhone={goBackToPhoneStep}
            onCancelRedirect={cancelOAuthRedirect}
            isLoading={isLoading}
            isRedirecting={isRedirectingToOAuth}
            error={error}
            whatsappNumber={signupState.whatsappNumber}
          />
        )
      
      case SIGNUP_STEPS.PHONE_NUMBER:
        return (
          <PhoneNumberStep
            onSubmit={submitPhoneNumber}
            isLoading={isLoading}
            error={error}
            initialPhoneNumber={signupState.whatsappNumber}
            initialUserName={signupState.userName}
          />
        )
      
      case SIGNUP_STEPS.WHATSAPP_REDIRECT:
        return (
          <WhatsAppRedirectStep
            user={user}
            whatsappNumber={signupState.whatsappNumber}
            onComplete={completeOnboarding}
            getWhatsAppUrl={getWhatsAppUrl}
          />
        )
      
      case SIGNUP_STEPS.COMPLETED:
        return (
          <CompletedStep
            user={user}
            getWhatsAppUrl={getWhatsAppUrl}
          />
        )
      
      default:
        return (
          <PhoneNumberStep
            onSubmit={submitPhoneNumber}
            isLoading={isLoading}
            error={error}
            initialPhoneNumber={signupState.whatsappNumber}
            initialUserName={signupState.userName}
          />
        )
    }
  }

  return (
    <div dir="rtl" className="signup-page min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      {/* Decorative elements */}
      <div className="signup-decorations">
        <div className="decoration decoration-1"></div>
        <div className="decoration decoration-2"></div>
        <div className="decoration decoration-3"></div>
      </div>
      
      <div className="max-w-md w-full">
        {/* Progress Indicator */}
        <ProgressIndicator currentStep={currentStep} SIGNUP_STEPS={SIGNUP_STEPS} />
        
        {/* Main Card */}
        <div className="signup-card bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-2xl">
          {renderStep()}
        </div>
      </div>
    </div>
  )
}

export default Signup
