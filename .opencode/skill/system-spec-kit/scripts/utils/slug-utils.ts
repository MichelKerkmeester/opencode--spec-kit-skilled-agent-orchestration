// --- 1. SLUG UTILS ---
// Content-aware slug generation for memory filenames

import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';

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
  /^Tool:\s+\w+$/i,
  /^Executed\s+\w+$/i,
  /^User initiated conversation$/i,
  /^Read\s+(?:file\b|[\/.])/i,
  /^Edit\s+(?:file\b|[\/.])/i,
  /^Write\s+(?:file\b|[\/.])/i,
  /^Grep\s*(?:search|:)/i,
  /^Glob\s*(?:search|:)/i,
  /^Bash\s+command/i,
  /^[\/\.][^\s]+$/,
  // F-37: Read/Edit/Write with short path format (e.g., "Read src/foo.ts")
  /^(?:Read|Edit|Write)\s+[^\s]+\/[^\s]+$/i,
];

function toUnicodeSafeSlug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function hashFallbackSlug(seed: string): string {
  const digest = crypto.createHash('sha1').update(seed).digest('hex').slice(0, 8);
  return `session-${digest}`;
}

/** Normalizes a candidate memory name before slug generation. */
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

/** Converts arbitrary text into a filesystem-safe slug. */
export function slugify(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return toUnicodeSafeSlug(text.slice(0, 200));
}

/** Returns whether a candidate memory name contains contaminated prompt text. */
export function isContaminatedMemoryName(candidate: string): boolean {
  const normalized = normalizeMemoryNameCandidate(candidate);
  if (normalized.length === 0) {
    return false;
  }

  return CONTAMINATED_NAME_PATTERNS.some((pattern) => pattern.test(normalized));
}

/** Returns whether a task label is too generic for memory naming. */
export function isGenericContentTask(task: string): boolean {
  const taskSlug = slugify(normalizeMemoryNameCandidate(task));
  if (taskSlug.length === 0) {
    return true;
  }
  return GENERIC_TASK_SLUGS.has(taskSlug);
}

/** Picks the strongest content-derived name from available candidates. */
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

/** Truncates a slug without cutting through the middle of a word when possible. */
export function truncateSlugAtWordBoundary(slug: string, max: number = 50): string {
  if (slug.length <= max) return slug;
  const truncated = slug.slice(0, max);
  const lastHyphen = truncated.lastIndexOf('-');
  if (lastHyphen >= Math.floor(max * 0.6)) {
    return truncated.slice(0, lastHyphen);
  }
  return truncated;
}

/**
 * Ensure a memory filename is unique within a context directory.
 * Appends `-1`, `-2`, etc. on collision. Falls back to random hex suffixes.
 *
 * @param contextDir - Absolute path to the memory directory.
 * @param filename   - Proposed filename (e.g. "08-03-26_10-24__my-slug.md").
 * @returns The original filename if unique, or a collision-free variant.
 */
export function ensureUniqueMemoryFilename(contextDir: string, filename: string): string {
  // F-07: Use atomic O_CREAT|O_EXCL instead of readdirSync + set check
  const filePath = path.join(contextDir, filename);
  try {
    const fd = fs.openSync(filePath, fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_WRONLY, 0o600);
    fs.closeSync(fd);
    // Created successfully — filename is unique. Remove placeholder (caller will write real content).
    fs.unlinkSync(filePath);
    return filename;
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException).code;
    // F-29: Only retry on EEXIST; ENOENT (dir missing) means no collision
    if (code === 'ENOENT') return filename;
    if (code !== 'EEXIST') throw err;
  }

  // Collision detected — try suffixed variants with atomic check
  const ext = path.extname(filename);
  const base = filename.slice(0, -ext.length);

  for (let i = 1; i <= 100; i++) {
    const candidate = `${base}-${i}${ext}`;
    const candidatePath = path.join(contextDir, candidate);
    try {
      const fd = fs.openSync(candidatePath, fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_WRONLY, 0o600);
      fs.closeSync(fd);
      fs.unlinkSync(candidatePath);
      return candidate;
    } catch (retryErr: unknown) {
      const retryCode = (retryErr as NodeJS.ErrnoException).code;
      if (retryCode !== 'EEXIST') throw retryErr;
    }
  }

  // After 100 sequential collisions, reserve a random fallback candidate with the same
  // Atomic O_CREAT|O_EXCL path so repeated calls in the same millisecond cannot return
  // The same filename without first proving it is writable in this directory.
  for (let attempt = 0; attempt < 100; attempt++) {
    const randomSuffix = crypto.randomBytes(6).toString('hex');
    const candidate = `${base}-${randomSuffix}${ext}`;
    const candidatePath = path.join(contextDir, candidate);
    try {
      const fd = fs.openSync(candidatePath, fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_WRONLY, 0o600);
      fs.closeSync(fd);
      fs.unlinkSync(candidatePath);
      return candidate;
    } catch (randomErr: unknown) {
      const randomCode = (randomErr as NodeJS.ErrnoException).code;
      if (randomCode !== 'EEXIST') throw randomErr;
    }
  }

  throw new Error(`Failed to reserve unique filename for "${filename}" after random fallback attempts`);
}

/** Generates the final content slug used for memory filenames. */
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
