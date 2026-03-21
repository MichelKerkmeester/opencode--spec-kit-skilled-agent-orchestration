// ───────────────────────────────────────────────────────────────
// MODULE: Slug Utils
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// 1. SLUG UTILS
// ───────────────────────────────────────────────────────────────
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

const MIN_CANDIDATE_LENGTH = 8;
const DEFAULT_SLUG_MAX_LENGTH = 50;

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

/**
 * Normalizes a raw memory name candidate by stripping filename artifacts
 * (timestamp prefixes, `.md` extensions) and normalizing formatting.
 *
 * @param raw - The raw candidate string to normalize.
 * @returns The cleaned candidate string, or empty string for non-string input.
 */
export function normalizeMemoryNameCandidate(raw: string): string {
  if (typeof raw !== 'string') {
    return '';
  }

  let normalized = raw
    .replace(/^#+\s*/, '')
    .replace(/^[-*]\s+/, '')
    .replace(/^(feature\s+)?spec(ification)?:\s*/i, '')
    .replace(/\s*\[template:[^\]]*\]\s*$/i, '')
    .replace(/\{\{[^}]+\}\}/g, ' ')
    .replace(/^['"`]+|['"`]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[\s\-:;,]+$/, '');

  // Strip memory filename artifacts: "DD-MM-YY_HH-MM__content.md" → "content"
  normalized = normalized.replace(/^\d{2}-\d{2}-\d{2}_\d{2}-\d{2}__/, '');
  normalized = normalized.replace(/\.md$/i, '');

  return normalized;
}

/**
 * Converts text to a URL-safe, filesystem-safe slug using Unicode normalization.
 *
 * @param text - The input text to slugify (truncated to 200 chars before processing).
 * @returns A lowercase hyphen-separated slug, or empty string for falsy input.
 */
export function slugify(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return toUnicodeSafeSlug(text.slice(0, 200));
}

/**
 * Checks if a memory name candidate contains timestamp or filename artifacts,
 * tool invocation patterns, or other contaminated prompt text.
 *
 * @param candidate - The candidate memory name to check.
 * @returns `true` if the candidate matches any contamination pattern.
 */
export function isContaminatedMemoryName(candidate: string): boolean {
  const normalized = normalizeMemoryNameCandidate(candidate);
  if (normalized.length === 0) {
    return false;
  }

  return CONTAMINATED_NAME_PATTERNS.some((pattern) => pattern.test(normalized));
}

/**
 * Determines if a task description is too generic to derive a meaningful slug
 * (e.g., "session-summary", "implementation").
 *
 * @param task - The task description string to evaluate.
 * @returns `true` if the slugified task matches a known generic label.
 */
export function isGenericContentTask(task: string): boolean {
  const taskSlug = slugify(normalizeMemoryNameCandidate(task));
  if (taskSlug.length === 0) {
    return true;
  }
  return GENERIC_TASK_SLUGS.has(taskSlug);
}

/**
 * Selects the best content name from a list of candidates based on length
 * and quality heuristics, skipping generic or contaminated entries.
 *
 * @param candidates - Ordered list of candidate names (first valid wins).
 * @returns The best normalized candidate, or empty string if none qualify.
 */
export function pickBestContentName(candidates: readonly string[]): string {
  const seen = new Set<string>();

  for (const candidate of candidates) {
    const normalized = normalizeMemoryNameCandidate(candidate);
    if (normalized.length < MIN_CANDIDATE_LENGTH) {
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

/**
 * Truncates a slug at a word boundary (hyphen) to fit within max length,
 * avoiding mid-word cuts when possible.
 *
 * @param slug - The slug string to truncate.
 * @param max - Maximum allowed length (defaults to DEFAULT_SLUG_MAX_LENGTH).
 * @returns The truncated slug, or the original if already within bounds.
 */
function truncateSlugAtWordBoundary(slug: string, max: number = DEFAULT_SLUG_MAX_LENGTH): string {
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

/**
 * Generates a content-appropriate slug from a task description, with fallback
 * and alternative candidates. Uses hash-based fallback when no candidate qualifies.
 *
 * @param task - Primary task description to derive the slug from.
 * @param fallback - Fallback text used when task and alternatives are insufficient.
 * @param alternatives - Optional additional candidate strings to consider.
 * @returns A truncated, word-boundary-aware slug for use in memory filenames.
 */
export function generateContentSlug(task: string, fallback: string, alternatives: readonly string[] = []): string {
  const bestCandidate = pickBestContentName([task, ...alternatives]);
  if (bestCandidate.length > 0) {
    return truncateSlugAtWordBoundary(slugify(bestCandidate));
  }

  const fallbackSlug = slugify(fallback);
  if (fallbackSlug.length > 0) {
    if (isGenericContentTask(fallback)) {
      return hashFallbackSlug(`${task}::${fallback}`);
    }
    return truncateSlugAtWordBoundary(fallbackSlug);
  }
  return hashFallbackSlug(`${task}::${fallback}`);
}
