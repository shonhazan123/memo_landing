/**
 * Abilities Configuration
 * Central configuration for all superpowers/abilities
 */

export const abilities = [
  {
    id: 1,
    slug: 'calendar-management',
    title: 'ניהול יומן',
    description: 'דונה מנהל את היומן שלך בצורה חכמה. תזמון פגישות, ביטול, שינוי - הכל בשיחה טבעית.',
    image: '/photos/Calendar.png',
    conversationsFile: 'calendar-management'
  },
  {
    id: 2,
    slug: 'tasks-reminders',
    title: 'משימות ותזכורות',
    description: 'תזכורות חכמות שמגיעות בדיוק בזמן הנכון. תזכורות מבוססות זמן, מיקום, והקשר.',
    image: '/photos/Reminders.png',
    conversationsFile: 'tasks-reminders'
  },
  {
    id: 3,
    slug: 'emails',
    title: 'אימיילים',
    description: 'ניהול אימיילים בצורה חכמה. דונה עוזר לך לנהל, לסנן, ולענות על אימיילים חשובים.',
    image: '/photos/Gmail.png',
    conversationsFile: 'emails'
  },
  {
    id: 4,
    slug: 'google-workspace',
    title: 'Google Work Space',
    description: 'אינטגרציה מלאה עם Google Workspace. ניהול מסמכים, קבצים, וכל הכלים של Google במקום אחד.',
    image: '/photos/Google_Workspace.png',
    conversationsFile: 'google-workspace'
  }
]

/**
 * Get ability by slug
 * @param {string} slug - The ability slug
 * @returns {Object|null} The ability object or null if not found
 */
export const getAbilityBySlug = (slug) => {
  return abilities.find(ability => ability.slug === slug) || null
}

/**
 * Get all abilities
 * @returns {Array} Array of all abilities
 */
export const getAllAbilities = () => {
  return abilities
}

