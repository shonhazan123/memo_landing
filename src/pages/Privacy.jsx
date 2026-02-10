import React from 'react'
import { Link } from 'react-router-dom'
import './Privacy.css'

const Privacy = () => {
  return (
    <div dir="rtl" className="privacy-page">
      <div className="privacy-container">
        <Link to="/" className="privacy-back-link">
          <span className="privacy-back-arrow" aria-hidden>←</span>
          חזרה לדף הבית
        </Link>

        <header className="privacy-header">
          <h1 className="privacy-title">מדיניות פרטיות</h1>
          <p className="privacy-subtitle">Donna</p>
          <span className="privacy-updated">עדכון אחרון: 9 בפברואר 2026</span>
        </header>

        <div className="privacy-intro">
          <p>
            Donna AI (&quot;Donna&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is an AI-powered personal assistant available via WhatsApp and related web interfaces. This Privacy Policy explains how we collect, use, store, protect, and delete personal information when you use Donna AI.
          </p>
          <p>By using Donna AI, you agree to the terms of this Privacy Policy.</p>
        </div>

        <article className="privacy-content">
          <section id="info-we-collect" className="privacy-section">
            <h2>1. Information We Collect</h2>
            <h3>1.1 Information You Provide</h3>
            <p>When you interact with Donna AI, you may provide:</p>
            <ul>
              <li>Text messages</li>
              <li>Voice messages (which are transcribed to text)</li>
              <li>Images (such as screenshots, photos, or documents)</li>
              <li>Tasks, reminders, notes, lists, and free-form ideas</li>
              <li>Commands related to calendar and email management</li>
            </ul>

            <h3>1.2 Automatically Collected Information</h3>
            <p>We automatically collect limited technical and usage data, including:</p>
            <ul>
              <li>WhatsApp user identifier (phone number or WhatsApp ID)</li>
              <li>Message timestamps</li>
              <li>Language preference (Hebrew / English)</li>
              <li>Timezone and date context</li>
              <li>System metadata required to execute requests (intent type, execution status, error states)</li>
            </ul>

            <h3>1.3 Third-Party Account Data (Optional)</h3>
            <p>If you choose to connect external services, Donna AI may access limited data from:</p>
            <ul>
              <li><strong>Google Calendar</strong> – events, availability, reminders</li>
              <li><strong>Gmail</strong> – email content and metadata, only when you explicitly request an action</li>
            </ul>
            <p>Access to third-party services is granted only after your explicit authorization and can be revoked at any time.</p>
          </section>

          <section id="how-we-use" className="privacy-section">
            <h2>2. How We Use Your Information</h2>
            <p>Your information is used only to:</p>
            <ul>
              <li>Execute your requests (tasks, reminders, calendar events, emails)</li>
              <li>Maintain short-term conversational context</li>
              <li>Store and retrieve long-term notes or memories upon request</li>
              <li>Improve system accuracy, reliability, and performance</li>
              <li>Detect errors, prevent abuse, and maintain service security</li>
            </ul>
            <p>We do not use your data for advertising, profiling, or resale.</p>
          </section>

          <section id="ai-processing" className="privacy-section">
            <h2>3. AI Processing and Automation</h2>
            <p>Donna AI uses artificial intelligence to understand and act on user requests. This includes:</p>
            <ul>
              <li>Natural language understanding</li>
              <li>Audio transcription</li>
              <li>Image analysis</li>
              <li>Task planning and orchestration</li>
              <li>Semantic search across stored memories</li>
            </ul>
            <p>AI processing is execution-focused only. Donna AI does not perform automated decision-making that produces legal, financial, or similarly significant effects.</p>
          </section>

          <section id="memory-storage" className="privacy-section">
            <h2>4. Memory and Data Storage</h2>
            <h3>4.1 Short-Term Memory</h3>
            <p>Recent conversation context may be temporarily stored to:</p>
            <ul>
              <li>Resolve ambiguities</li>
              <li>Understand references to previous messages</li>
              <li>Enable follow-up actions</li>
            </ul>
            <p>This data is limited in scope and automatically minimized.</p>

            <h3>4.2 Long-Term Memory (&quot;Second Brain&quot;)</h3>
            <p>When you explicitly store ideas, notes, or thoughts:</p>
            <ul>
              <li>They are securely stored</li>
              <li>Indexed for semantic retrieval</li>
              <li>Accessed only when you ask for them</li>
            </ul>
            <p>You may request deletion of this data at any time.</p>
          </section>

          <section id="voice-image" className="privacy-section">
            <h2>5. Voice and Image Data</h2>
            <ul>
              <li>Voice messages are transcribed and processed as text</li>
              <li>Images are analyzed only to extract information required to fulfill your request</li>
              <li>Voice and image data are not reused, not published, and not shared externally</li>
              <li>Media data is retained only as long as necessary to complete the requested action</li>
            </ul>
          </section>

          <section id="security" className="privacy-section">
            <h2>6. Data Security, Encryption, and Limited Use</h2>
            <p>Donna AI is built with privacy-by-design principles.</p>
            <h3>Encryption</h3>
            <ul>
              <li>All data is transmitted using encrypted connections (HTTPS / TLS)</li>
              <li>Stored data is encrypted at rest</li>
              <li>Authentication credentials and access tokens are securely stored and isolated</li>
            </ul>
            <h3>Purpose Limitation</h3>
            <p>All information provided to Donna AI is:</p>
            <ul>
              <li>Stored only for the operation of the service</li>
              <li>Used exclusively to fulfill user-initiated requests</li>
              <li>Never processed for advertising or behavioral profiling</li>
            </ul>
            <h3>No External Data Sharing</h3>
            <p>Donna AI does not:</p>
            <ul>
              <li>Sell user data</li>
              <li>Rent user data</li>
              <li>Share personal data with outside parties for marketing or analytics</li>
            </ul>
            <p>Third-party services (such as WhatsApp, Google Calendar, and Gmail) receive only the minimum information required to perform the specific action you requested, and only with your consent.</p>
            <h3>Internal Access Control</h3>
            <ul>
              <li>User data is accessible only to authorized system components</li>
              <li>No human review of personal content unless required for security or legal compliance</li>
              <li>All AI processing is automated</li>
            </ul>
          </section>

          <section id="retention" className="privacy-section">
            <h2>7. Data Retention</h2>
            <p>We retain data only for as long as necessary:</p>
            <ul>
              <li>Tasks and reminders: until completed or deleted</li>
              <li>Notes and memories: until you delete them</li>
              <li>System logs and metadata: retained for a limited time for security and debugging, then automatically removed</li>
            </ul>
          </section>

          <section id="deletion" className="privacy-section">
            <h2>8. Data Deletion</h2>
            <p>You may request deletion of your data at any time.</p>
            <p>Deletion options include:</p>
            <ul>
              <li>Sending a deletion request via WhatsApp (e.g., &quot;Delete my data&quot;)</li>
              <li>Contacting us by email at privacy@donnaai.app</li>
            </ul>
            <p>Upon deletion:</p>
            <ul>
              <li>All stored tasks, reminders, notes, and memories are removed</li>
              <li>Third-party access tokens are revoked</li>
              <li>Your identifier is removed from active systems</li>
            </ul>
            <p>Deletion is permanent and cannot be undone.</p>
          </section>

          <section id="rights" className="privacy-section">
            <h2>9. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Request correction or deletion</li>
              <li>Withdraw consent</li>
              <li>Disconnect third-party integrations</li>
            </ul>
            <p>Requests can be made by contacting us directly.</p>
          </section>

          <section id="children" className="privacy-section">
            <h2>10. Children&apos;s Privacy</h2>
            <p>Donna AI is not intended for children under the age of 13. We do not knowingly collect personal data from children.</p>
          </section>

          <section id="changes" className="privacy-section">
            <h2>11. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Material changes will be published on this page. Continued use of Donna AI constitutes acceptance of the updated policy.</p>
          </section>

          <section id="contact" className="privacy-section privacy-contact-section">
            <h2>12. Contact Information</h2>
            <p>For privacy-related questions or requests, contact us at:</p>
            <div className="privacy-contact-box">
              <p><strong>Email:</strong> <a href="mailto:privacy@donnaai.app">privacy@donnaai.app</a></p>
              <p><strong>Website:</strong> <a href="https://donnai.io" target="_blank" rel="noopener noreferrer">https://donnai.io</a></p>
            </div>
          </section>
        </article>
      </div>
    </div>
  )
}

export default Privacy
