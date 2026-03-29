// ───────────────────────────────────────────────────────────────
// MODULE: Retrieval Directives
// ───────────────────────────────────────────────────────────────
// PI-A4: Constitutional memory as retrieval directives (the rollout, deferred from the rollout REC-07)
//
// Adds a `retrieval_directive` metadata field to constitutional-tier memories.
// Directives are formatted as explicit instruction prefixes ("Always surface when:",
// "Prioritize when:") so LLMs receive actionable retrieval guidance alongside the
// Memory content.
//
// Design contract:
//   - Pure content transformation only — scoring logic is NOT touched.
//   - extractRetrievalDirective is deterministic and synchronous.
//   - enrichWithRetrievalDirectives is a map over results; it never filters or reorders.

import * as fs from 'fs';
import { ALLOWED_BASE_PATHS } from '../../core/config.js';
import { validateFilePath } from '../utils/path-security.js';

// Feature catalog: Constitutional memory as expert knowledge injection


/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

/**
 * Retrieval directive derived from a constitutional memory.
 *
 * - `surfaceCondition`  — "Always surface when: <condition>" phrase for LLM consumption.
 * - `priorityCondition` — "Prioritize when: <condition>" phrase for LLM consumption.
 * - `rulePattern`       — Extracted imperative rule phrase from content.
 * - `source`            — Origin label (memory title or file path).
 */
export interface RetrievalDirective {
  surfaceCondition: string;
  priorityCondition: string;
  rulePattern: string;
  source: string;
}

/**
 * A constitutional memory result, optionally enriched with a retrieval directive.
 *
 * This mirrors the ConstitutionalMemory shape in hooks/memory-surface.ts but is
 * kept intentionally structural (duck-typed) so the retrieval-directives module
 * has no hard dependency on the surface hook's private types.
 */
export interface ConstitutionalResult {
  id: number;
  specFolder: string;
  filePath: string;
  title: string;
  importanceTier: string;
  /** Optional: populated by enrichWithRetrievalDirectives() */
  retrieval_directive?: string;
}

/* ───────────────────────────────────────────────────────────────
   2. CONSTANTS
──────────────────────────────────────────────────────────────── */

/**
 * Imperative verbs that signal a rule pattern.
 * Order matters: earlier entries are preferred over later ones during extraction.
 */
const IMPERATIVE_KEYWORDS = [
  'must',
  'always',
  'never',
  'should',
  'require',
  'requires',
  'ensure',
  'only',
  'do not',
  'avoid',
] as const;

/**
 * Condition-introducing words that begin the context clause after a rule verb.
 */
const CONDITION_KEYWORDS = ['when', 'if', 'for', 'during', 'before', 'after', 'on'] as const;

/** Maximum characters to scan from the beginning of content for rule extraction. */
const MAX_CONTENT_SCAN_CHARS = 2000;

/** Maximum characters allowed in a directive phrase component. */
const MAX_DIRECTIVE_COMPONENT_CHARS = 120;

/* ───────────────────────────────────────────────────────────────
   3. HELPERS
──────────────────────────────────────────────────────────────── */

/**
 * Normalise whitespace and trim a string.
 * Collapses internal runs of whitespace (including newlines) to a single space.
 */
function normalise(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Truncate text to at most `max` characters, appending "…" if truncated.
 */
function cap(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + '…';
}

/**
 * Extract lines from `content` that begin with or contain a markdown heading
 * or a leading imperative keyword followed by a noun phrase or condition.
 *
 * Returns an array of candidate rule sentences in document order.
 */
function extractCandidateLines(content: string): string[] {
  const scan = content.slice(0, MAX_CONTENT_SCAN_CHARS);
  const lines = scan.split('\n');
  const candidates: string[] = [];

  for (const raw of lines) {
    const line = normalise(raw);
    if (line.length < 8) continue;

    // Strip markdown heading prefixes (# ## ### etc.)
    const stripped = line.replace(/^#+\s*/, '');

    const lower = stripped.toLowerCase();
    const hasImperative = IMPERATIVE_KEYWORDS.some(
      (kw) => lower.startsWith(kw + ' ') || lower.includes(' ' + kw + ' ')
    );

    if (hasImperative) {
      candidates.push(stripped);
    }
  }

  return candidates;
}

/**
 * From a candidate line, extract:
 *   - the imperative verb (ruleVerb)
 *   - the condition clause introduced by a condition keyword (conditionClause)
 *   - the remainder as the rule body (ruleBody)
 */
function parseCandidateLine(line: string): {
  ruleVerb: string;
  ruleBody: string;
  conditionClause: string;
} {
  const lower = line.toLowerCase();

  // Find the earliest imperative keyword present in this line
  let foundVerb = '';
  let verbIndex = -1;
  for (const kw of IMPERATIVE_KEYWORDS) {
    const idx = lower.indexOf(kw);
    if (idx !== -1 && (verbIndex === -1 || idx < verbIndex)) {
      foundVerb = kw;
      verbIndex = idx;
    }
  }

  if (verbIndex === -1) {
    return { ruleVerb: '', ruleBody: line, conditionClause: '' };
  }

  // Everything from verbIndex onward is the rule body
  const ruleBody = normalise(line.slice(verbIndex));

  // Find a condition clause within ruleBody
  const bodyLower = ruleBody.toLowerCase();
  let conditionClause = '';
  for (const ck of CONDITION_KEYWORDS) {
    const ckIdx = bodyLower.indexOf(' ' + ck + ' ');
    if (ckIdx !== -1) {
      // Clause starts after the condition keyword
      const clauseStart = ckIdx + 1 + ck.length + 1;
      conditionClause = normalise(ruleBody.slice(clauseStart));
      break;
    }
  }

  return { ruleVerb: foundVerb, ruleBody, conditionClause };
}

/* ───────────────────────────────────────────────────────────────
   4. CORE EXTRACTION
──────────────────────────────────────────────────────────────── */

/**
 * Extract a retrieval directive from constitutional memory content.
 *
 * Parsing strategy:
 * 1. Scan up to MAX_CONTENT_SCAN_CHARS of content for lines containing
 *    imperative keywords (must, always, never, should, …).
 * 2. For each candidate line, parse out the rule verb and condition clause.
 * 3. Build "Always surface when:" and "Prioritize when:" phrases.
 * 4. If no imperative lines are found, fall back to the title as the directive.
 * 5. Returns null only when both content and title are empty.
 *
 * This function is a pure transformation — no I/O, no side effects.
 *
 * @param content - Full text content of the constitutional memory file.
 * @param title   - Title of the memory (used as fallback source label).
 * @returns RetrievalDirective, or null if no directive can be extracted.
 */
export function extractRetrievalDirective(
  content: string,
  title?: string
): RetrievalDirective | null {
  if (!content && !title) return null;

  const source = title ?? 'constitutional memory';

  // --- Attempt to extract from content ---
  if (content) {
    const candidates = extractCandidateLines(content);

    if (candidates.length > 0) {
      // Use the first candidate as the primary rule
      const primary = candidates[0];
      const { ruleVerb, ruleBody, conditionClause } = parseCandidateLine(primary);

      // Build rule pattern: the canonical imperative clause
      const rulePattern = cap(normalise(ruleBody), MAX_DIRECTIVE_COMPONENT_CHARS);

      // Build surface condition
      let surfaceCondition: string;
      if (conditionClause) {
        surfaceCondition = `Always surface when: ${cap(conditionClause, MAX_DIRECTIVE_COMPONENT_CHARS)}`;
      } else if (ruleVerb) {
        // Use the rule body as the condition hint
        const hint = cap(rulePattern, MAX_DIRECTIVE_COMPONENT_CHARS);
        surfaceCondition = `Always surface when: rule applies — ${hint}`;
      } else {
        surfaceCondition = `Always surface when: ${cap(source, MAX_DIRECTIVE_COMPONENT_CHARS)}`;
      }

      // Build priority condition
      // If multiple candidates exist, the second one often provides additional nuance
      let priorityCondition: string;
      if (candidates.length > 1) {
        const { ruleBody: secondBody, conditionClause: secondClause } = parseCandidateLine(candidates[1]);
        const hint = cap(secondClause || secondBody, MAX_DIRECTIVE_COMPONENT_CHARS);
        priorityCondition = `Prioritize when: ${hint}`;
      } else if (conditionClause) {
        priorityCondition = `Prioritize when: ${cap(conditionClause, MAX_DIRECTIVE_COMPONENT_CHARS)}`;
      } else {
        priorityCondition = `Prioritize when: constitutional rule is active for current task`;
      }

      return {
        surfaceCondition,
        priorityCondition,
        rulePattern,
        source,
      };
    }
  }

  // --- Fallback: use title as directive ---
  if (source) {
    const surfaceCondition = `Always surface when: ${cap(source, MAX_DIRECTIVE_COMPONENT_CHARS)}`;
    const priorityCondition = `Prioritize when: task context aligns with "${cap(source, 80)}"`;
    const rulePattern = cap(source, MAX_DIRECTIVE_COMPONENT_CHARS);

    return {
      surfaceCondition,
      priorityCondition,
      rulePattern,
      source,
    };
  }

  return null;
}

/* ───────────────────────────────────────────────────────────────
   5. FORMATTING
──────────────────────────────────────────────────────────────── */

/**
 * Format a retrieval directive as a single metadata field value string.
 *
 * Output format (pipe-delimited for easy parsing):
 *   "<surfaceCondition> | <priorityCondition>"
 *
 * This compact format is designed for LLM consumption: the two pipe-separated
 * clauses provide both a mandatory-surface signal and a priority-boosting hint
 * in a single field that fits naturally in a metadata envelope.
 *
 * @param directive - The retrieval directive to format.
 * @returns A formatted string suitable for use as the `retrieval_directive` metadata field.
 */
export function formatDirectiveMetadata(directive: RetrievalDirective): string {
  return `${directive.surfaceCondition} | ${directive.priorityCondition}`;
}

/* ───────────────────────────────────────────────────────────────
   6. ENRICHMENT
──────────────────────────────────────────────────────────────── */

/**
 * Enrich an array of constitutional memory results with `retrieval_directive` metadata.
 *
 * For each result:
 * - Reads the memory file content (if filePath is set and readable).
 * - Extracts a retrieval directive from content + title.
 * - Attaches the formatted directive string as `retrieval_directive`.
 *
 * Results that fail content reading receive a title-only directive (never null).
 * Results without a parseable directive are returned unchanged (no `retrieval_directive` field).
 *
 * This function performs NO scoring changes. It is a pure metadata enrichment pass
 * that adds the `retrieval_directive` field to each result object.
 *
 * @param results - Array of constitutional memory results to enrich.
 * @returns New array (shallow copy) with `retrieval_directive` added where extractable.
 */
export function enrichWithRetrievalDirectives(
  results: ConstitutionalResult[]
): ConstitutionalResult[] {
  return results.map((result) => {
    // Attempt to read file content for richer extraction
    let content = '';
    if (result.filePath) {
      try {
        const validatedPath = validateFilePath(result.filePath, ALLOWED_BASE_PATHS);
        if (validatedPath && fs.existsSync(validatedPath)) {
          content = fs.readFileSync(validatedPath, 'utf-8');
        }
      } catch (_error: unknown) {
        // File read failure is non-fatal; fall back to title-only directive
        content = '';
      }
    }

    const directive = extractRetrievalDirective(content, result.title);
    if (!directive) {
      return result;
    }

    return {
      ...result,
      retrieval_directive: formatDirectiveMetadata(directive),
    };
  });
}
