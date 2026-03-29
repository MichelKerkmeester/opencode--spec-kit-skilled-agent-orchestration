// ───────────────────────────────────────────────────────────────
// MODULE: Query Surrogates
// ───────────────────────────────────────────────────────────────
// Feature catalog: D2 REQ-D2-005 — Index-Time Surrogates
//
// Gate: SPECKIT_QUERY_SURROGATES — default: ON (graduated).
//
// Generates surrogate metadata at index time to improve recall without
// runtime LLM calls.  Surrogates include aliases (abbreviations, synonyms),
// structural headings, extractive summaries, and heuristic questions that
// the document is likely to answer.
//
// At query time, stored surrogates are matched against the incoming query
// to produce a lightweight boost score — no LLM calls on the default path.
//
// Feature flags:
//   SPECKIT_QUERY_SURROGATES — enable surrogate generation + matching (default: ON (graduated))

/* ───────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

import type Database from 'better-sqlite3';
import { storeSurrogates as _storeSurrogatesRaw } from './surrogate-storage.js';
import type { StorableSurrogateMetadata } from './surrogate-storage.js';

// Re-export surrogate-storage for backward compatibility
export { initSurrogateTable, loadSurrogates, loadSurrogatesBatch } from './surrogate-storage.js';
export type { SurrogateRow, StorableSurrogateMetadata } from './surrogate-storage.js';

/** Backward-compatible wrapper preserving the original feature flag guard. */
export function storeSurrogates(db: Database.Database, memoryId: number, surrogates: StorableSurrogateMetadata): void {
  if (!isQuerySurrogatesEnabled()) return;
  _storeSurrogatesRaw(db, memoryId, surrogates);
}

/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

/**
 * Surrogate metadata generated at index time for a single document.
 */
export interface SurrogateMetadata {
  /** Abbreviations and synonyms extracted from content. */
  aliases: string[];
  /** Structural headings as retrieval surrogates. */
  headings: string[];
  /** Concise summary (extracted, not LLM-generated). */
  summary: string;
  /** 2-5 likely user questions this memory answers. */
  surrogateQuestions: string[];
  /** Timestamp of generation (Date.now()). */
  generatedAt: number;
}

/* ───────────────────────────────────────────────────────────────
   3. CONSTANTS
──────────────────────────────────────────────────────────────── */

/** Maximum number of surrogate questions to generate per document. */
const MAX_SURROGATE_QUESTIONS = 5;

/** Minimum number of surrogate questions to aim for. */
const MIN_SURROGATE_QUESTIONS = 2;

/** Maximum summary length (characters) for the extractive summary. */
const MAX_SUMMARY_LENGTH = 200;

/** Minimum token overlap ratio to consider a surrogate matched. */
const MIN_MATCH_THRESHOLD = 0.15;

/* ───────────────────────────────────────────────────────────────
   4. FEATURE FLAG
──────────────────────────────────────────────────────────────── */

// D2 REQ-D2-005: Query surrogates gate — canonical implementation in search-flags.ts.
// Default: TRUE (graduated). Set SPECKIT_QUERY_SURROGATES=false to disable.
import { isQuerySurrogatesEnabled } from './search-flags.js';
export { isQuerySurrogatesEnabled };

/* ───────────────────────────────────────────────────────────────
   5. ALIAS EXTRACTION
──────────────────────────────────────────────────────────────── */

/**
 * Extract abbreviations and synonyms from content using heuristics.
 *
 * Patterns detected:
 *   - Parenthetical abbreviations: "Reciprocal Rank Fusion (RRF)" → "RRF"
 *   - Parenthetical definitions: "RRF (Reciprocal Rank Fusion)" → "Reciprocal Rank Fusion"
 *   - Slash-separated synonyms: "recall/precision" → ["recall", "precision"]
 *
 * @param content - Document content to extract aliases from.
 * @returns Deduplicated array of extracted aliases.
 */
export function extractAliases(content: string): string[] {
  if (!content || content.trim().length === 0) return [];

  const aliases = new Set<string>();

  // Pattern 1: "Full Name (ABBREV)" — abbreviation in parentheses
  // Matches 2-10 uppercase letters/digits, optionally with hyphens
  const abbrevPattern = /\b[\w\s-]+\(([A-Z][A-Z0-9-]{1,9})\)/g;
  let match: RegExpExecArray | null;

  match = abbrevPattern.exec(content);
  while (match !== null) {
    const abbrev = match[1].trim();
    if (abbrev.length >= 2) {
      aliases.add(abbrev);
    }
    match = abbrevPattern.exec(content);
  }

  // Pattern 2: "ABBREV (Full Definition)" — definition in parentheses after short term
  const defPattern = /\b([A-Z][A-Z0-9-]{1,9})\s+\(([^)]{5,80})\)/g;
  match = defPattern.exec(content);
  while (match !== null) {
    const definition = match[2].trim();
    // Only add if the definition looks like a name (starts with capital or is multi-word)
    if (/^[A-Z]/.test(definition) || definition.includes(' ')) {
      aliases.add(definition);
    }
    match = defPattern.exec(content);
  }

  // Pattern 3: "aka" or "also known as" patterns
  const akaPattern = /(?:aka|also known as|a\.k\.a\.)\s+["']?([^"'\n,]{2,60})["']?/gi;
  match = akaPattern.exec(content);
  while (match !== null) {
    const alias = match[1].trim();
    if (alias.length >= 2) {
      aliases.add(alias);
    }
    match = akaPattern.exec(content);
  }

  return Array.from(aliases);
}

/* ───────────────────────────────────────────────────────────────
   6. HEADING EXTRACTION
──────────────────────────────────────────────────────────────── */

/**
 * Extract markdown headings (## and ###) as structural surrogates.
 *
 * Strips markdown formatting (leading #, bold, italic, code spans).
 * Returns a flat string array of heading text.
 *
 * @param content - Markdown document content.
 * @returns Array of heading strings.
 */
export function extractHeadings(content: string): string[] {
  if (!content || content.trim().length === 0) return [];

  const headings: string[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    // Match ## and ### headings (not # which is the document title)
    const headingMatch = trimmed.match(/^#{1,3}\s+(.+)$/);
    if (headingMatch) {
      let heading = headingMatch[1];
      // Strip markdown formatting
      heading = heading
        .replace(/\*\*(.+?)\*\*/g, '$1')   // bold
        .replace(/\*(.+?)\*/g, '$1')        // italic
        .replace(/__(.+?)__/g, '$1')         // bold (underscores)
        .replace(/_(.+?)_/g, '$1')           // italic (underscores)
        .replace(/`(.+?)`/g, '$1')           // code spans
        .replace(/\[(.+?)\]\(.+?\)/g, '$1')  // links
        .trim();

      if (heading.length > 0) {
        headings.push(heading);
      }
    }
  }

  return headings;
}

/* ───────────────────────────────────────────────────────────────
   7. SUMMARY GENERATION
──────────────────────────────────────────────────────────────── */

/**
 * Generate an extractive summary from document content.
 *
 * Strategy:
 *   1. Try to extract the first paragraph (non-heading, non-empty lines).
 *   2. If the first paragraph is too short, extend to the next paragraph.
 *   3. Fallback: first MAX_SUMMARY_LENGTH characters of content.
 *
 * No LLM calls — purely heuristic extraction.
 *
 * @param content - Document content.
 * @returns Extracted summary string (max MAX_SUMMARY_LENGTH chars).
 */
export function generateSummary(content: string): string {
  if (!content || content.trim().length === 0) return '';

  const lines = content.split('\n');
  const paragraphLines: string[] = [];
  let foundParagraph = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip headings, empty lines at the start, and YAML front-matter
    if (trimmed.startsWith('#') || trimmed.startsWith('---')) continue;
    if (trimmed.length === 0) {
      if (foundParagraph && paragraphLines.length > 0) {
        // End of first paragraph — check if we have enough
        const text = paragraphLines.join(' ').trim();
        if (text.length >= 40) break;
        // Too short, continue to next paragraph
      }
      continue;
    }

    // Skip list markers at the very beginning
    if (!foundParagraph && /^[-*+]\s/.test(trimmed)) continue;

    foundParagraph = true;
    paragraphLines.push(trimmed);

    // Stop collecting if we have enough text
    const currentText = paragraphLines.join(' ');
    if (currentText.length >= MAX_SUMMARY_LENGTH) break;
  }

  if (paragraphLines.length > 0) {
    const text = paragraphLines.join(' ').trim();
    if (text.length > MAX_SUMMARY_LENGTH) {
      // Truncate at word boundary
      const truncated = text.slice(0, MAX_SUMMARY_LENGTH);
      const lastSpace = truncated.lastIndexOf(' ');
      return lastSpace > MAX_SUMMARY_LENGTH * 0.6
        ? truncated.slice(0, lastSpace).trim()
        : truncated.trim();
    }
    return text;
  }

  // Fallback: first MAX_SUMMARY_LENGTH characters of raw content
  const rawText = content.replace(/\s+/g, ' ').trim();
  if (rawText.length <= MAX_SUMMARY_LENGTH) return rawText;

  const truncated = rawText.slice(0, MAX_SUMMARY_LENGTH);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > MAX_SUMMARY_LENGTH * 0.6
    ? truncated.slice(0, lastSpace).trim()
    : truncated.trim();
}

/* ───────────────────────────────────────────────────────────────
   8. SURROGATE QUESTION GENERATION
──────────────────────────────────────────────────────────────── */

/**
 * Generate surrogate questions that the document likely answers.
 *
 * Heuristic approach (no LLM):
 *   - Convert headings to questions ("How to X" → "How do I X?")
 *   - Generate "What is [title]?" from document title
 *   - Generate "When should I use [concept]?" for how-to content
 *
 * @param title - Document title.
 * @param headings - Extracted headings from the document.
 * @param content - Document content (used for additional heuristics).
 * @returns Array of 2-5 deduplicated surrogate questions.
 */
export function generateSurrogateQuestions(
  title: string,
  headings: string[],
  content: string,
): string[] {
  const questions = new Set<string>();

  // From title: "What is [title]?"
  const cleanTitle = title.replace(/^#+\s*/, '').trim();
  if (cleanTitle.length > 0) {
    questions.add(`What is ${cleanTitle}?`);
  }

  // From headings: convert to questions
  for (const heading of headings) {
    const lower = heading.toLowerCase();

    // "How to X" → "How do I X?"
    const howToMatch = lower.match(/^how\s+to\s+(.+)/);
    if (howToMatch) {
      questions.add(`How do I ${howToMatch[1]}?`);
      continue;
    }

    // "Why X" → "Why does X?"
    const whyMatch = lower.match(/^why\s+(.+)/);
    if (whyMatch) {
      questions.add(`Why ${whyMatch[1]}?`);
      continue;
    }

    // "When X" → "When should I X?"
    const whenMatch = lower.match(/^when\s+(.+)/);
    if (whenMatch) {
      questions.add(`When should I ${whenMatch[1]}?`);
      continue;
    }

    // "Configuration" / "Setup" / "Installation" patterns
    if (/\b(config|setup|install|deploy|migrat)/i.test(heading)) {
      questions.add(`How do I ${heading.toLowerCase()}?`);
      continue;
    }

    // Generic heading → "What about [heading]?"
    if (heading.length > 3 && heading.length < 80) {
      questions.add(`What about ${heading.toLowerCase()}?`);
    }

    if (questions.size >= MAX_SURROGATE_QUESTIONS) break;
  }

  // From content: detect if it is a how-to/guide and add usage question
  if (cleanTitle.length > 0 && questions.size < MAX_SURROGATE_QUESTIONS) {
    const lowerContent = content.toLowerCase();
    if (
      lowerContent.includes('step') ||
      lowerContent.includes('guide') ||
      lowerContent.includes('tutorial') ||
      lowerContent.includes('instructions')
    ) {
      questions.add(`When should I use ${cleanTitle.toLowerCase()}?`);
    }
  }

  // Ensure minimum question count
  if (questions.size < MIN_SURROGATE_QUESTIONS && cleanTitle.length > 0) {
    questions.add(`How does ${cleanTitle.toLowerCase()} work?`);
  }

  // Cap at MAX and convert to array
  return Array.from(questions).slice(0, MAX_SURROGATE_QUESTIONS);
}

/* ───────────────────────────────────────────────────────────────
   9. INDEX-TIME PIPELINE
──────────────────────────────────────────────────────────────── */

/**
 * Generate complete surrogate metadata for a document.
 *
 * Called at index time (save pipeline). Returns null when the
 * feature flag is disabled.
 *
 * @param content - Document content.
 * @param title   - Document title.
 * @returns SurrogateMetadata or null if feature is disabled.
 */
export function generateSurrogates(
  content: string,
  title: string,
): SurrogateMetadata | null {
  if (!isQuerySurrogatesEnabled()) return null;

  const aliases = extractAliases(content);
  const headings = extractHeadings(content);
  const summary = generateSummary(content);
  const surrogateQuestions = generateSurrogateQuestions(title, headings, content);

  return {
    aliases,
    headings,
    summary,
    surrogateQuestions,
    generatedAt: Date.now(),
  };
}

/* ───────────────────────────────────────────────────────────────
   10. QUERY-TIME MATCHING
──────────────────────────────────────────────────────────────── */

// Query-time surrogate matching is wired into stage1-candidate-gen.ts as a post-candidate
// boost. When SPECKIT_QUERY_SURROGATES is enabled, loadSurrogatesBatch() fetches surrogates
// for all candidate IDs and matchSurrogates() produces a score boost (capped at 0.15).

/**
 * Tokenize a string into lowercase words for matching.
 * Strips punctuation and filters tokens shorter than 2 characters.
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 2);
}

/**
 * Compute keyword overlap score between a query and a target string.
 *
 * Score = |intersection(queryTokens, targetTokens)| / |queryTokens|
 *
 * @param queryTokens - Tokenized query.
 * @param target      - Target string to match against.
 * @returns Overlap score in [0, 1].
 */
function keywordOverlap(queryTokens: string[], target: string): number {
  if (queryTokens.length === 0) return 0;

  const targetTokens = new Set(tokenize(target));
  if (targetTokens.size === 0) return 0;

  let hits = 0;
  for (const qt of queryTokens) {
    if (targetTokens.has(qt)) {
      hits += 1;
    }
  }

  return hits / queryTokens.length;
}

/**
 * Match a query against stored surrogate metadata for a single document.
 *
 * Matching channels (weighted):
 *   - Alias match (exact token overlap): weight 0.3
 *   - Question match (best keyword overlap across surrogateQuestions): weight 0.4
 *   - Summary match (keyword overlap): weight 0.2
 *   - Heading match (best keyword overlap across headings): weight 0.1
 *
 * @param query      - The search query.
 * @param surrogates - Stored surrogate metadata for one document.
 * @returns Combined match score in [0, 1] and list of matched surrogate strings.
 */
export function matchSurrogates(
  query: string,
  surrogates: SurrogateMetadata,
): { score: number; matchedSurrogates: string[] } {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return { score: 0, matchedSurrogates: [] };
  }

  const matched: string[] = [];
  const queryLower = query.toLowerCase();

  // Channel 1: Alias match — check if any alias appears in the query
  let aliasScore = 0;
  for (const alias of surrogates.aliases) {
    if (queryLower.includes(alias.toLowerCase())) {
      aliasScore = 1.0;
      matched.push(`alias:${alias}`);
      break;
    }
    const overlap = keywordOverlap(queryTokens, alias);
    if (overlap > aliasScore) {
      aliasScore = overlap;
      if (overlap >= MIN_MATCH_THRESHOLD) {
        matched.push(`alias:${alias}`);
      }
    }
  }

  // Channel 2: Surrogate question match — best overlap across all questions
  let questionScore = 0;
  for (const question of surrogates.surrogateQuestions) {
    const overlap = keywordOverlap(queryTokens, question);
    if (overlap > questionScore) {
      questionScore = overlap;
      if (overlap >= MIN_MATCH_THRESHOLD) {
        // Replace previous question match
        const idx = matched.findIndex((m) => m.startsWith('question:'));
        if (idx >= 0) matched.splice(idx, 1);
        matched.push(`question:${question}`);
      }
    }
  }

  // Channel 3: Summary match
  let summaryScore = 0;
  if (surrogates.summary.length > 0) {
    summaryScore = keywordOverlap(queryTokens, surrogates.summary);
    if (summaryScore >= MIN_MATCH_THRESHOLD) {
      matched.push('summary');
    }
  }

  // Channel 4: Heading match — best overlap across all headings
  let headingScore = 0;
  for (const heading of surrogates.headings) {
    const overlap = keywordOverlap(queryTokens, heading);
    if (overlap > headingScore) {
      headingScore = overlap;
      if (overlap >= MIN_MATCH_THRESHOLD) {
        const idx = matched.findIndex((m) => m.startsWith('heading:'));
        if (idx >= 0) matched.splice(idx, 1);
        matched.push(`heading:${heading}`);
      }
    }
  }

  // Weighted combination
  const score = Math.min(
    1.0,
    aliasScore * 0.3 +
    questionScore * 0.4 +
    summaryScore * 0.2 +
    headingScore * 0.1,
  );

  return {
    score: Math.round(score * 1000) / 1000,
    matchedSurrogates: matched,
  };
}

/* ───────────────────────────────────────────────────────────────
   11. TEST EXPORTS
──────────────────────────────────────────────────────────────── */

/**
 * Internal functions and constants exposed for unit testing.
 * Do NOT use in production code paths.
 *
 * @internal
 */
export const __testables = {
  tokenize,
  keywordOverlap,
  MAX_SURROGATE_QUESTIONS,
  MIN_SURROGATE_QUESTIONS,
  MAX_SUMMARY_LENGTH,
  MIN_MATCH_THRESHOLD,
};
