import React, { useState, useMemo } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getSafeRedirectPath } from '../lib/auth-redirect'
import api from '../api/client'
import Logo from '../components/Logo/Logo'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { loginWithToken } = useAuth()

  const redirectPath = useMemo(
    () => getSafeRedirectPath(searchParams.get('redirect')) || '/',
    [searchParams]
  )

  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [notRegistered, setNotRegistered] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setNotRegistered(false)

    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 9) {
      setError('אנא הזן מספר טלפון תקין')
      return
    }

    setIsLoading(true)
    try {
      const result = await api.users.checkPhone(phoneNumber)

      if (result.registered && result.jwtToken) {
        await loginWithToken(result.jwtToken)
        navigate(redirectPath, { replace: true })
        return
      }

      setNotRegistered(true)
    } catch (err) {
      setError(err.message || 'שגיאה בהתחברות')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div dir="rtl" className="login-page">
      <div className="login-decorations">
        <div className="login-decoration login-decoration-1" />
        <div className="login-decoration login-decoration-2" />
      </div>

      <div className="login-card-wrapper">
        <div className="login-card">
          <div className="login-logo">
            <Logo size="lg" />
          </div>

          <h1 className="login-title">התחברות</h1>
          <p className="login-subtitle">הזן את מספר הוואטסאפ שלך כדי להתחבר</p>

          <form onSubmit={handleSubmit}>
            <label className="login-label">מספר הוואטסאפ שלך</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">📱</span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value)
                  setNotRegistered(false)
                  setError(null)
                }}
                placeholder="050-123-4567"
                className="login-input"
                dir="ltr"
                autoFocus
              />
            </div>

            {error && (
              <div className="login-error">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {notRegistered && (
              <div className="login-not-registered">
                <span>המספר לא רשום במערכת.</span>
                <Link to="/signup" className="login-signup-inline">הרשמה</Link>
              </div>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="login-spinner" />
              ) : (
                'התחבר'
              )}
            </button>
          </form>

          <div className="login-footer">
            <span>אין לך חשבון?</span>
            <Link to="/signup" className="login-signup-link">הרשמה</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
