/**
 * Conversation examples for Second Brain (מוח שני)
 * Showcases storing and recalling info: bills, meeting summaries, contacts.
 */

export const conversations = [
  {
    id: 1,
    heading: 'שמירת חשבון חשמל',
    subheading: 'דונה שומרת ומאשרת',
    userMessage: 'תזכרי שהחשבון חשמל שלי הוא 400 שקל',
    donnaResponse: 'שמרתי את חשבון החשמל שלך.',
    timestamp: '10:15'
  },
  {
    id: 2,
    heading: 'עדכון מידע קיים',
    subheading: 'דונה מזהה מידע ישן ומציעה לעדכן',
    userMessage: 'תזכרי שהחשבון חשמל עכשיו 500',
    donnaResponse: `מצאתי מידע קודם שבו חשבון החשמל היה 400.
האם לעדכן את הערך ל-500?`,
    timestamp: '11:22'
  },
  {
    id: 3,
    heading: 'אישור עדכון',
    subheading: 'דונה מעדכנת ומאשרת',
    userMessage: 'כן',
    donnaResponse: 'מעולה, עדכנתי את החשבון ל-500.',
    timestamp: '11:23'
  },
  {
    id: 4,
    heading: 'שמירת סיכום פגישה',
    subheading: 'דונה שומרת פרטים מורכבים',
    userMessage: `תזכרי סיכום פגישה

דיברנו על שיתוף פעולה עם חברת פרסום
הם רוצים להתחיל פיילוט של חודש
והתקציב שהציעו הוא 10,000 שקל`,
    donnaResponse: 'שמרתי את סיכום הפגישה.',
    timestamp: '14:00'
  },
  {
    id: 5,
    heading: 'שליפת סיכום פגישה',
    subheading: 'מאוחר יותר — דונה מחזירה בדיוק מה ששמרת',
    userMessage: 'מה היה הסיכום של הפגישה עם חברת הפרסום?',
    donnaResponse: `דיברתם על פיילוט של חודש לשיתוף פעולה,
והתקציב שהוצע היה 10,000 שקל.`,
    timestamp: '16:45'
  },
  {
    id: 6,
    heading: 'שמירת פרטי קשר',
    subheading: 'דונה שומרת טלפון, אימייל והקשר',
    userMessage: `תזכרי את הפרטים של דני כהן

טלפון: 054-7777777
אימייל: dani@email.com
הוא קבלן שיפוצים`,
    donnaResponse: 'שמרתי את פרטי הקשר של דני כהן.',
    timestamp: '09:30'
  },
  {
    id: 7,
    heading: 'שליפת טלפון של contact',
    subheading: 'מאוחר יותר — שאלה בטבעיות',
    userMessage: 'מה הטלפון של דני כהן?',
    donnaResponse: 'הטלפון של דני כהן הוא 054-7777777.',
    timestamp: '12:10'
  }
]
