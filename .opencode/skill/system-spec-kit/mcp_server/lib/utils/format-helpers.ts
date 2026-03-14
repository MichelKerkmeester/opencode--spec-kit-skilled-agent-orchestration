// ───────────────────────────────────────────────────────────────
// MODULE: Format Helpers
// ───────────────────────────────────────────────────────────────
// ───────────────────────────────────────────────────────────────
// 1. FORMATTING UTILITIES

// ───────────────────────────────────────────────────────────────
/**
 * Format a date string as a human-readable age string
 * @param dateString - ISO date string or null
 * @returns Formatted age string (e.g., "2 days ago", "yesterday")
 */
export function formatAgeString(dateString: string | null): string {
  if (!dateString) return 'never';

  const date = new Date(dateString);
  const now = Date.now();
  const ageMs = now - date.getTime();
  const ageDays = Math.floor(ageMs / (24 * 60 * 60 * 1000));

  if (ageDays < 1) {
    return 'today';
  } else if (ageDays === 1) {
    return 'yesterday';
  } else if (ageDays < 7) {
    return `${ageDays} days ago`;
  } else if (ageDays < 30) {
    const weeks = Math.floor(ageDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else {
    const months = Math.floor(ageDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
}
