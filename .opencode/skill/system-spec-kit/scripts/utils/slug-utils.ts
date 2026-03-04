// ---------------------------------------------------------------
// MODULE: Slug Utils
// Content-aware slug generation for memory filenames
// ---------------------------------------------------------------

const GENERIC_SLUGS = new Set([
  'development-session',
  'session-summary',
  'session-context',
  'session',
  'context',
  'implementation',
  'work-session',
]);

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function truncateSlugAtWordBoundary(slug: string, max: number = 50): string {
  if (slug.length <= max) return slug;
  const truncated = slug.slice(0, max);
  const lastHyphen = truncated.lastIndexOf('-');
  if (lastHyphen >= Math.floor(max * 0.6)) {
    return truncated.slice(0, lastHyphen);
  }
  return truncated;
}

export function generateContentSlug(task: string, fallback: string): string {
  const taskSlug = slugify(task);
  if (taskSlug.length >= 8 && !GENERIC_SLUGS.has(taskSlug)) {
    return truncateSlugAtWordBoundary(taskSlug);
  }
  const fallbackSlug = slugify(fallback);
  return fallbackSlug.length > 0 ? truncateSlugAtWordBoundary(fallbackSlug) : 'session';
}
