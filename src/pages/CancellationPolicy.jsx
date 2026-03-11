import React from 'react'
import { Link } from 'react-router-dom'
import './CancellationPolicy.css'

const CancellationPolicy = () => {
  return (
    <div dir="rtl" className="cancellation-page">
      <div className="cancellation-container">
        <Link to="/" className="cancellation-back-link">
          <span className="cancellation-back-arrow" aria-hidden>←</span>
          חזרה לדף הבית
        </Link>

        <header className="cancellation-header">
          <h1 className="cancellation-title">מדיניות ביטול עסקה</h1>
          <p className="cancellation-subtitle">Donna AI</p>
          <span className="cancellation-updated">עדכון אחרון: מרץ 2026</span>
        </header>

        <article className="cancellation-content">
          <section id="klali" className="cancellation-section">
            <h2>1. כללי</h2>
            <p>השירות של Donna AI מסופק כשירות דיגיטלי במודל מנוי (Subscription).</p>
            <p>ברכישת מנוי לשירות, המשתמש מקבל גישה למערכת וליכולותיה לתקופת החיוב שנבחרה.</p>
            <p>השירות מהווה <strong>עסקה מתמשכת</strong> כהגדרתה בחוק הגנת הצרכן, התשמ״א-1981.</p>
          </section>

          <section id="right-to-cancel" className="cancellation-section">
            <h2>2. זכות ביטול בהתאם לחוק הגנת הצרכן</h2>
            <p>בהתאם ל<strong>חוק הגנת הצרכן</strong>, צרכן רשאי לבטל עסקה מתמשכת בכל עת.</p>
            <p>ביטול העסקה ייכנס לתוקף בתוך 3 ימי עסקים ממועד קבלת הודעת הביטול, או במועד מאוחר יותר לפי בקשת הצרכן.</p>
            <p>לאחר כניסת הביטול לתוקף:</p>
            <ul>
              <li>לא ייגבו חיובים נוספים עבור תקופות עתידיות.</li>
              <li>הגישה לשירות תישאר פעילה עד לסיום תקופת החיוב שכבר שולמה.</li>
            </ul>
          </section>

          <section id="how-to-cancel" className="cancellation-section">
            <h2>3. אופן הגשת בקשת ביטול</h2>
            <p>ניתן להגיש בקשת ביטול באמצעות אחת מהדרכים הבאות:</p>
            <ul>
              <li>דרך הגדרות החשבון באתר</li>
              <li>באמצעות פנייה לדוא״ל התמיכה של החברה או בטלפון</li>
            </ul>
            <p>הודעת הביטול צריכה לכלול:</p>
            <ul>
              <li>שם מלא</li>
              <li>מספר טלפון או כתובת אימייל המשויכת לחשבון</li>
              <li>בקשה מפורשת לביטול המנוי</li>
            </ul>
          </section>

          <section id="refunds" className="cancellation-section">
            <h2>4. החזרים כספיים</h2>
            <p>במקרה של ביטול מנוי:</p>
            <ul>
              <li>לא יינתן החזר כספי עבור התקופה שכבר נוצלה.</li>
              <li>החיוב יופסק עבור מחזורי חיוב עתידיים בלבד.</li>
            </ul>
            <p>במקרים חריגים כגון:</p>
            <ul>
              <li>חיוב כפול</li>
              <li>תקלה טכנית במערכת החיוב</li>
            </ul>
            <p>ייתכן שיוחלט על החזר כספי בהתאם לשיקול דעת החברה.</p>
          </section>

          <section id="auto-renewal" className="cancellation-section">
            <h2>5. חידוש אוטומטי</h2>
            <p>המנוי מתחדש אוטומטית בסוף כל מחזור חיוב אלא אם בוטל על ידי המשתמש.</p>
            <p>ברכישת מנוי, המשתמש מאשר לחברה לחייב את אמצעי התשלום שסופק עבור חידושי המנוי בהתאם לתכנית שנבחרה.</p>
          </section>

          <section id="termination-by-company" className="cancellation-section">
            <h2>6. הפסקת שירות על ידי החברה</h2>
            <p>החברה רשאית להשעות או להפסיק את השירות במקרים של:</p>
            <ul>
              <li>הפרת תנאי השימוש</li>
              <li>שימוש לרעה במערכת</li>
              <li>פעילות בלתי חוקית או הונאה</li>
            </ul>
            <p>במקרים אלו ייתכן שלא יינתן החזר כספי.</p>
          </section>

          <section id="policy-updates" className="cancellation-section">
            <h2>7. עדכון המדיניות</h2>
            <p>החברה רשאית לעדכן מדיניות זו מעת לעת. המשך שימוש בשירות לאחר עדכון המדיניות מהווה הסכמה לתנאים המעודכנים.</p>
          </section>

          <section id="contact" className="cancellation-section cancellation-contact-section">
            <h2>יצירת קשר</h2>
            <p>לבקשות ביטול או שאלות בנושא מדיניות ביטול עסקה:</p>
            <div className="cancellation-contact-box">
              <p><strong>אימייל תמיכה:</strong> <a href="mailto:donnai.help@gmail.com">donnai.help@gmail.com</a></p>
              <p><strong>טלפון:</strong> <a href="tel:+972543911602">054-391-1602</a></p>
              <p><strong>אתר:</strong> <a href="https://donnai.io" target="_blank" rel="noopener noreferrer">https://donnai.io</a></p>
            </div>
          </section>
        </article>
      </div>
    </div>
  )
}

export default CancellationPolicy
