// ───────────────────────────────────────────────────────────────
// MODULE: Save Quality Gate
// ───────────────────────────────────────────────────────────────
// Pre-Storage Quality Gate
//
// 3-layer validation before storing memories:
// - Layer 1: Structural validation (existing checks, formalized)
// - Layer 2: Content quality scoring (title, triggers, length,
// Anchors, metadata, signal density)
// - Layer 3: Semantic dedup (cosine similarity against existing)
//
// Behind SPECKIT_SAVE_QUALITY_GATE flag (default ON, graduated).
// Set SPECKIT_SAVE_QUALITY_GATE=false to disable.
//
// Warn-only mode: for the first 14 days after activation, the
// Gate logs quality scores and would-reject decisions but does
// NOT block saves. This prevents disruption during rollout.
//
// Activation timestamp is persisted to SQLite config table so
// The 14-day graduation countdown survives server restarts.
import { isSaveQualityGateEnabled } from '../search/search-flags.js';
import * as vectorIndex from '../search/vector-index.js';
import { resolveCanonicalContextType } from '@spec-kit/shared/context-types';

// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
/** Result from Layer 1: Structural validation */
export interface StructuralValidationResult {
  pass: boolean;
  reasons: string[];
}

/** Individual dimension scores from Layer 2 */
export interface ContentQualityDimensions {
  titleQuality: number;
  triggerQuality: number;
  lengthQuality: number;
  anchorQuality: number;
  metadataQuality: number;
}

/** Result from Layer 2: Content quality scoring */
export interface ContentQualityResult {
  pass: boolean;
  signalDensity: number;
  dimensions: ContentQualityDimensions;
  threshold: number;
  reasons: string[];
}

/** Result from Layer 3: Semantic dedup */
export interface SemanticDedupResult {
  pass: boolean;
  isDuplicate: boolean;
  mostSimilarId: number | null;
  mostSimilarScore: number | null;
  threshold: number;
  reason: string | null;
}

/** Combined result from all quality gate layers */
export interface QualityGateResult {
  pass: boolean;
  gateEnabled: boolean;
  warnOnly: boolean;
  wouldReject: boolean;
  layers: {
    structural: StructuralValidationResult;
    contentQuality: ContentQualityResult;
    semanticDedup: SemanticDedupResult | null;
  };
  reasons: string[];
}

/** Parameters for running the quality gate */
export interface QualityGateParams {
  title: string | null;
  content: string;
  specFolder: string;
  triggerPhrases?: string[];
  anchors?: string[];
  embedding?: Float32Array | number[] | null;
  findSimilar?: FindSimilarFn | null;
  /** REQ-D4-003: context_type for short-critical exception evaluation */
  contextType?: string | null;
}

/** Callback for finding similar memories by embedding */
type FindSimilarFn = (
  embedding: Float32Array | number[],
  options: { limit: number; specFolder?: string }
) => Array<{ id: number; file_path: string; similarity: number }>;

// ───────────────────────────────────────────────────────────────
// 2. CONFIGURATION

// ───────────────────────────────────────────────────────────────
/** Signal density threshold: below this score, content is too low quality */
const SIGNAL_DENSITY_THRESHOLD = 0.4;

/** Semantic dedup similarity threshold: above this, reject as near-duplicate */
const SEMANTIC_DEDUP_THRESHOLD = 0.92;

/** Minimum content length for structural validation */
const MIN_CONTENT_LENGTH = 50;

/** Warn-only period duration in milliseconds (14 days) */
const WARN_ONLY_PERIOD_MS = 14 * 24 * 60 * 60 * 1000;

// ───────────────────────────────────────────────────────────────
// REQ-D4-003: Short-critical quality gate exception
// ───────────────────────────────────────────────────────────────

/** Minimum number of structural signals required for short-critical exception. */
const SHORT_CRITICAL_MIN_STRUCTURAL_SIGNALS = 2;
const SHORT_DECISION_EXCEPTION_LOG_PREFIX = '[QUALITY-GATE] short-critical-exception';

/** Layer 2 dimension weights for weighted average signal density */
const DIMENSION_WEIGHTS: Record<keyof ContentQualityDimensions, number> = {
  titleQuality: 0.25,
  triggerQuality: 0.20,
  lengthQuality: 0.20,
  anchorQuality: 0.15,
  metadataQuality: 0.20,
};

/** Generic/low-quality title patterns */
const GENERIC_TITLE_PATTERNS: RegExp[] = [
  /^memory$/i,
  /^session$/i,
  /^note$/i,
  /^untitled$/i,
  /^context$/i,
  /^save$/i,
  /^update$/i,
  /^new memory$/i,
  /^memory \d+$/i,
  /^session \d+$/i,
];

/** Spec folder path validation pattern */
const SPEC_FOLDER_PATTERN = /^[\w][\w\-/.]*$/;

/* ───────────────────────────────────────────────────────────────
   3. FEATURE FLAG & WARN-ONLY MODE
   ──────────────────────────────────────────────────────────────── */

/** SQLite config key for persisted activation timestamp */
const ACTIVATION_CONFIG_KEY = 'quality_gate_activated_at';

/** Track which DB handle has had config-table DDL ensured */
let configTableEnsuredForDb: { exec: (sql: string) => void } | null = null;

/**
 * Ensure the config table exists for the active DB handle.
 * Re-runs DDL when the DB handle changes (for example, after reinitialization).
 */
function ensureConfigTable(db: { exec: (sql: string) => void }): void {
  if (configTableEnsuredForDb === db) return;
  db.exec('CREATE TABLE IF NOT EXISTS config (key TEXT PRIMARY KEY, value TEXT)');
  configTableEnsuredForDb = db;
}

/**
 * Load the activation timestamp from SQLite config table.
 * Returns null if DB is unavailable or no stored value exists.
 */
function loadActivationTimestampFromDb(): number | null {
  try {
    const db = vectorIndex.getDb();
    if (!db) return null;
    ensureConfigTable(db);
    const row = db.prepare('SELECT value FROM config WHERE key = ?')
      .get(ACTIVATION_CONFIG_KEY) as { value: string } | undefined;
    return row ? parseInt(row.value, 10) : null;
  } catch {
    return null;
  }
}

/**
 * Persist the activation timestamp to SQLite config table.
 * Non-fatal: persistence failure does not block operation.
 */
function persistActivationTimestampToDb(timestamp: number): void {
  try {
    const db = vectorIndex.getDb();
    if (!db) return;
    ensureConfigTable(db);
    db.prepare('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)')
      .run(ACTIVATION_CONFIG_KEY, timestamp.toString());
  } catch {
    // Non-fatal: in-memory value still works
  }
}

/**
 * Clear the activation timestamp from SQLite config table.
 * Used in testing alongside resetActivationTimestamp().
 */
function clearActivationTimestampFromDb(): void {
  try {
    const db = vectorIndex.getDb();
    if (!db) return;
    ensureConfigTable(db);
    db.prepare('DELETE FROM config WHERE key = ?').run(ACTIVATION_CONFIG_KEY);
  } catch {
    // Non-fatal
  }
}

/**
 * Activation timestamp for warn-only mode tracking.
 * Set when the feature flag is first enabled.
 * Exported for testing purposes.
 *
 * P1-015: Also persisted to SQLite config table. On access, lazy-loads
 * from DB if in-memory value is null.
 */
let qualityGateActivatedAt: number | null = null;

/**
 * Check if the quality gate feature flag is enabled.
 * Default: TRUE. Set SPECKIT_SAVE_QUALITY_GATE=false to disable.
 *
 * @returns true if SPECKIT_SAVE_QUALITY_GATE is not explicitly disabled
 */
export function isQualityGateEnabled(): boolean {
  return isSaveQualityGateEnabled();
}

/**
 * Check if the quality gate is in warn-only mode.
 * For the first 14 days after activation, the gate logs scores but
 * does not block saves, preventing disruption during rollout.
 *
 * P1-015: Lazy-loads from SQLite if in-memory value is null, so the
 * 14-day countdown survives server restarts.
 *
 * @returns true if in warn-only period
 */
export function isWarnOnlyMode(): boolean {
  // P1-015: Lazy-load from DB on first access after restart
  if (qualityGateActivatedAt === null) {
    const persisted = loadActivationTimestampFromDb();
    if (persisted !== null) {
      qualityGateActivatedAt = persisted;
    }
  }

  if (qualityGateActivatedAt === null) {
    return false;
  }
  const elapsed = Date.now() - qualityGateActivatedAt;
  return elapsed < WARN_ONLY_PERIOD_MS;
}

/**
 * Record the activation timestamp for warn-only mode tracking.
 * Called when the quality gate is first enabled.
 *
 * P1-015: Persists to SQLite config table for restart survival.
 *
 * @param timestamp - Unix timestamp in milliseconds. If not provided, uses Date.now()
 */
export function setActivationTimestamp(timestamp?: number): void {
  qualityGateActivatedAt = timestamp ?? Date.now();
  persistActivationTimestampToDb(qualityGateActivatedAt);
}

/**
 * Reset the activation timestamp. Used in testing.
 * P1-015: Also clears the persisted value from SQLite.
 */
export function resetActivationTimestamp(): void {
  qualityGateActivatedAt = null;
  configTableEnsuredForDb = null;
  clearActivationTimestampFromDb();
}

/**
 * Ensure activation timestamp is initialized without resetting persisted state.
 *
 * If in-memory state is empty, first trigger the lazy DB load path. Only when no
 * persisted value exists do we create a new activation timestamp.
 */
function ensureActivationTimestampInitialized(): void {
  if (qualityGateActivatedAt !== null) return;

  // Triggers lazy-load from SQLite (if present) via existing path.
  isWarnOnlyMode();

  if (qualityGateActivatedAt === null) {
    setActivationTimestamp();
  }
}

/* ───────────────────────────────────────────────────────────────
   3b. REQ-D4-003: SAVE QUALITY GATE EXCEPTIONS
   ──────────────────────────────────────────────────────────────── */

/**
 * REQ-D4-003: Check whether the save quality gate exceptions feature is enabled.
 * Default: TRUE (graduated). Set SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS=false to disable.
 *
 * When enabled, decision documents with sufficient structural signals may bypass
 * the 50-character minimum content length check. All other gates (0.4 density,
 * 0.92 dedup) remain enforced.
 */
export function isSaveQualityGateExceptionsEnabled(): boolean {
  if (!isQualityGateEnabled()) return false;
  const val = process.env.SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS?.toLowerCase().trim();
  return val !== 'false' && val !== '0';
}

/**
 * REQ-D4-003: Count structural signals present in a document.
 *
 * Structural signals: title, specFolder (non-empty), anchor (non-empty string).
 * A decision document with >= 2 signals qualifies for the short-critical exception.
 */
export function countStructuralSignals(params: {
  title: string | null;
  specFolder: string | null | undefined;
  anchor?: string | null;
}): number {
  let count = 0;
  if (params.title && params.title.trim().length > 0) count++;
  if (params.specFolder && params.specFolder.trim().length > 0) count++;
  if (params.anchor && params.anchor.trim().length > 0) count++;
  return count;
}

/**
 * REQ-D4-003: Determine whether the short-critical exception applies.
 *
 * Returns true when ALL conditions hold:
 *   1. SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS is enabled
 *   2. context_type === 'planning' (or legacy 'decision')
 *   3. At least SHORT_CRITICAL_MIN_STRUCTURAL_SIGNALS (2) structural signals present
 *
 * This is warn-only initially — callers must log bypass events.
 */
export function isShortCriticalException(params: {
  contextType: string | null | undefined;
  title: string | null;
  specFolder: string | null | undefined;
  anchor?: string | null;
}): boolean {
  if (!isSaveQualityGateExceptionsEnabled()) return false;
  // P1-3: Use shared resolver instead of hardcoded check
  if (!params.contextType || resolveCanonicalContextType(params.contextType) !== 'planning') return false;

  const signals = countStructuralSignals({
    title: params.title,
    specFolder: params.specFolder,
    anchor: params.anchor,
  });

  return signals >= SHORT_CRITICAL_MIN_STRUCTURAL_SIGNALS;
}

export function isQualityGateExceptionEnabled(): boolean {
  return isSaveQualityGateExceptionsEnabled();
}

export function shouldBypassShortDecisionLengthGate(params: {
  contextType: string | null | undefined;
  title: string | null;
  specFolder: string | null | undefined;
  anchor?: string | null;
}): boolean {
  return isShortCriticalException(params);
}

/* ───────────────────────────────────────────────────────────────
   4. LAYER 1: STRUCTURAL VALIDATION
   ──────────────────────────────────────────────────────────────── */

/**
 * Layer 1: Validate structural requirements for a memory.
 *
 * Checks:
 * - Title exists and is non-empty
 * - Content is non-empty and meets minimum length
 * - Spec folder path is valid format
 *
 * REQ-D4-003: When SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS is enabled, the
 * minimum content length check is bypassed for `planning` (or legacy `decision`)
 * context_type documents that have >= 2 structural signals (title + specFolder + anchor).
 * Bypass events are logged as warnings (warn-only initially).
 *
 * @param params - The memory parameters to validate
 * @returns StructuralValidationResult with pass/fail and reasons
 */
export function validateStructural(params: {
  title: string | null;
  content: string;
  specFolder: string;
  contextType?: string | null;
  anchor?: string | null;
}): StructuralValidationResult {
  const reasons: string[] = [];

  if (!params.title || params.title.trim().length === 0) {
    reasons.push('Title is missing or empty');
  }

  if (!params.content || params.content.trim().length === 0) {
    reasons.push('Content is empty');
  } else if (params.content.trim().length < MIN_CONTENT_LENGTH) {
    // REQ-D4-003: Check for short-critical exception before adding rejection reason
    const exceptionApplies = isShortCriticalException({
      contextType: params.contextType,
      title: params.title,
      specFolder: params.specFolder,
      anchor: params.anchor,
    });

    if (exceptionApplies) {
      // Warn-only: log bypass event but do not add rejection reason
      console.warn(
        `${SHORT_DECISION_EXCEPTION_LOG_PREFIX} | context_type=${params.contextType ?? 'unknown'} | content_length=${params.content.trim().length} | bypassing min-length check`
      );
    } else {
      reasons.push(
        `Content too short: ${params.content.trim().length} chars (min: ${MIN_CONTENT_LENGTH})`
      );
    }
  }

  if (!params.specFolder || params.specFolder.trim().length === 0) {
    reasons.push('Spec folder is missing or empty');
  } else if (!SPEC_FOLDER_PATTERN.test(params.specFolder)) {
    reasons.push(
      `Invalid spec folder format: "${params.specFolder}" — must match pattern ${SPEC_FOLDER_PATTERN.source}`
    );
  }

  return {
    pass: reasons.length === 0,
    reasons,
  };
}

/* ───────────────────────────────────────────────────────────────
   5. LAYER 2: CONTENT QUALITY SCORING
   ──────────────────────────────────────────────────────────────── */

/**
 * Score title quality (0-1).
 * Considers length and specificity (penalizes generic titles).
 *
 * @param title - The memory title
 * @returns Score between 0 and 1
 */
export function scoreTitleQuality(title: string | null): number {
  if (!title || title.trim().length === 0) {
    return 0;
  }

  const trimmed = title.trim();

  // Check for generic titles
  for (const pattern of GENERIC_TITLE_PATTERNS) {
    if (pattern.test(trimmed)) {
      return 0.2;
    }
  }

  // Score based on length: very short titles (< 10 chars) get lower scores
  if (trimmed.length < 10) {
    return 0.4;
  }
  if (trimmed.length < 20) {
    return 0.6;
  }
  if (trimmed.length < 50) {
    return 0.8;
  }
  return 1.0;
}

/**
 * Score trigger phrase quality (0-1).
 *
 * @param triggerPhrases - Array of trigger phrases
 * @returns Score: 0 phrases=0, 1-2=0.5, 3+=1.0
 */
export function scoreTriggerQuality(triggerPhrases: string[]): number {
  const count = triggerPhrases.length;
  if (count === 0) return 0;
  if (count <= 2) return 0.5;
  return 1.0;
}

/**
 * Score content length quality (0-1).
 *
 * @param content - The memory content
 * @returns Score: short<200=0.3, 200-1000=0.7, >1000=1.0
 */
export function scoreLengthQuality(content: string): number {
  const len = content.trim().length;
  if (len < 200) return 0.3;
  if (len <= 1000) return 0.7;
  return 1.0;
}

/**
 * Score anchor quality (0-1).
 *
 * @param anchors - Array of anchor IDs found in content
 * @returns Score: 0 anchors=0, 1-2=0.5, 3+=1.0
 */
export function scoreAnchorQuality(anchors: string[]): number {
  const count = anchors.length;
  if (count === 0) return 0;
  if (count <= 2) return 0.5;
  return 1.0;
}

/**
 * Score metadata quality (0-1).
 * Checks for YAML frontmatter presence and completeness.
 *
 * @param content - The memory content to check for frontmatter
 * @returns Score: no frontmatter=0, partial=0.5, complete=1.0
 */
export function scoreMetadataQuality(content: string): number {
  const trimmed = content.trim();

  // Check for YAML frontmatter (--- delimited block at start)
  if (!trimmed.startsWith('---')) {
    return 0;
  }

  const endIndex = trimmed.indexOf('---', 3);
  if (endIndex === -1) {
    return 0;
  }

  const frontmatter = trimmed.slice(3, endIndex).trim();
  if (frontmatter.length === 0) {
    return 0;
  }

  // Check for key fields in frontmatter
  const hasTitle = /^title\s*:/m.test(frontmatter);
  const hasTriggers = /^trigger[_-]?phrases?\s*:/m.test(frontmatter);
  const hasContext = /^context[_-]?type\s*:/m.test(frontmatter);
  const hasTier = /^importance[_-]?tier\s*:/m.test(frontmatter);

  const fieldCount = [hasTitle, hasTriggers, hasContext, hasTier].filter(Boolean).length;

  if (fieldCount >= 3) return 1.0;
  if (fieldCount >= 1) return 0.5;
  return 0.3; // Has frontmatter but no recognized fields
}

/**
 * Compute a lightweight quality score for backfilled rows.
 *
 * @param row - Backfilled memory row fields
 * @returns Score between 0.1 and 1.0
 */
export function computeBackfillQualityScore(row: {
  content_text?: string;
  trigger_phrases?: string;
  title?: string;
  importance_tier?: string;
}): number {
  let score = 0.1;

  if ((row.content_text?.length ?? 0) > 100) {
    score += 0.2;
  }
  if ((Array.isArray(row.trigger_phrases) ? row.trigger_phrases.length : (row.trigger_phrases?.trim().length ?? 0)) > 0) {
    score += 0.2;
  }
  if ((row.title?.trim().length ?? 0) > 0) {
    score += 0.1;
  }
  if ((row.importance_tier?.trim().toLowerCase() ?? 'normal') !== 'normal') {
    score += 0.1;
  }

  return Math.min(score, 1.0);
}

/**
 * Layer 2: Compute content quality score across all dimensions.
 *
 * Signal density is the weighted average of all dimension scores.
 * Threshold: >= 0.4 to pass.
 *
 * @param params - The memory parameters to score
 * @returns ContentQualityResult with scores and pass/fail
 */
export function scoreContentQuality(params: {
  title: string | null;
  content: string;
  triggerPhrases?: string[];
  anchors?: string[];
}): ContentQualityResult {
  const dimensions: ContentQualityDimensions = {
    titleQuality: scoreTitleQuality(params.title),
    triggerQuality: scoreTriggerQuality(params.triggerPhrases ?? []),
    lengthQuality: scoreLengthQuality(params.content),
    anchorQuality: scoreAnchorQuality(params.anchors ?? []),
    metadataQuality: scoreMetadataQuality(params.content),
  };

  // Compute weighted average signal density
  let weightedSum = 0;
  let totalWeight = 0;
  for (const [dim, weight] of Object.entries(DIMENSION_WEIGHTS) as [keyof ContentQualityDimensions, number][]) {
    const score = dimensions[dim];
    weightedSum += score * weight;
    totalWeight += weight;
  }

  const signalDensity = totalWeight > 0 ? weightedSum / totalWeight : 0;
  const roundedDensity = Math.round(signalDensity * 100) / 100;

  const reasons: string[] = [];
  if (roundedDensity < SIGNAL_DENSITY_THRESHOLD) {
    reasons.push(
      `Signal density ${roundedDensity.toFixed(2)} below threshold ${SIGNAL_DENSITY_THRESHOLD}`
    );
    // Add specific dimension feedback
    if (dimensions.titleQuality < 0.4) {
      reasons.push('Low title quality: use a specific, descriptive title');
    }
    if (dimensions.triggerQuality === 0) {
      reasons.push('No trigger phrases: add at least 1-2 trigger phrases');
    }
    if (dimensions.metadataQuality === 0) {
      reasons.push('No YAML frontmatter: add metadata block');
    }
  }

  return {
    pass: roundedDensity >= SIGNAL_DENSITY_THRESHOLD,
    signalDensity: roundedDensity,
    dimensions,
    threshold: SIGNAL_DENSITY_THRESHOLD,
    reasons,
  };
}

/* ───────────────────────────────────────────────────────────────
   6. LAYER 3: SEMANTIC DEDUP
   ──────────────────────────────────────────────────────────────── */

/**
 * Compute cosine similarity between two vectors.
 *
 * @param a - First vector
 * @param b - Second vector
 * @returns Cosine similarity in range [-1, 1]
 */
export function cosineSimilarity(
  a: Float32Array | number[],
  b: Float32Array | number[]
): number {
  if (a.length !== b.length) {
    return 0;
  }
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;
  return dotProduct / denominator;
}

/**
 * Layer 3: Check for semantic near-duplicates using vector similarity.
 *
 * Compares the new memory's embedding against existing memories in
 * the same spec folder. If similarity > 0.92 against any existing
 * memory, the new memory is rejected as a near-duplicate.
 *
 * @param embedding - The embedding vector of the new memory
 * @param specFolder - The spec folder to search within
 * @param findSimilar - Callback to find similar memories by embedding
 * @returns SemanticDedupResult with pass/fail and most similar memory
 */
export function checkSemanticDedup(
  embedding: Float32Array | number[],
  specFolder: string,
  findSimilar: FindSimilarFn
): SemanticDedupResult {
  try {
    const candidates = findSimilar(embedding, {
      limit: 1,
      specFolder,
    });

    if (!candidates || candidates.length === 0) {
      return {
        pass: true,
        isDuplicate: false,
        mostSimilarId: null,
        mostSimilarScore: null,
        threshold: SEMANTIC_DEDUP_THRESHOLD,
        reason: null,
      };
    }

    const bestMatch = candidates[0];
    const isDuplicate = bestMatch.similarity >= SEMANTIC_DEDUP_THRESHOLD;

    return {
      pass: !isDuplicate,
      isDuplicate,
      mostSimilarId: bestMatch.id,
      mostSimilarScore: Math.round(bestMatch.similarity * 1000) / 1000,
      threshold: SEMANTIC_DEDUP_THRESHOLD,
      reason: isDuplicate
        ? `Near-duplicate detected: memory #${bestMatch.id} (similarity: ${(bestMatch.similarity * 100).toFixed(1)}% >= ${SEMANTIC_DEDUP_THRESHOLD * 100}%)`
        : null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[quality-gate] Semantic dedup check failed:', message);
    // Non-fatal: allow save through on error
    return {
      pass: true,
      isDuplicate: false,
      mostSimilarId: null,
      mostSimilarScore: null,
      threshold: SEMANTIC_DEDUP_THRESHOLD,
      reason: `Semantic dedup check error: ${message}`,
    };
  }
}

// ───────────────────────────────────────────────────────────────
// 3. UNIFIED QUALITY GATE

// ───────────────────────────────────────────────────────────────
/**
 * Run the full 3-layer quality gate for a memory save operation.
 *
 * When the feature flag is OFF, returns a pass-through result.
 * When in warn-only mode, logs scores but allows saves.
 *
 * @param params - The memory parameters to validate
 * @returns QualityGateResult with combined pass/fail and layer details
 */
export function runQualityGate(params: QualityGateParams): QualityGateResult {
  const gateEnabled = isQualityGateEnabled();

  // Feature flag OFF: pass-through
  if (!gateEnabled) {
    return {
      pass: true,
      gateEnabled: false,
      warnOnly: false,
      wouldReject: false,
      layers: {
        structural: { pass: true, reasons: [] },
        contentQuality: {
          pass: true,
          signalDensity: 0,
          dimensions: {
            titleQuality: 0,
            triggerQuality: 0,
            lengthQuality: 0,
            anchorQuality: 0,
            metadataQuality: 0,
          },
          threshold: SIGNAL_DENSITY_THRESHOLD,
          reasons: [],
        },
        semanticDedup: null,
      },
      reasons: [],
    };
  }

  // Initialize activation tracking without clobbering persisted state on restart.
  ensureActivationTimestampInitialized();

  const warnOnly = isWarnOnlyMode();
  const allReasons: string[] = [];

  // Layer 1: Structural validation
  // REQ-D4-003: Pass contextType so validateStructural can apply the short-critical exception
  const structural = validateStructural({
    title: params.title,
    content: params.content,
    specFolder: params.specFolder,
    contextType: params.contextType,
    anchor: params.anchors?.[0] ?? null,
  });
  allReasons.push(...structural.reasons);

  // Layer 2: Content quality scoring
  const contentQuality = scoreContentQuality({
    title: params.title,
    content: params.content,
    triggerPhrases: params.triggerPhrases,
    anchors: params.anchors,
  });
  allReasons.push(...contentQuality.reasons);

  // Layer 3: Semantic dedup (only if embedding and findSimilar are available)
  let semanticDedup: SemanticDedupResult | null = null;
  if (params.embedding && params.findSimilar) {
    semanticDedup = checkSemanticDedup(
      params.embedding,
      params.specFolder,
      params.findSimilar
    );
    if (semanticDedup.reason) {
      allReasons.push(semanticDedup.reason);
    }
  }

  // Determine pass/fail
  const wouldReject = !structural.pass
    || !contentQuality.pass
    || (semanticDedup !== null && !semanticDedup.pass);

  // In warn-only mode, log but allow through
  if (warnOnly && wouldReject) {
    console.warn(
      `[QUALITY-GATE] warn-only | score: ${contentQuality.signalDensity.toFixed(2)} | would-reject: true | reasons: [${allReasons.join(', ')}]`
    );
  }

  const pass = warnOnly ? true : !wouldReject;

  return {
    pass,
    gateEnabled: true,
    warnOnly,
    wouldReject,
    layers: {
      structural,
      contentQuality,
      semanticDedup,
    },
    reasons: allReasons,
  };
}

/* ───────────────────────────────────────────────────────────────
   8. EXPORTS (re-export constants for testing)
   ──────────────────────────────────────────────────────────────── */

export {
  SIGNAL_DENSITY_THRESHOLD,
  SEMANTIC_DEDUP_THRESHOLD,
  MIN_CONTENT_LENGTH,
  WARN_ONLY_PERIOD_MS,
  SHORT_CRITICAL_MIN_STRUCTURAL_SIGNALS,
  SHORT_DECISION_EXCEPTION_LOG_PREFIX,
};

/**
 * Re-exports related public types.
 */
export type { FindSimilarFn };
