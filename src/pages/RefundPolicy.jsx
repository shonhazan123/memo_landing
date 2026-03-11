import React from 'react'
import { Link } from 'react-router-dom'
import './RefundPolicy.css'

const RefundPolicy = () => {
  return (
    <div dir="rtl" className="refund-page">
      <div className="refund-container">
        <Link to="/" className="refund-back-link">
          <span className="refund-back-arrow" aria-hidden>←</span>
          חזרה לדף הבית
        </Link>

        <header className="refund-header">
          <h1 className="refund-title">Cancellation &amp; Refund Policy</h1>
          <p className="refund-subtitle">Donna AI</p>
          <span className="refund-updated">Last updated: 11 March 2026</span>
        </header>

        <div className="refund-intro">
          <p>
            This Cancellation &amp; Refund Policy (&quot;Policy&quot;) governs subscription cancellation, billing, refunds, and related matters for Donna AI (&quot;Donna&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). By subscribing to or using Donna AI, you agree to this Policy. Capitalized terms used but not defined here have the meanings given in our Terms of Service.
          </p>
        </div>

        <article className="refund-content">
          <section id="subscription-nature" className="refund-section">
            <h2>1. Subscription Nature of the Service</h2>
            <p>Donna AI is offered as a subscription-based Software-as-a-Service (SaaS) product. By purchasing a subscription plan, you obtain access to the platform and its features for the duration of the selected billing cycle.</p>
            <p>Subscriptions may be billed on a monthly or annual basis, depending on the plan selected at the time of purchase. Access to the service is granted immediately upon successful payment confirmation.</p>
          </section>

          <section id="cancellation-by-user" className="refund-section">
            <h2>2. Cancellation by the User</h2>
            <p>You may cancel your subscription at any time through your account settings or by contacting support.</p>
            <p>When a subscription is cancelled:</p>
            <ul>
              <li>The cancellation will take effect at the end of the current billing period.</li>
              <li>You will retain access to the Donna AI service until the billing cycle expires.</li>
              <li>No additional charges will occur after the cancellation takes effect.</li>
              <li>Cancelling a subscription does not retroactively terminate the current billing cycle.</li>
            </ul>
          </section>

          <section id="refund-policy" className="refund-section">
            <h2>3. Refund Policy</h2>
            <p>Due to the immediate access to digital services and system resources, Donna AI generally operates under a no-refund policy once a billing cycle has started.</p>
            <p>Refunds may only be granted under limited circumstances, including:</p>
            <ul>
              <li>Duplicate billing</li>
              <li>Technical errors resulting in incorrect charges</li>
              <li>Billing mistakes caused by system malfunction</li>
            </ul>
            <p>Refund requests must be submitted within seven (7) days of the transaction date. All refund requests are reviewed on a case-by-case basis. Donna AI reserves the right to approve or decline refund requests at its sole discretion.</p>
          </section>

          <section id="free-trial" className="refund-section">
            <h2>4. Free Trial (If Applicable)</h2>
            <p>If a free trial is offered:</p>
            <ul>
              <li>You will not be charged during the trial period.</li>
              <li>If the subscription is not cancelled before the trial ends, the selected plan will automatically convert into a paid subscription.</li>
              <li>You are responsible for cancelling the trial before the billing date if you do not wish to continue with the service.</li>
            </ul>
          </section>

          <section id="automatic-renewal" className="refund-section">
            <h2>5. Automatic Renewal</h2>
            <p>All subscriptions automatically renew at the end of each billing period unless cancelled beforehand. By subscribing, you authorize Donna AI to charge the provided payment method for recurring subscription fees according to the selected plan.</p>
          </section>

          <section id="failed-payments" className="refund-section">
            <h2>6. Failed Payments</h2>
            <p>If a payment fails or cannot be processed:</p>
            <ul>
              <li>Donna AI may temporarily suspend access to the service.</li>
              <li>The system may attempt to retry the payment automatically.</li>
              <li>If payment is not successfully processed within a reasonable period, the subscription may be cancelled.</li>
            </ul>
          </section>

          <section id="termination-by-donna" className="refund-section">
            <h2>7. Termination by Donna AI</h2>
            <p>Donna AI reserves the right to suspend or terminate accounts if users:</p>
            <ul>
              <li>Violate the Terms of Service</li>
              <li>Abuse the platform</li>
              <li>Engage in fraudulent payment activity</li>
            </ul>
            <p>In such cases, refunds may not be issued.</p>
          </section>

          <section id="account-deletion" className="refund-section">
            <h2>8. Account Deletion</h2>
            <p>You may request permanent account deletion. Account deletion will:</p>
            <ul>
              <li>Terminate access to the service</li>
              <li>Remove stored user data in accordance with the Privacy Policy</li>
            </ul>
            <p>Deletion does not automatically trigger refunds for active subscriptions.</p>
          </section>

          <section id="policy-updates" className="refund-section">
            <h2>9. Policy Updates</h2>
            <p>Donna AI may update this Cancellation &amp; Refund Policy periodically. You will be notified of material changes through the website or email. Continued use of the service after policy updates constitutes acceptance of the revised policy.</p>
          </section>

          <section id="contact" className="refund-section refund-contact-section">
            <h2>Contact</h2>
            <p>For questions regarding cancellations or refunds, contact us at:</p>
            <div className="refund-contact-box">
              <p><strong>Email:</strong> <a href="mailto:support@donnaai.app">support@donnaai.app</a></p>
              <p><strong>Website:</strong> <a href="https://donnai.io" target="_blank" rel="noopener noreferrer">https://donnai.io</a></p>
            </div>
          </section>
        </article>
      </div>
    </div>
  )
}

export default RefundPolicy
