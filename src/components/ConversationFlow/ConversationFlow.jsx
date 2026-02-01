import React from 'react'
import './ConversationFlow.css'

const ConversationFlow = () => {
  const conversations = [
    {
      id: 1,
      userMessage: 'היי דונה , יש לי כמה דברים על הראש. אני צריל לשלם חשבון חשמל בערב , לתזכר את רום על הפגישה ברביעי בבוקר ולזרוק את הזבל בשמונה אחרי העבודה',
      donnaResponse: 'סידרתי לך הכל !  הוספתי עבורך שלושה תזכורות: לשלם חשבון חשמל 🏦 זמן: היום ב-20:00 לתזכר את רום על הפגישה 📆 זמן: יום רביעי 4 בפבואר , 08:00 לזרוק את הזבל 🗑️ זמן: היום ב-20:00 צריך משהו נוסף ? אני כאן 😊',
      timestamp: '10:30'
    },
    {
      id: 2,
      userMessage: 'תזכיר לי לסיים את המצגת',
      donnaResponse: 'תזכורת נוצרה: לסיים את המצגת ⏰ זמן: היום ב-18:00 אעדכן אותך כשתסיים! 💪',
      timestamp: '14:20'
    },
    {
      id: 3,
      userMessage: 'יש לי זמן לפגישה מחר בצהריים?',
      donnaResponse: 'בודקת את היומן שלך... ✅ יש לך זמן מחר בצהריים! רוצה שאקבע את הפגישה?',
      timestamp: '16:45'
    },
    {
      id: 4,
      userMessage: 'בוקר טוב',
      donnaResponse: 'בוקר טוב! ☀️ הנה הסיכום היומי שלך: 📅 3 פגישות היום ⏰ 2 תזכורות חשובות 📝 1 משימה שצריך לסיים רוצה שאתחיל עם משהו ספציפי?',
      timestamp: '08:00'
    }
  ]

  return (
    <div className="conversation-flow-container">
      {conversations.map((conversation, index) => (
        <div key={conversation.id} className="conversation-section">
          {/* Donna Header */}
          <div className="donna-header">
            <div className="donna-header-content">
              <div className="donna-name-section">
                <div className="donna-name">Donna</div>
                <div className="donna-status">{conversation.timestamp}</div>
              </div>
              <div className="donna-avatar"></div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="messages-container">
            {/* User Message */}
            <div className="user-message-bubble">
              <div className="message-content">
                <p className="message-text">{conversation.userMessage}</p>
                <div className="message-timestamp">{conversation.timestamp}</div>
              </div>
            </div>

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

