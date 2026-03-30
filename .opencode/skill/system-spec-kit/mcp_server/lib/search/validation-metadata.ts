// ───────────────────────────────────────────────────────────────
// MODULE: Validation Metadata
// ───────────────────────────────────────────────────────────────
// Feature catalog: Validation signals as retrieval metadata
// PURPOSE: Extract validation signals from spec document metadata
// And surface them as retrieval metadata on PipelineRow results.
// This allows the scoring layer to incorporate spec quality information.
//
// SIGNAL SOURCES (in extraction order):
// 1. importance_tier  → qualitative quality signal (tier → numeric score)
// 2. quality_score    → direct numeric quality metric from DB column
// 3. content          → SPECKIT_LEVEL marker extraction
// 4. content          → validation completion markers
//
// This module is metadata-only. It NEVER modifies score
// Fields (score, rrfScore, similarity, intentAdjustedScore). It only
// Adds the `validationMetadata` key to enriched rows.

import type { PipelineRow } from './pipeline/types.js';

// -- Constants --

/**
 * Importance tier → quality score mapping.
 * Higher tiers (constitutional, critical) map to higher quality signals.
 * Used when quality_score is absent or zero.
 */
const TIER_QUALITY_SCORES: Record<string, number> = {
  constitutional: 1.0,
  critical: 0.9,
  important: 0.75,
  normal: 0.5,
  temporary: 0.3,
  deprecated: 0.1,
};

/**
 * Regex for extracting the SPECKIT_LEVEL marker from content.
 * Matches <!-- SPECKIT_LEVEL: N --> (case-insensitive, optional whitespace).
 * '3+' maps to level 4 to keep numeric comparisons consistent.
 */
const SPECKIT_LEVEL_REGEX = /<!--\s*SPECKIT_LEVEL:\s*(\d\+?)\s*-->/i;

/**
 * Markers that indicate a completed validation pass in the content.
 * Presence of any of these strings signals the document has been validated.
 */
const VALIDATION_COMPLETE_MARKERS = [
  '<!-- VALIDATED -->',
  '<!-- VALIDATION: PASS -->',
  '<!-- CHECKLIST: COMPLETE -->',
];

// -- Interfaces --

/**
 * Validation metadata extracted from a memory row's stored signals.
 * All fields are optional; absence means the signal could not be extracted.
 *
 * This is surfaced as retrieval metadata (not a score) so downstream
 * consumers (scoring layer, MCP output) can use it without risk of
 * double-counting in the fusion pipeline.
 */
export interface ValidationMetadata {
  /** Spec documentation level (1 = minimal, 2 = QA, 3 = complex, 4 = enterprise 3+). */
  specLevel?: number;
  /** True when a checklist.md document is detected from path or content. */
  hasChecklist?: boolean;
  /** Completion status derived from content markers ('complete' | 'partial' | 'unknown'). */
  completionStatus?: 'complete' | 'partial' | 'unknown';
  /** Normalised quality score in [0, 1] derived from quality_score or importance_tier. */
  qualityScore?: number;
  /** ISO date string of the most recent validation, if present in content. */
  validationDate?: string;
}

// -- Internal helpers --

/**
 * Derive a normalised quality score from importance_tier, clamped to [0, 1].
 * Returns undefined when the tier is unrecognised.
 */
function qualityScoreFromTier(tier: string | undefined): number | undefined {
  if (typeof tier !== 'string') return undefined;
  const normalized = tier.trim().toLowerCase();
  return TIER_QUALITY_SCORES[normalized];
}

/**
 * Extract a SPECKIT_LEVEL number from a content string.
 * '3+' is mapped to 4; other values must be integers in [1, 3].
 * Returns undefined when the marker is absent or the level is out of range.
 */
function extractSpecLevelFromContent(content: string): number | undefined {
  const match = content.match(SPECKIT_LEVEL_REGEX);
  if (!match) return undefined;

  const raw = match[1];
  if (raw === '3+') return 4;

  const level = parseInt(raw, 10);
  if (Number.isFinite(level) && level >= 1 && level <= 3) return level;
  return undefined;
}

/**
 * Determine whether a row's file_path implies a checklist relationship.
 * Returns true when the path contains a 'checklist' segment.
 */
function checklistFromFilePath(filePath: string | undefined): boolean {
  if (typeof filePath !== 'string') return false;
  return filePath.toLowerCase().includes('checklist');
}

/**
 * Scan content for validation completion markers.
 * Returns 'complete' when any VALIDATION_COMPLETE_MARKERS is found,
 * 'partial' when validation-related content exists but no completion marker,
 * 'unknown' when no evidence is present.
 */
function extractCompletionStatus(
  content: string
): 'complete' | 'partial' | 'unknown' {
  // Check for explicit completion markers first.
  for (const marker of VALIDATION_COMPLETE_MARKERS) {
    if (content.includes(marker)) return 'complete';
  }

  // Partial signal: content mentions validation-related keywords.
  const lower = content.toLowerCase();
  if (
    lower.includes('<!-- speckit_level') ||
    lower.includes('<!-- validated') ||
    lower.includes('[x]') ||
    lower.includes('- [x]')
  ) {
    return 'partial';
  }

  return 'unknown';
}

/**
 * Attempt to extract a validation date from a content string.
 * Looks for ISO 8601 date patterns (YYYY-MM-DD) in the content.
 * Returns the first match found, or undefined when none present.
 */
function extractValidationDate(content: string): string | undefined {
  // Match ISO 8601 date: YYYY-MM-DD
  const match = content.match(/\b(\d{4}-\d{2}-\d{2})\b/);
  return match ? match[1] : undefined;
}

// -- Public API --

/**
 * Extract validation signals from a single memory pipeline row.
 *
 * Signal resolution order:
 *   1. `quality_score` from the DB column (direct metric, highest priority).
 *      If zero or absent, falls back to tier-derived score.
 *   2. `importance_tier` → tier quality score mapping.
 *   3. `content` → SPECKIT_LEVEL marker (specLevel).
 *   4. `content` → completion markers (completionStatus, validationDate).
 *   5. `file_path` → checklist heuristic (hasChecklist).
 *
 * Returns null when the row carries no extractable validation signals
 * (no tier, no quality_score, no content with markers).
 *
 * @param row - A PipelineRow as it flows through the search pipeline.
 * @returns ValidationMetadata with all available signals, or null.
 */
export function extractValidationMetadata(
  row: PipelineRow
): ValidationMetadata | null {
  const result: ValidationMetadata = {};
  let hasAnySignal = false;

  // -- 1. Quality score (DB column takes priority) --
  // A positive, finite quality_score from the DB is the authoritative signal.
  // Zero is treated as absent (not yet scored) and falls back to tier-derived score.
  // Values above 1.0 are clamped to 1.0; negative values are treated as absent.
  const dbQualityScore = typeof row.quality_score === 'number' && Number.isFinite(row.quality_score) && row.quality_score > 0
    ? row.quality_score
    : undefined;

  if (dbQualityScore !== undefined) {
    result.qualityScore = Math.min(1, dbQualityScore); // clamp upper bound
    hasAnySignal = true;
  } else {
    // Fall back to tier-derived score when no DB quality_score is available.
    const tierScore = qualityScoreFromTier(row.importance_tier);
    if (tierScore !== undefined) {
      result.qualityScore = tierScore;
      hasAnySignal = true;
    }
  }

  // -- 2. Content-based signals --
  const content = typeof row.content === 'string' ? row.content : '';
  const precomputed = typeof row.precomputedContent === 'string' ? row.precomputedContent : '';
  // Prefer precomputed content (reassembled chunks) when available.
  const effectiveContent = precomputed.length > 0 ? precomputed : content;

  if (effectiveContent.length > 0) {
    // SPECKIT_LEVEL marker.
    const specLevel = extractSpecLevelFromContent(effectiveContent);
    if (specLevel !== undefined) {
      result.specLevel = specLevel;
      hasAnySignal = true;
    }

    // Completion status.
    const completionStatus = extractCompletionStatus(effectiveContent);
    if (completionStatus !== 'unknown') {
      result.completionStatus = completionStatus;
      hasAnySignal = true;
    }

    // Validation date (only when a completion or partial signal exists).
    if (completionStatus !== 'unknown') {
      const validationDate = extractValidationDate(effectiveContent);
      if (validationDate !== undefined) {
        result.validationDate = validationDate;
      }
    }
  }

  // -- 3. Checklist heuristic from file path --
  const hasChecklist = checklistFromFilePath(row.file_path);
  if (hasChecklist) {
    result.hasChecklist = true;
    hasAnySignal = true;
  }

  // -- 4. Importance tier signal (even without quality score fallback above) --
  // If we have a tier name at all, it's a signal — record qualityScore if not yet set.
  if (!hasAnySignal && typeof row.importance_tier === 'string') {
    const tierScore = qualityScoreFromTier(row.importance_tier);
    if (tierScore !== undefined) {
      result.qualityScore = tierScore;
      hasAnySignal = true;
    }
  }

  return hasAnySignal ? result : null;
}

/**
 * Enrich a batch of pipeline rows with validation metadata.
 *
 * For each row, `extractValidationMetadata` is called. When a non-null
 * result is returned, it is attached to the row under the `validationMetadata`
 * key. Rows with no signals pass through unchanged.
 *
 * Score fields are NEVER modified. This function is metadata-only.
 *
 * @param results - Array of PipelineRow values from the scoring pipeline.
 * @returns New array with `validationMetadata` added where signals exist.
 */
export function enrichResultsWithValidationMetadata(
  results: PipelineRow[]
): PipelineRow[] {
  if (!Array.isArray(results) || results.length === 0) return results;

  return results.map((row) => {
    const metadata = extractValidationMetadata(row);
    if (metadata === null) return row;

    return {
      ...row,
      validationMetadata: metadata,
    };
  });
}

// -- Exported constants (available to tests and consumers) --

/**
 * Validation metadata constants exposed for tests and downstream consumers.
 */
export { TIER_QUALITY_SCORES, SPECKIT_LEVEL_REGEX, VALIDATION_COMPLETE_MARKERS };
