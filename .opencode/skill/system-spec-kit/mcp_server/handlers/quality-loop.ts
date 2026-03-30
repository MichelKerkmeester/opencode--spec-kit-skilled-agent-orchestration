// ───────────────────────────────────────────────────────────────
// MODULE: Quality Loop (T008)
// ───────────────────────────────────────────────────────────────
import { initEvalDb } from '../lib/eval/eval-db.js';
import { isQualityLoopEnabled } from '../lib/search/search-flags.js';

// Feature catalog: Verify-fix-verify memory quality loop
// Feature catalog: Pre-storage quality gate


const HEADING_PATTERN = /^#{1,3}\s+.+/m;
const ISO_DATE_PATTERN = /\b(\d{4}-\d{2}-\d{2})\b/g;
const COMPLETION_CLAIM_PATTERN = /\b(completed|resolved|fixed|finished|shipped|released|deployed|implemented|occurred|happened)\b/i;

type CoherenceResolver = (reference: string) => boolean;

interface CoherenceMetadata extends Record<string, unknown> {
  title?: string;
  filePath?: string;
  lastModified?: string;
  causalLinks?: Record<string, unknown>;
  resolveReference?: CoherenceResolver;
}

interface QualityScoreBreakdown {
  triggers: number;
  anchors: number;
  budget: number;
  coherence: number;
}

interface QualityScore {
  total: number;
  breakdown: QualityScoreBreakdown;
  issues: string[];
}

interface QualityLoopResult {
  passed: boolean;
  score: QualityScore;
  attempts: number;
  fixes: string[];
  rejected: boolean;
  rejectionReason?: string;
  /** Content after auto-fix mutations (present only when fixes were applied) */
  fixedContent?: string;
  /** Trigger phrases after auto-fix metadata mutations */
  fixedTriggerPhrases?: string[];
}

interface QualityLoopOptions {
  maxRetries?: number;
  threshold?: number;
  emitEvalMetrics?: boolean;
}

function triggerPhrasesChanged(
  original: unknown,
  updated: unknown,
): updated is string[] {
  if (!Array.isArray(updated)) {
    return false;
  }

  const originalList = Array.isArray(original) ? original : [];
  if (originalList.length !== updated.length) {
    return true;
  }

  return updated.some((phrase, index) => phrase !== originalList[index]);
}

const QUALITY_WEIGHTS = {
  triggers: 0.25,
  anchors: 0.30,
  budget: 0.20,
  coherence: 0.25,
} as const;

/** Rough token-to-char ratio: 1 token ~ 4 chars (env-configurable via MCP_CHARS_PER_TOKEN) */
const DEFAULT_TOKEN_BUDGET = 2000;
const _parsedCPT = parseFloat(process.env.MCP_CHARS_PER_TOKEN || '4');
const CHARS_PER_TOKEN = Number.isFinite(_parsedCPT) ? _parsedCPT : 4;
const DEFAULT_CHAR_BUDGET = DEFAULT_TOKEN_BUDGET * CHARS_PER_TOKEN;

/**
 * Compute trigger phrase quality sub-score.
 *
 * Evaluates whether the memory metadata declares enough trigger phrases for
 * reliable retrieval via the `memory_match_triggers` tool. The scoring
 * thresholds are:
 *   - 0 phrases  → score 0.0  (memory will never surface via trigger matching)
 *   - 1–3 phrases → score 0.5  (below the recommended minimum of four)
 *   - 4+ phrases  → score 1.0  (meets or exceeds the recommended minimum)
 *
 * @param metadata - Raw metadata record extracted from the memory file. Expected
 *   to contain a `triggerPhrases` key whose value is an array of strings.
 * @returns An object with:
 *   - `score`  — Sub-score in the range [0, 1].
 *   - `issues` — Human-readable issue strings when the count is below 4.
 */
function scoreTriggerPhrases(metadata: Record<string, unknown>): { score: number; issues: string[] } {
  const triggers = Array.isArray(metadata.triggerPhrases) ? metadata.triggerPhrases : [];
  const count = triggers.length;
  const issues: string[] = [];

  if (count === 0) {
    issues.push('No trigger phrases found');
    return { score: 0, issues };
  }
  if (count < 4) {
    issues.push(`Only ${count} trigger phrase(s) — 4+ recommended`);
    return { score: 0.5, issues };
  }
  return { score: 1.0, issues };
}

/**
 * Compute anchor format quality sub-score.
 *
 * Scans `content` for HTML comment–style ANCHOR tags in the forms
 * `<!-- ANCHOR: name -->` and `<!-- /ANCHOR: name -->`, then verifies that
 * every opening tag has a matching closing tag and vice-versa.
 *
 * Scoring rules:
 *   - No anchors present at all → score 0.5 (neutral; anchors are optional)
 *   - All anchors properly paired  → score 1.0
 *   - Mismatches present → proportional deduction: `1 - brokenCount / totalUniqueNames`
 *     (minimum 0.0)
 *
 * @param content - Full text content of the memory file to inspect.
 * @returns An object with:
 *   - `score`  — Sub-score in the range [0, 1].
 *   - `issues` — Descriptions of any unclosed or unopened ANCHOR tags found.
 */
function scoreAnchorFormat(content: string): { score: number; issues: string[] } {
  const issues: string[] = [];

  // Match opening anchors: <!-- ANCHOR: name -->
  const openPattern = /<!--\s*ANCHOR:\s*([\w-]+)\s*-->/g;
  // Match closing anchors: <!-- /ANCHOR: name -->
  const closePattern = /<!--\s*\/ANCHOR:\s*([\w-]+)\s*-->/g;

  const openAnchors: string[] = [];
  const closeAnchors: string[] = [];

  let match: RegExpExecArray | null;
  while ((match = openPattern.exec(content)) !== null) {
    openAnchors.push(match[1]);
  }
  while ((match = closePattern.exec(content)) !== null) {
    closeAnchors.push(match[1]);
  }

  // No anchors at all — neutral score
  if (openAnchors.length === 0 && closeAnchors.length === 0) {
    return { score: 0.5, issues: [] };
  }

  const countAnchors = (anchors: string[]): Map<string, number> => {
    const counts = new Map<string, number>();
    for (const name of anchors) {
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return counts;
  };

  const openCounts = countAnchors(openAnchors);
  const closeCounts = countAnchors(closeAnchors);

  const unclosed: string[] = [];
  const unopened: string[] = [];

  for (const [name, openCount] of openCounts.entries()) {
    const closeCount = closeCounts.get(name) ?? 0;
    if (openCount > closeCount) {
      const missing = openCount - closeCount;
      for (let i = 0; i < missing; i++) {
        unclosed.push(name);
      }
    }
  }

  for (const [name, closeCount] of closeCounts.entries()) {
    const openCount = openCounts.get(name) ?? 0;
    if (closeCount > openCount) {
      const extra = closeCount - openCount;
      for (let i = 0; i < extra; i++) {
        unopened.push(name);
      }
    }
  }

  if (unclosed.length > 0) {
    issues.push(`Unclosed ANCHOR tag(s): ${unclosed.join(', ')}`);
  }
  if (unopened.length > 0) {
    issues.push(`Closing ANCHOR without opening: ${unopened.join(', ')}`);
  }

  if (issues.length === 0) {
    return { score: 1.0, issues };
  }

  // Proportional: correct pairs / total unique anchors
  const allNames = new Set([...openAnchors, ...closeAnchors]);
  const brokenCount = unclosed.length + unopened.length;
  const score = Math.max(0, 1 - brokenCount / allNames.size);
  return { score, issues };
}

/**
 * Compute token budget quality sub-score.
 *
 * Approximates token count from character length using the constant ratio
 * `CHARS_PER_TOKEN` (4 chars ≈ 1 token) and compares the result against
 * `charBudget`. Memories that exceed the budget are penalised proportionally
 * so that callers can surface oversized files before indexing.
 *
 * Scoring rules:
 *   - `content.length <= charBudget` → score 1.0 (within budget)
 *   - `content.length > charBudget`  → score `charBudget / content.length`
 *     (always > 0 because `charBudget > 0`)
 *
 * @param content    - Full text content of the memory file.
 * @param charBudget - Maximum allowed character count before penalisation.
 *   Defaults to `DEFAULT_CHAR_BUDGET` (`DEFAULT_TOKEN_BUDGET * CHARS_PER_TOKEN`,
 *   i.e. 2000 tokens × 4 = 8000 characters).
 * @returns An object with:
 *   - `score`  — Sub-score in the range (0, 1].
 *   - `issues` — A single message describing the overage when the budget is
 *     exceeded, including the approximate token count.
 */
function scoreTokenBudget(content: string, charBudget: number = DEFAULT_CHAR_BUDGET): { score: number; issues: string[] } {
  const issues: string[] = [];
  const charCount = content.length;

  if (charCount <= charBudget) {
    return { score: 1.0, issues };
  }

  const ratio = charBudget / charCount;
  const tokenBudget = Math.floor(charBudget / CHARS_PER_TOKEN);
  issues.push(`Content exceeds token budget: ~${Math.ceil(charCount / CHARS_PER_TOKEN)} tokens (budget: ${tokenBudget})`);
  return { score: Math.max(0, ratio), issues };
}

/**
 * Compute coherence quality sub-score.
 *
 * Starts with four additive structural checks, each worth 0.25 points, then
 * applies bounded deductions for temporal and relational inconsistencies:
 *
 *   1. Non-empty (trimmed length > 0)        → +0.25
 *   2. Minimal length (> 50 chars)            → +0.25
 *   3. Has at least one Markdown heading
 *      (`# …`, `## …`, or `### …`)           → +0.25
 *   4. Substantial content (> 200 chars)      → +0.25
 *
 * Deductions:
 *   - Future-dated completion claims          → up to -0.25
 *   - Unresolved/self causal references       → up to -0.25
 *
 * Each failing check contributes a descriptive string to `issues`.
 * An entirely empty content string short-circuits to score 0.0.
 *
 * @param content - Full text content of the memory file.
 * @param metadata - Optional metadata used for temporal/relational validation.
 * @returns An object with:
 *   - `score`  — Sub-score in the range [0, 1].
 *   - `issues` — One entry per failed structural check.
 */
function scoreCoherence(content: string, metadata: CoherenceMetadata = {}): { score: number; issues: string[] } {
  const issues: string[] = [];
  let score = 0;

  if (!content || content.trim().length === 0) {
    issues.push('Content is empty');
    return { score: 0, issues };
  }
  score += 0.25; // non-empty

  if (content.length > 50) {
    score += 0.25; // >50 chars
  } else {
    issues.push('Content is very short (<50 chars)');
  }

  if (HEADING_PATTERN.test(content)) {
    score += 0.25; // has markdown headings
  } else {
    issues.push('No section headings found');
  }

  if (content.length > 200) {
    score += 0.25; // substantial content
  } else {
    issues.push('Content lacks substance (<200 chars)');
  }

  let temporalPenalty = 0;
  const lastModified = typeof metadata.lastModified === 'string'
    ? Date.parse(metadata.lastModified)
    : Number.NaN;
  if (Number.isFinite(lastModified)) {
    const matches = Array.from(content.matchAll(ISO_DATE_PATTERN));
    const futureClaims = matches.filter((match) => {
      const dateValue = Date.parse(`${match[1]}T00:00:00.000Z`);
      if (!Number.isFinite(dateValue) || dateValue <= lastModified + 86400000) {
        return false;
      }

      const start = Math.max(0, (match.index ?? 0) - 80);
      const end = Math.min(content.length, (match.index ?? 0) + match[0].length + 80);
      const surroundingText = content.slice(start, end);
      return COMPLETION_CLAIM_PATTERN.test(surroundingText);
    });

    if (futureClaims.length > 0) {
      temporalPenalty = Math.min(0.25, futureClaims.length * 0.125);
      issues.push(`Future-dated completion claims found: ${futureClaims.map(match => match[1]).join(', ')}`);
    }
  }

  let relationalPenalty = 0;
  const causalLinks = metadata.causalLinks && typeof metadata.causalLinks === 'object'
    ? metadata.causalLinks
    : null;
  const resolveReference = typeof metadata.resolveReference === 'function'
    ? metadata.resolveReference
    : null;
  const normalizedSelfTargets = new Set(
    [metadata.title, metadata.filePath]
      .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      .map(value => value.trim().toLowerCase())
  );

  if (causalLinks) {
    const flattenedReferences = Object.values(causalLinks)
      .flatMap((value) => Array.isArray(value) ? value : [])
      .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      .map(value => value.trim());

    if (flattenedReferences.length > 0) {
      const selfReferences = flattenedReferences.filter(reference => normalizedSelfTargets.has(reference.toLowerCase()));
      const unresolvedReferences = resolveReference
        ? flattenedReferences.filter(reference => !resolveReference(reference))
        : [];

      const brokenReferenceCount = selfReferences.length + unresolvedReferences.length;
      if (brokenReferenceCount > 0) {
        relationalPenalty = Math.min(0.25, (brokenReferenceCount / flattenedReferences.length) * 0.25);
      }

      if (selfReferences.length > 0) {
        issues.push(`Self-referential causal links found: ${selfReferences.join(', ')}`);
      }
      if (unresolvedReferences.length > 0) {
        issues.push(`Unresolved causal link references: ${unresolvedReferences.join(', ')}`);
      }
    }
  }

  return { score: Math.max(0, score - temporalPenalty - relationalPenalty), issues };
}

/**
 * Compute composite quality score for a memory file.
 *
 * Aggregates the four dimension sub-scores into a single weighted total using
 * the weights defined in `QUALITY_WEIGHTS`:
 *   - triggers  × 0.25
 *   - anchors   × 0.30
 *   - budget    × 0.20
 *   - coherence × 0.25
 *
 * The total is rounded to three decimal places before being returned.
 *
 * @param content  - Full text content of the memory file.
 * @param metadata - Raw metadata record extracted from the memory file. Passed
 *   through to `scoreTriggerPhrases`; must contain a `triggerPhrases` key
 *   whose value is an array of strings.
 * @returns A `QualityScore` object containing:
 *   - `total`     — Weighted composite score in the range [0, 1], rounded to
 *     three decimal places.
 *   - `breakdown` — Per-dimension raw sub-scores (`triggers`, `anchors`,
 *     `budget`, `coherence`), each in [0, 1].
 *   - `issues`    — Concatenated issue strings from all four dimension scorers,
 *     in order: triggers → anchors → budget → coherence.
 */
function computeMemoryQualityScore(
  content: string,
  metadata: Record<string, unknown>,
): QualityScore {
  const triggerResult = scoreTriggerPhrases(metadata);
  const anchorResult = scoreAnchorFormat(content);
  const budgetResult = scoreTokenBudget(content);
  const coherenceResult = scoreCoherence(content, metadata);

  const total =
    triggerResult.score * QUALITY_WEIGHTS.triggers +
    anchorResult.score * QUALITY_WEIGHTS.anchors +
    budgetResult.score * QUALITY_WEIGHTS.budget +
    coherenceResult.score * QUALITY_WEIGHTS.coherence;

  return {
    total: Math.round(total * 1000) / 1000, // 3 decimal places
    breakdown: {
      triggers: triggerResult.score,
      anchors: anchorResult.score,
      budget: budgetResult.score,
      coherence: coherenceResult.score,
    },
    issues: [
      ...triggerResult.issues,
      ...anchorResult.issues,
      ...budgetResult.issues,
      ...coherenceResult.issues,
    ],
  };
}

/**
 * Attempt automatic fixes for quality issues.
 *
 * Strategies:
 * - Re-extract trigger phrases from content headings/title
 * - Close unclosed ANCHOR tags
 * - Trim content to token budget
 *
 * Returns the (possibly modified) content, metadata, and list of applied fixes.
 */
function attemptAutoFix(
  content: string,
  metadata: Record<string, unknown>,
  issues: string[],
): { content: string; metadata: Record<string, unknown>; fixed: string[] } {
  let fixedContent = content;
  const fixedMetadata = { ...metadata };
  const fixed: string[] = [];

  // Fix #1 : Re-extract trigger phrases if missing/insufficient
  const hasTriggerIssue = issues.some(i => /trigger phrase/i.test(i));
  if (hasTriggerIssue) {
    const existingTriggers = Array.isArray(fixedMetadata.triggerPhrases)
      ? (fixedMetadata.triggerPhrases as string[])
      : [];

    const extracted = extractTriggersFromContent(fixedContent, fixedMetadata.title as string | undefined);
    if (extracted.length > existingTriggers.length) {
      fixedMetadata.triggerPhrases = extracted;
      fixed.push(`Re-extracted ${extracted.length} trigger phrases from content`);
    }
  }

  // O2-6: Fix #3 (trim) runs BEFORE Fix #2 (anchors) to prevent trim from
  // removing anchor closing tags that were just appended by Fix #2.

  // Fix #3 : Trim content to budget
  const hasBudgetIssue = issues.some(i => /token budget/i.test(i));
  if (hasBudgetIssue) {
    if (fixedContent.length > DEFAULT_CHAR_BUDGET) {
      // Trim to budget, preserving the last newline boundary
      const trimmed = fixedContent.substring(0, DEFAULT_CHAR_BUDGET);
      const lastNewline = trimmed.lastIndexOf('\n');
      fixedContent = lastNewline > 0 ? trimmed.substring(0, lastNewline) : trimmed;
      fixed.push(`Trimmed content from ${content.length} to ${fixedContent.length} chars`);
    }
  }

  // Fix #2 : Close unclosed ANCHOR tags
  const hasAnchorIssue = issues.some(i => /unclosed anchor/i.test(i));
  if (hasAnchorIssue) {
    fixedContent = normalizeAnchors(fixedContent);
    fixed.push('Normalized unclosed ANCHOR tags');
  }

  return { content: fixedContent, metadata: fixedMetadata, fixed };
}

/**
 * Extract trigger phrases from content by scanning headings and the title.
 */
// O2-10: Contamination patterns to filter from extracted headings
const CONTAM_HEADING_PATTERNS = [
  /\b(?:step|task|phase)\s+\d+/i,
  /\b(?:I'll|let me|I need to|I will)\b/i,
  /\b(?:as an AI|AI assistant)\b/i,
];

function extractTriggersFromContent(content: string, title?: string): string[] {
  let triggers: string[] = [];

  // Add title as a trigger if present
  if (title && title.trim().length > 0) {
    triggers.push(title.trim().toLowerCase());
  }

  // Extract markdown headings as triggers
  const headingPattern = /^#{1,3}\s+(.+)$/gm;
  let match: RegExpExecArray | null;
  while ((match = headingPattern.exec(content)) !== null) {
    const heading = match[1].trim().toLowerCase();
    if (heading.length > 3 && heading.length < 80 && !triggers.includes(heading)) {
      triggers.push(heading);
    }
  }

  // O2-10: Filter out headings that match contamination patterns
  triggers = triggers.filter(t =>
    !CONTAM_HEADING_PATTERNS.some(p => p.test(t))
  );

  return triggers.slice(0, 8); // Cap at 8 triggers
}

/**
 * Normalize ANCHOR tags by closing any unclosed ones.
 * Appends <!-- /ANCHOR: name --> at the end of content for unclosed anchors.
 */
function normalizeAnchors(content: string): string {
  const openPattern = /<!--\s*ANCHOR:\s*([\w-]+)\s*-->/g;
  const closePattern = /<!--\s*\/ANCHOR:\s*([\w-]+)\s*-->/g;

  const openAnchors: string[] = [];
  const closeAnchors: string[] = [];

  let match: RegExpExecArray | null;
  while ((match = openPattern.exec(content)) !== null) {
    openAnchors.push(match[1]);
  }
  while ((match = closePattern.exec(content)) !== null) {
    closeAnchors.push(match[1]);
  }

  const countAnchors = (anchors: string[]): Map<string, number> => {
    const counts = new Map<string, number>();
    for (const name of anchors) {
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return counts;
  };

  const openCounts = countAnchors(openAnchors);
  const closeCounts = countAnchors(closeAnchors);
  const unclosed: string[] = [];

  for (const [name, openCount] of openCounts.entries()) {
    const closeCount = closeCounts.get(name) ?? 0;
    const missingClosers = openCount - closeCount;
    for (let index = 0; index < Math.max(0, missingClosers); index++) {
      unclosed.push(name);
    }
  }

  if (unclosed.length === 0) return content;

  // Append closing tags for unclosed anchors
  let result = content;
  for (const name of unclosed) {
    result += `\n<!-- /ANCHOR: ${name} -->`;
  }
  return result;
}

/**
 * Run the verify-fix-verify quality loop on memory content.
 *
 * Gated behind SPECKIT_QUALITY_LOOP env var.
 * Computes quality score, attempts auto-fix if below threshold,
 * rejects after maxRetries failures.
 * Retry attempts are intentionally immediate (no delay/backoff): fixes are
 * deterministic local transforms and the loop is tightly bounded, so immediate
 * retries keep ingestion latency predictable within a single request cycle.
 *
 * @param content - Memory file content
 * @param metadata - Parsed memory metadata (must include triggerPhrases)
 * @param options - threshold (default 0.6), maxRetries (default 2 immediate retries)
 * @returns QualityLoopResult with pass/fail, scores, fixes, rejection info
 */
function runQualityLoop(
  content: string,
  metadata: Record<string, unknown>,
  options?: QualityLoopOptions,
): QualityLoopResult {
  const threshold = options?.threshold ?? 0.6;
  const maxRetries = options?.maxRetries ?? 2;
  const emitEvalMetrics = options?.emitEvalMetrics ?? true;

  // Feature gate check
  if (!isQualityLoopEnabled()) {
    // When disabled, compute score but always pass
    const score = computeMemoryQualityScore(content, metadata);
    return {
      passed: true,
      score,
      attempts: 1,
      fixes: [],
      rejected: false,
    };
  }

  // First evaluation
  let currentContent = content;
  let currentMetadata = { ...metadata };
  let score = computeMemoryQualityScore(currentContent, currentMetadata);
  const allFixes: string[] = [];
  let attemptsUsed = 1;
  let autoFixAttemptsUsed = 0;

  if (score.total >= threshold) {
    logQualityMetrics(score, 1, true, false, emitEvalMetrics);
    return {
      passed: true,
      score,
      attempts: 1,
      fixes: [],
      rejected: false,
    };
  }

  // F07-005: Track best state across auto-fix iterations
  let bestScore = score;
  let bestContent = currentContent;
  let bestMetadata = { ...currentMetadata };
  let _bestAttempt = 0;

  // Auto-fix loop
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    autoFixAttemptsUsed = attempt;
    const fixResult = attemptAutoFix(currentContent, currentMetadata, score.issues);
    currentContent = fixResult.content;
    currentMetadata = fixResult.metadata;
    allFixes.push(...fixResult.fixed);

    // Re-evaluate after fix
    score = computeMemoryQualityScore(currentContent, currentMetadata);
    attemptsUsed = attempt + 1;

    // Track best state — revert if fix made things worse
    if (score.total > bestScore.total) {
      bestScore = score;
      bestContent = currentContent;
      bestMetadata = { ...currentMetadata };
      _bestAttempt = attempt;
    }

    if (score.total >= threshold) {
      logQualityMetrics(score, attemptsUsed, true, false, emitEvalMetrics);
      return {
        passed: true,
        score,
        attempts: attemptsUsed,
        fixes: allFixes,
        rejected: false,
        // Return mutated content so caller can persist it and recompute content_hash
        fixedContent: allFixes.length > 0 ? currentContent : undefined,
        fixedTriggerPhrases: triggerPhrasesChanged(metadata.triggerPhrases, currentMetadata.triggerPhrases)
          ? currentMetadata.triggerPhrases as string[]
          : undefined,
      };
    }

    // If no fixes were applied, further retries won't help
    if (fixResult.fixed.length === 0) {
      break;
    }
  }

  // Rejected after all retries
  const rejectionReason = `Quality score ${score.total.toFixed(3)} below threshold ${threshold} after ${autoFixAttemptsUsed} auto-fix attempt(s). Issues: ${score.issues.join('; ')}`;

  logQualityMetrics(score, attemptsUsed, false, true, emitEvalMetrics);

  return {
    passed: false,
    score,
    attempts: attemptsUsed,
    fixes: allFixes,
    rejected: true,
    rejectionReason,
    // Return best-state content on rejection so callers that soft-reject persist the highest-scoring attempt
    fixedContent: allFixes.length > 0 ? bestContent : undefined,
    fixedTriggerPhrases: triggerPhrasesChanged(metadata.triggerPhrases, bestMetadata.triggerPhrases)
      ? bestMetadata.triggerPhrases as string[]
      : undefined,
  };
}

/**
 * Log quality metrics to the eval infrastructure (eval_metric_snapshots table).
 * Fail-safe: never throws. No-op when eval logging is disabled.
 */
function logQualityMetrics(
  score: QualityScore,
  attempts: number,
  passed: boolean,
  rejected: boolean,
  emitEvalMetrics: boolean = true,
): void {
  try {
    if (!emitEvalMetrics) return;
    // Use eval logger's feature flag check
    if (process.env.SPECKIT_EVAL_LOGGING?.toLowerCase() !== 'true') return;

    const db = initEvalDb();

    const metadata = JSON.stringify({
      breakdown: score.breakdown,
      issues: score.issues,
      attempts,
      passed,
      rejected,
    });

    db.prepare(`
      INSERT INTO eval_metric_snapshots
        (eval_run_id, metric_name, metric_value, channel, query_count, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      0, // No eval run for quality metrics
      'memory_quality_score',
      score.total,
      'quality_loop',
      attempts,
      metadata,
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('[quality-loop] logQualityMetrics failed (non-fatal):', msg);
  }
}

export {
  computeMemoryQualityScore,
  scoreTriggerPhrases,
  scoreAnchorFormat,
  scoreTokenBudget,
  scoreCoherence,
  attemptAutoFix,
  extractTriggersFromContent,
  normalizeAnchors,
  runQualityLoop,
  logQualityMetrics,
  // Re-exported from search-flags for backward compatibility
  isQualityLoopEnabled,
  QUALITY_WEIGHTS,
  DEFAULT_TOKEN_BUDGET,
  DEFAULT_CHAR_BUDGET,
};

export type {
  QualityScore,
  QualityScoreBreakdown,
  QualityLoopResult,
};
