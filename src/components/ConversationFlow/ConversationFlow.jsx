import React, { useRef, useEffect } from 'react'
import './ConversationFlow.css'

const ConversationFlow = () => {
  const sectionRefs = useRef([])

  useEffect(() => {
    const sections = sectionRefs.current.filter(Boolean)
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, observerOptions)
    sections.forEach((el) => observer.observe(el))
    return () => sections.forEach((el) => observer.unobserve(el))
  }, [])
  const conversations = [
    {
      id: 1,
      heading: 'כותבים לה הודעה בוואטסאפ',
      subheading: 'במילים שלכם, בלי פקודות מסובכות',
      userMessage: (
        <>היי דונה, יש לי כמה דברים על הראש. אני צריך לשלם חשבון חשמל בערב, לתזכר את רום על הפגישה ברביעי בבוקר ולזרוק את הזבל בשמונה אחרי העבודה</>
      ),
      donnaResponse: (
        <>
          סידרתי לך הכל !<br />
          הוספתי עבורך שלושה תזכורות:<br />
          <br />

          <strong>לשלם חשבון חשמל</strong> 🏦<br />
          זמן: היום ב-20:00<br />
          <br />
          <strong>לתזכר את רום על הפגישה</strong> 📆<br />
          זמן: יום רביעי 4 בפבואר , 08:00<br />
          <br />
          <strong>לזרוק את הזבל</strong> 🗑️<br />
          זמן: היום ב-20:00<br />
          <br />
          צריך משהו נוסף ? אני כאן 😊
        </>
      ),
      timestamp: '10:30'
    },
    {
      id: 2,
      heading: 'דונה מבינה תמונות',
      subheading: 'שולחים הזמנה — דונה קוראת ומוסיפה ליומן',
      userImage: '/photos/Invatation.jpeg',
      userMessage: null,
      donnaResponse: (
        <>
          מצאתי הזמנה לאירוע חלאקה של אימרי! 🎉<br />
          <br />
          תאריך: 30 בינואר 2026 🗓️<br />
          שעה: 10:30 ⏰<br />
          מיקום: אולם בית הכנסת "קול יעקב",<br />
          הנביאים 22, מודיעין<br />
          <br />
          תרצה שאוסיף את האירוע הזה ליומן שלך או שאקבע תזכורת? 😊
        </>
      ),
      timestamp: '17:59'
    },
    {
      id: 3,
      heading: 'מבינה את היומן שלכם',
      subheading: 'בודקת זמינות ומשיבה מיד',
      userMessage: <>יש לי זמן לפגישה מחר בצהריים?</>,
      donnaResponse: (
        <>
          בודקת את היומן שלך... ✅<br />
          <br />
          יש לך זמן מחר ב-15:00  בצהריים!<br />
          <br />
          רוצה שאקבע את הפגישה?
        </>
      ),
      timestamp: '16:45'
    },
    {
      id: 4,
      heading: 'מתחילה את היום איתכם',
      subheading: 'אין סיכוי שלא תדעו מה מביא היום!',
      donnaOnly: true,
      donnaResponse: (
        <>
          בוקר טוב! ☀️<br />
          <br />
          זה מה שמחכה לך היום, ינואר 23, 2026:<br />
          <br />
          ביומן היום: 📅<br />
          08:00 - אימון בחדר כושר 🕒<br />
          10:00 – חלקה לאימרי 🕒<br />
          13:00 - טיול שטח עם רואי 🕒<br />
          <br />
          משימות להיום: ✅<br />
          • לקבוע תור לספר (13:00)<br />
          <br />
          משימות לא מתוזמנות: 📝<br />
          • לחדש ביטוח לרכב<br />
          • לחזור לאיציק על ההצעת מחיר<br />
          <br />
          אם תרצה, אוכל לעזור לך לתכנן את המשימות הלא מתוזמנות 🤔<br />
          <br />
          יום מוצלח ובהצלחה! 💪
        </>
      ),
      timestamp: '16:13'
    }
  ]

  return (
    <div className="conversation-flow-container">
      {conversations.map((conversation, index) => (
        <div
          key={conversation.id}
          ref={(el) => (sectionRefs.current[index] = el)}
          className="conversation-section scenario"
        >
          {/* Scenario header – above each conversation */}
          <div className="scenario-header">
            <h2 className="scenario-heading">{conversation.heading}</h2>
            <p className="scenario-subheading">{conversation.subheading}</p>
          </div>

          {/* WhatsApp container: Donna header + messages */}
          <div className="whatsapp-wrapper">
          <div className="donna-header">
            <div className="donna-header-content">
              <div className="donna-avatar">
                <img src="/photos/donna_whatssap_hero.png" alt="Donna" className="donna-avatar-img" />
              </div>
              <div className="donna-name-section">
                <div className="donna-name">Donna</div>
                <div className="donna-status">מקוון</div>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="messages-container">
            {/* User Message (hidden when donnaOnly) */}
            {!conversation.donnaOnly && (
              <div className="user-message-bubble">
                <div className={`message-content ${conversation.userImage ? 'message-content--image' : ''}`}>
                  {conversation.userImage ? (
                    <>
                      <img src={conversation.userImage} alt="הזמנה לאירוע" className="user-message-image" />
                      <div className="message-timestamp">{conversation.timestamp}</div>
                    </>
                  ) : (
                    <>
                      <p className="message-text">{conversation.userMessage}</p>
                      <div className="message-timestamp">{conversation.timestamp}</div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Donna Response */}
            <div className="donna-message-bubble">
              <div className="message-content">
                <p className="message-text">{conversation.donnaResponse}</p>
                <div className="message-footer">
                  <svg width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.00118164 0.561182L7.87706 8.43882" stroke="#3B82F6" strokeWidth="1" strokeLinecap="round"/>
                  </svg>
                  <span className="message-timestamp">{conversation.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Arrow below each conversation – scroll cue (hidden on last) */}
          {index < conversations.length - 1 && (
            <div className="scenario-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flow-arrow">
                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}

          {/* Divider (except for last conversation) */}
          {index < conversations.length - 1 && (
            <div className="conversation-divider">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.49648 7.49648L22.5035 19.4988" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ConversationFlow

