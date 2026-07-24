// src/utils/helpers.js

/**
 * Returns person's avatarUrl, or generates a DiceBear SVG fallback if missing.
 */
export const getAvatarUrl = (person) => {
  if (!person) return '';
  if (person.avatarUrl && person.avatarUrl.trim() !== '') {
    return person.avatarUrl;
  }

  const genderPrefix = person.gender === 'male' ? 'man' : 'woman';
  return `https://api.dicebear.com/7.x/notionists/svg?seed=${genderPrefix}-p${person.id}`;
};

/**
 * Calculates age based on a start date and an optional end date.
 * If end date is omitted, calculates age as of today.
 */
export const calculateAge = (birthDate, endDate = null) => {
  if (!birthDate) return null;

  const start = new Date(birthDate);
  if (isNaN(start.getTime())) return null;

  const end = endDate ? new Date(endDate) : new Date();
  if (isNaN(end.getTime())) return null;

  let age = end.getFullYear() - start.getFullYear();
  const monthDiff = end.getMonth() - start.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < start.getDate())) {
    age--;
  }

  return age < 0 ? 0 : age;
};