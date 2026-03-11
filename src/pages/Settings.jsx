import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'
import { Mail, Calendar, User, RefreshCw, AlertTriangle, LogOut, CreditCard, ExternalLink } from 'lucide-react'
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
  const { user, disconnect, reconnectGoogle, deleteAccount, isRedirectingToOAuth, refreshUser } = useAuth()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

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
