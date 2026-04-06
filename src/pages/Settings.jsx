import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'
import { Mail, Calendar, RefreshCw, AlertTriangle, LogOut, CreditCard, ExternalLink, Sunrise, CheckCircle2 } from 'lucide-react'
import './Settings.css'

const GMAIL_SCOPE = 'https://www.googleapis.com/auth/gmail.modify'
const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar'

const PLAN_LABELS = {
  free: 'Free',
  standard: 'Standard',
  pro: 'Pro'
}

const PLAN_FEATURES = {
  free: ['גישה בסיסית לדונה', 'תזכורות פשוטות'],
  standard: ['גישה מלאה לדונה', 'ניהול יומן גוגל', 'תזכורות חכמות'],
  pro: ['גישה מלאה לדונה', 'ניהול יומן גוגל', 'ניהול Gmail', 'תזכורות חכמות מתקדמות']
}

// ─── Profile Section ─────────────────────────────────────
const ProfileSection = ({ user }) => {
  const createdDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('he-IL', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
    : '—'

  const fields = [
    { label: 'שם', value: user?.name || '—' },
    { label: 'אימייל', value: user?.email || '—' },
    { label: 'וואטסאפ', value: user?.whatsappNumber || '—' },
    { label: 'תאריך הצטרפות', value: createdDate }
  ]

  return (
    <div className="settings-card">
      <h2 className="settings-section-title">פרטים אישיים</h2>
      <div className="profile-fields">
        {fields.map((field, i) => (
          <div key={i} className="profile-field">
            <span className="profile-label">{field.label}</span>
            <span className="profile-value">{field.value}</span>
            {i < fields.length - 1 && <div className="field-divider" />}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Connection Row ──────────────────────────────────────
const ConnectionRow = ({ icon: Icon, label, connected, email }) => (
  <div className="connection-row">
    <div className="connection-info">
      <Icon className="connection-icon" />
      <div className="connection-details">
        <span className="connection-label">{label}</span>
        {connected && email && (
          <span className="connection-email">{email}</span>
        )}
      </div>
    </div>
    <div className="connection-status">
      <span className={`status-dot ${connected ? 'status-connected' : 'status-disconnected'}`} />
      <span className={`status-text ${connected ? 'text-green-600' : 'text-red-500'}`}>
        {connected ? 'מחובר' : 'לא מחובר'}
      </span>
    </div>
  </div>
)

// ─── Morning brief time (wall clock in users.timezone, not UTC) ─────────────
const MorningBriefSection = ({ user, onSaved }) => {
  const serverTime = user?.morningBriefTime || '08:00'
  const tz = user?.timezone || 'Asia/Jerusalem'
  const [value, setValue] = useState(serverTime)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [showSaved, setShowSaved] = useState(false)

  useEffect(() => {
    setValue(serverTime)
  }, [serverTime])

  useEffect(() => {
    if (!showSaved) return undefined
    const t = setTimeout(() => setShowSaved(false), 4000)
    return () => clearTimeout(t)
  }, [showSaved])

  const dirty = value !== serverTime

  const handleTimeChange = (e) => {
    setShowSaved(false)
    setError(null)
    setValue(e.target.value)
  }

  const handleSave = async () => {
    setError(null)
    setShowSaved(false)
    setIsSaving(true)
    try {
      await api.users.updateMorningBriefTime(value)
      if (onSaved) await onSaved()
      setShowSaved(true)
    } catch (e) {
      setError(e?.message || 'שמירה נכשלה')
    }
    setIsSaving(false)
  }

  return (
    <div className="settings-card">
      <h2 className="settings-section-title morning-brief-title">
        <Sunrise className="morning-brief-title-icon" aria-hidden />
        שעת תדריך הבוקר
      </h2>
      <p className="morning-brief-hint">
        השעה נשמרת לפי <strong>אזור הזמן של החשבון שלך</strong> ({tz}) — לא UTC.
        סוכנים אחרים משתמשים בשילוב של השעה הזו עם האזור הזה כדי לתזמן את התדריך.
      </p>
      <div className="morning-brief-row">
        <label htmlFor="morning-brief-time" className="morning-brief-label">
          שעת שליחה
        </label>
        <input
          id="morning-brief-time"
          type="time"
          className="morning-brief-time-input"
          value={value}
          onChange={handleTimeChange}
          step={60}
        />
      </div>
      {showSaved && (
        <p className="morning-brief-success" role="status">
          <CheckCircle2 className="morning-brief-success-icon" aria-hidden />
          השעה נשמרה בהצלחה
        </p>
      )}
      {error && <p className="morning-brief-error" role="alert">{error}</p>}
      <button
        type="button"
        className="morning-brief-save"
        onClick={handleSave}
        disabled={isSaving || !dirty}
      >
        {isSaving ? 'שומר...' : 'שמור שעה'}
      </button>
    </div>
  )
}

// ─── Connections Section ─────────────────────────────────
const ConnectionsSection = ({ user, onReconnect, isRedirecting }) => {
  const scopes = Array.isArray(user?.googleScopes) ? user.googleScopes : []
  const hasGoogleLinked = !!user?.email
  const gmailConnected = scopes.includes(GMAIL_SCOPE)
  // Calendar: connected if we have calendar scope, or if Google is linked but scope list wasn't returned (e.g. API/table mismatch)
  const calendarConnected = scopes.includes(CALENDAR_SCOPE) || (hasGoogleLinked && scopes.length === 0)

  return (
    <div className="settings-card">
      <h2 className="settings-section-title">חיבורים</h2>
      <div className="connections-list">
        <ConnectionRow
          icon={Mail}
          label="ג'ימייל"
          connected={gmailConnected}
          email={user?.email}
        />
        <ConnectionRow
          icon={Calendar}
          label="יומן גוגל"
          connected={calendarConnected}
          email={user?.email}
        />
      </div>
      <button
        className="reconnect-button"
        onClick={onReconnect}
        disabled={isRedirecting}
      >
        <RefreshCw className={`w-4 h-4 ${isRedirecting ? 'animate-spin' : ''}`} />
        <span>{isRedirecting ? 'מעביר לגוגל...' : 'החלף חשבון גוגל'}</span>
      </button>
    </div>
  )
}

// ─── Subscription Section ────────────────────────────────
const SubscriptionSection = ({ user, onChangePlan, onCancelClick, onDeleteClick }) => {
  const planType = user?.planType || 'free'
  const features = PLAN_FEATURES[planType] || PLAN_FEATURES.free
  const subscriptionStatus = user?.subscriptionStatus || 'active'
  const cancelAtPeriodEnd = user?.cancelAtPeriodEnd
  const subscriptionPeriodEnd = user?.subscriptionPeriodEnd
  const firstChargeDate = user?.firstChargeDate

  const isTrial = subscriptionStatus === 'trial'
  const periodEndDisplay = subscriptionPeriodEnd
    ? new Date(subscriptionPeriodEnd).toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <div className="settings-card">
      <h2 className="settings-section-title">מנוי</h2>
      <div className="plan-header">
        <div className="plan-info">
          <span className="plan-badge">{PLAN_LABELS[planType] || planType}</span>
          <span className="plan-type-label">המסלול הנוכחי שלך</span>
        </div>
      </div>
      {isTrial && firstChargeDate && (
        <p className="plan-trial-message">
          תקופת ניסיון — החיוב הראשון ב־{periodEndDisplay}
        </p>
      )}
      {cancelAtPeriodEnd && periodEndDisplay && (
        <p className="plan-cancel-pending-message">
          המנוי יסתיים ב־{periodEndDisplay}. לא יגבה חיוב נוסף.
        </p>
      )}
      <ul className="plan-features">
        {features.map((feature, i) => (
          <li key={i} className="plan-feature">
            <span className="feature-check">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="plan-actions">
        <button className="change-plan-button" onClick={onChangePlan}>
          <CreditCard className="w-4 h-4" />
          <span>שנה מסלול</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-50" />
        </button>
        <button className="cancel-plan-button" onClick={onCancelClick}>
          בטל מנוי
        </button>
        <button className="delete-account-button" onClick={onDeleteClick}>
          מחק חשבון
        </button>
      </div>
    </div>
  )
}

// ─── Confirmation Modals (Signup-quality: rounded card, clear typography) ──────────────────────────────────
const CancelSubscriptionModal = ({ isOpen, periodEndDisplay, onConfirm, onCancel, isSubmitting }) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <span className="text-white text-2xl">⏱</span>
          </div>
        </div>
        <h3 className="modal-title">בטל מנוי</h3>
        <p className="modal-body">
          ביטול ייכנס לתוקף עד סוף תקופת החיוב. לא ייגבו חיובים נוספים.
          {periodEndDisplay && (
            <> הגישה תישאר פעילה עד <strong>{periodEndDisplay}</strong>.</>
          )}
        </p>
        <div className="modal-actions">
          <button
            className="modal-confirm modal-confirm-cancel-sub"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'מבטל...' : 'אשר ביטול מנוי'}
          </button>
          <button
            className="modal-cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            חזור
          </button>
        </div>
      </div>
    </div>
  )
}

const DeleteModal = ({ isOpen, onConfirm, onCancel, isDeleting }) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="modal-title">מחק חשבון</h3>
        <p className="modal-body">
          פעולה זו תמחק את החשבון ואת כל המידע הקשור אליו לצמיתות. סוכן הוואטסאפ יפסיק לפעול.
          <br />
          <span className="modal-body-hint">לביטול מנוי בלבד (ללא מחיקת נתונים) השתמש ב״בטל מנוי״.</span>
          <br />
          <a href="mailto:donnai.help@gmail.com" className="modal-support-link">צריך עזרה? donnai.help@gmail.com</a>
        </p>
        <div className="modal-actions">
          <button
            className="modal-confirm"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'מוחק...' : 'מחק את החשבון שלי'}
          </button>
          <button
            className="modal-cancel"
            onClick={onCancel}
            disabled={isDeleting}
          >
            ביטול
          </button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
//  Settings Page
// ═══════════════════════════════════════════════════════════
const Settings = () => {
  const navigate = useNavigate()
  const { user, disconnect, reconnectGoogle, deleteAccount, isRedirectingToOAuth, refreshUser, getWhatsAppUrl } = useAuth()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [whatsappUrl, setWhatsappUrl] = useState('https://wa.me/972501234567')

  useEffect(() => {
    const fetchUrl = async () => {
      const url = await getWhatsAppUrl('היי דונה!')
      setWhatsappUrl(url)
    }
    fetchUrl()
  }, [getWhatsAppUrl])

  const handleDisconnect = () => {
    disconnect()
    navigate('/')
  }

  const handleChangePlan = () => {
    navigate('/pricing')
  }

  const handleCancelSubscriptionConfirm = async () => {
    setIsCancelling(true)
    try {
      const result = await api.users.cancelSubscription()
      if (result?.user && refreshUser) await refreshUser()
      setShowCancelModal(false)
    } catch (err) {
      console.error(err)
    }
    setIsCancelling(false)
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    const result = await deleteAccount()
    if (result.success) {
      navigate('/')
    }
    setIsDeleting(false)
  }

  const periodEndDisplay = user?.subscriptionPeriodEnd
    ? new Date(user.subscriptionPeriodEnd).toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <div className="settings-container">
      <ProfileSection user={user} />
      <MorningBriefSection user={user} onSaved={refreshUser} />
      <ConnectionsSection
        user={user}
        onReconnect={reconnectGoogle}
        isRedirecting={isRedirectingToOAuth}
      />
      <SubscriptionSection
        user={user}
        onChangePlan={handleChangePlan}
        onCancelClick={() => setShowCancelModal(true)}
        onDeleteClick={() => setShowDeleteModal(true)}
      />

      {/* Talk to Dona (same CTA as signup CompletedStep) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="settings-whatsapp-cta"
      >
        <span className="settings-whatsapp-cta-inner">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          המשך שיחה עם דונה
        </span>
      </a>

      {/* Disconnect button */}
      <div className="disconnect-section">
        <button className="disconnect-button" onClick={handleDisconnect}>
          <LogOut className="w-4 h-4" />
          <span>התנתק מהאתר</span>
        </button>
      </div>

      <CancelSubscriptionModal
        isOpen={showCancelModal}
        periodEndDisplay={periodEndDisplay}
        onConfirm={handleCancelSubscriptionConfirm}
        onCancel={() => setShowCancelModal(false)}
        isSubmitting={isCancelling}
      />
      <DeleteModal
        isOpen={showDeleteModal}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
        isDeleting={isDeleting}
      />
    </div>
  )
}

export default Settings
