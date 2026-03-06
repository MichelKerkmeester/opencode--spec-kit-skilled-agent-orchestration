// ---------------------------------------------------------------
// MODULE: Slug Utils
// Content-aware slug generation for memory filenames
// ---------------------------------------------------------------

import { createHash } from 'node:crypto';

const GENERIC_TASK_SLUGS = new Set([
  'development-session',
  'session-summary',
  'session-context',
  'session',
  'context',
  'implementation',
  'work-session',
  'implementation-and-updates',
]);

const CONTAMINATED_NAME_PATTERNS = [
  /^to promote a memory\b/i,
  /^epistemic state captured at session start\b/i,
  /^machine-readable section\b/i,
  /^table of contents\b/i,
  /^no conversation messages were captured\b/i,
  /^no specific implementations recorded\b/i,
  /^decision_count:\s*0\b/i,
  /template configuration comments/i,
  /session context documentation/i,
  /always surfaced/i,
];

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

export function normalizeMemoryNameCandidate(raw: string): string {
  if (typeof raw !== 'string') {
    return '';
  }

  return raw
    .replace(/^#+\s*/, '')
    .replace(/^[-*]\s+/, '')
    .replace(/^(feature\s+)?spec(ification)?:\s*/i, '')
    .replace(/\s*\[template:[^\]]*\]\s*$/i, '')
    .replace(/^['"`]+|['"`]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[\s\-:;,]+$/, '');
}

export function slugify(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return toUnicodeSafeSlug(text);
}

export function isContaminatedMemoryName(candidate: string): boolean {
  const normalized = normalizeMemoryNameCandidate(candidate);
  if (normalized.length === 0) {
    return false;
  }

  return CONTAMINATED_NAME_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function isGenericContentTask(task: string): boolean {
  const taskSlug = slugify(normalizeMemoryNameCandidate(task));
  if (taskSlug.length === 0) {
    return true;
  }
  return GENERIC_TASK_SLUGS.has(taskSlug);
}

export function pickBestContentName(candidates: readonly string[]): string {
  const seen = new Set<string>();

  for (const candidate of candidates) {
    const normalized = normalizeMemoryNameCandidate(candidate);
    if (normalized.length < 8) {
      continue;
    }

    const dedupeKey = normalized.toLowerCase();
    if (seen.has(dedupeKey)) {
      continue;
    }
    seen.add(dedupeKey);

    if (isGenericContentTask(normalized) || isContaminatedMemoryName(normalized)) {
      continue;
    }

    return normalized;
  }

  return '';
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

export function generateContentSlug(task: string, fallback: string, alternatives: readonly string[] = []): string {
  const bestCandidate = pickBestContentName([task, ...alternatives]);
  if (bestCandidate.length > 0) {
    return truncateSlugAtWordBoundary(slugify(bestCandidate));
  }

  const fallbackSlug = slugify(fallback);
  if (fallbackSlug.length > 0) {
    return truncateSlugAtWordBoundary(fallbackSlug);
  }
  return hashFallbackSlug(`${task}::${fallback}`);
}
