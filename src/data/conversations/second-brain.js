/**
 * Conversation examples for Second Brain (מוח שני)
 * Showcases storing and recalling info: contacts, meeting summaries, bills.
 * Order: right-to-left (first card = contact, then meeting, then electricity).
 * Same topic grouped in one conversation phone with multiple user/agent interactions.
 */

export const conversations = [
  // 1. Contact — first (rightmost in RTL)
  {
    id: 1,
    heading: 'שמירה ושליפת פרטי קשר',
    subheading: 'דונה שומרת טלפון, אימייל והקשר — ומחזירה בטבעיות',
    exchanges: [
      {
        userMessage: `תזכרי את הפרטים של דני כהן

טלפון: 054-7777777
אימייל: dani@email.com
הוא קבלן שיפוצים`,
        donnaResponse: 'שמרתי את פרטי הקשר של דני כהן.',
        timestamp: '09:30'
      },
      {
        userMessage: 'מה הטלפון של דני כהן?',
        donnaResponse: 'הטלפון של דני כהן הוא 054-7777777.',
        timestamp: '12:10'
      }
    ]
  },
  // 2. Meeting summary
  {
    id: 2,
    heading: 'סיכום פגישה ושליפה',
    subheading: 'דונה שומרת פרטים מורכבים — ומחזירה בדיוק מה ששמרת',
    exchanges: [
      {
        userMessage: `תזכרי סיכום פגישה

דיברנו על שיתוף פעולה עם חברת פרסום
הם רוצים להתחיל פיילוט של חודש
והתקציב שהציעו הוא 10,000 שקל`,
        donnaResponse: 'שמרתי את סיכום הפגישה.',
        timestamp: '14:00'
      },
      {
        userMessage: 'מה היה הסיכום של הפגישה עם חברת הפרסום?',
        donnaResponse: `דיברתם על פיילוט של חודש לשיתוף פעולה,
והתקציב שהוצע היה 10,000 שקל.`,
        timestamp: '16:45'
      }
    ]
  },
  // 3. Electricity bill (4 interactions: store → update → confirm)
  {
    id: 3,
    heading: 'שמירה, עדכון ואישור מידע',
    subheading: 'דונה מזהה מידע ישן, מציעה לעדכן ומאשרת',
    exchanges: [
      {
        userMessage: 'תזכרי שהחשבון חשמל שלי הוא 400 שקל',
        donnaResponse: 'שמרתי את חשבון החשמל שלך.',
        timestamp: '10:15'
      },
      {
        userMessage: 'תזכרי שהחשבון חשמל עכשיו 500',
        donnaResponse: `מצאתי מידע קודם שבו חשבון החשמל היה 400.
האם לעדכן את הערך ל-500?`,
        timestamp: '11:22'
      },
      {
        userMessage: 'כן',
        donnaResponse: 'מעולה, עדכנתי את החשבון ל-500.',
        timestamp: '11:23'
      }
    ]
  }
]
