/**
 * Conversation examples for Google Workspace
 * Focus: search, locate files, and answer questions about documents.
 */

export const conversations = [
  {
    id: 1,
    heading: 'חיפוש קובץ ובדיקה בתוכו',
    subheading: 'דונה מחפשת את הקובץ ועונה על השאלה',
    userMessage: 'דונה, תחפשי את קובץ האקסל של הזמנות לחתונה ותבדקי אם עומר מופיע שם',
    donnaResponse: `מצאתי את הקובץ **\"הזמנות חתונה\"** ב-Google Sheets 📊

**עומר מופיע ברשימה** ✅
הוא רשום עם הכתובת והטלפון שסיפקת.

רוצה שאשתף איתך קישור לקובץ או שאחפש מישהו אחר?`,
    timestamp: '11:20'
  },
  {
    id: 2,
    heading: 'איתור מסמך ושליחת קישור',
    subheading: 'דונה מוצאת את המסמך ומחזירה לך לינק',
    userMessage: 'דונה, תמצאי לי את חוזה השיפוץ',
    donnaResponse: `מצאתי את **חוזה השיפוץ** 📄

הנה הקישור:
**drive.google.com/.../חוזה_שיפוץ_2024**

נשמר ב-Google Drive בתיקייה \"מסמכים\". רוצה שאשתף עם מישהו?`,
    timestamp: '15:40'
  },
  {
    id: 3,
    heading: 'שאלה על תוכן במסמך',
    subheading: 'דונה קוראת ומשיבה לפי מה שכתוב',
    userMessage: 'מה התאריך האחרון שמופיע במצגת של הפרויקט?',
    donnaResponse: `בדקתי את **\"מצגת פרויקט Q4\"** 📑

התאריך האחרון שמופיע במצגת: **15 בינואר 2026**.

רוצה שאפתח את הקובץ או שאחפש משהו ספציפי בתוכו?`,
    timestamp: '10:05'
  },
  {
    id: 4,
    heading: 'רשימת קבצים אחרונים',
    subheading: 'דונה מראה מה שינית לאחרונה',
    userMessage: 'אילו מסמכים ערכתי השבוע?',
    donnaResponse: `הנה המסמכים שערכת השבוע:

**Google Docs**
• דוח חודשי — נערך אתמול
• תכנית פרויקט — נערך ב-3 בפברואר

**Google Sheets**
• הזמנות חתונה — נערך היום

רוצה לפתוח אחד מהם?`,
    timestamp: '16:55'
  }
]
