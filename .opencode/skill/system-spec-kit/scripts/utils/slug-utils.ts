// ---------------------------------------------------------------
// MODULE: Slug Utils
// Content-aware slug generation for memory filenames
// ---------------------------------------------------------------

import { createHash } from 'node:crypto';

const GENERIC_SLUGS = new Set([
  'development-session',
  'session-summary',
  'session-context',
  'session',
  'context',
  'implementation',
  'work-session',
]);

const GENERIC_TASK_SLUGS = new Set([
  ...GENERIC_SLUGS,
  'implementation-and-updates',
]);

function toUnicodeSafeSlug(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function hashFallbackSlug(seed: string): string {
  const digest = createHash('sha1').update(seed).digest('hex').slice(0, 8);
  return `session-${digest}`;
}

export function slugify(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return toUnicodeSafeSlug(text);
}

export function isGenericContentTask(task: string): boolean {
  const taskSlug = slugify(task);
  if (taskSlug.length === 0) {
    return true;
  }
  return GENERIC_TASK_SLUGS.has(taskSlug);
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
  if (fallbackSlug.length > 0) {
    return truncateSlugAtWordBoundary(fallbackSlug);
  }
  return hashFallbackSlug(`${task}::${fallback}`);
}
