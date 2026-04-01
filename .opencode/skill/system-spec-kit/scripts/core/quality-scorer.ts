// ---------------------------------------------------------------
// MODULE: Quality Scorer
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. QUALITY SCORER
// ───────────────────────────────────────────────────────────────
// Scores the quality of generated memory files based on multiple criteria

import {
  isContaminatedMemoryName,
  isGenericContentTask,
  normalizeMemoryNameCandidate,
  pickBestContentName,
} from '../utils/slug-utils';
import {
  getDescriptionTierRank,
  type DescriptionTier,
  validateDescription,
} from '../utils/file-helpers';
import type { MemorySufficiencyResult } from '@spec-kit/shared/parsing/memory-sufficiency';
import type {
  DescriptionProvenance,
  QualityDimensionScore,
  QualityFlag,
  QualityInsufficiencySummary,
  QualityScoreResult,
} from '../types/session-types';
import type { ContaminationSeverity } from '../extractors/contamination-filter';

interface FileWithDescription {
  DESCRIPTION?: string;
  _provenance?: DescriptionProvenance;
  _synthetic?: boolean;
}

interface ObservationWithNarrative {
  TITLE?: string;
  NARRATIVE?: string;
}

interface QualityBreakdown {
  triggerPhrases: number;
  keyTopics: number;
  fileDescriptions: number;
  contentLength: number;
  noLeakedTags: number;
  observationDedup: number;
}

// Re-export quality types from canonical location for backward compatibility
export type { QualityFlag, QualityDimensionScore, QualityInsufficiencySummary, QualityScoreResult } from '../types/session-types';

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

const DESCRIPTION_TIER_SCORES: Record<DescriptionTier, number> = {
  placeholder: 0,
  'activity-only': 0.35,
  semantic: 0.75,
  'high-confidence': 1,
};

function getDescriptionTrustMultiplier(file: FileWithDescription): number {
  if (file._synthetic) {
    return 0.5;
  }

  if (file._provenance === 'git') {
    return 1.0;
  }

  if (file._provenance === 'spec-folder' || file._provenance === 'tool') {
    return 0.8;
  }

  return 0.3;
}

function getDescriptionQualityScore(file: FileWithDescription): number {
  const tier = validateDescription(file.DESCRIPTION || '').tier;
  return DESCRIPTION_TIER_SCORES[tier] * getDescriptionTrustMultiplier(file);
}

function extractFrontmatterTitle(content: string): string {
  const titleMatch = content.match(/^title:\s*"([^"]+)"$/m);
  return titleMatch?.[1]?.trim() || '';
}

function extractHeadingTitle(content: string): string {
  const headingMatch = content.match(/^#\s+(.+)$/m);
  return headingMatch?.[1]?.trim() || '';
}

function hasSpecificPrimaryTitle(content: string): boolean {
  const titleCandidate = pickBestContentName([
    extractFrontmatterTitle(content),
    extractHeadingTitle(content),
  ]);

  return titleCandidate.length >= 8;
}

function hasMeaningfulObservationTitle(title?: string): boolean {
  if (!title) {
    return false;
  }

  const normalized = normalizeMemoryNameCandidate(title);
  if (normalized.length < 10) {
    return false;
  }

  return !isGenericContentTask(normalized) && !isContaminatedMemoryName(normalized);
}

/**
 * Score the quality of a generated memory file.
 * Runs after template rendering, before file writing.
 * Returns canonical score01 plus a score100 compatibility alias and a per-criterion breakdown.
 *
 * Legacy 8-parameter variant retained for backward compatibility.
 * Prefer `scoreMemoryQuality` from `extractors/quality-scorer.ts` which accepts
 * a single `QualityInputs` object and uses validation-rule-based scoring (V1-V12).
 */
// Rec 6 floor thresholds — minimum dimension scores for JSON quality floor activation
const JSON_FLOOR_THRESHOLDS = {
  triggerPhrases: 10,    // >= 4 trigger phrases extracted
  keyTopics: 5,          // >= 1 key topic present
  fileDescriptions: 10,  // Files with descriptions present
  contentLength: 8,      // >= 20 lines with specific title
  noLeakedTags: 10,      // No major HTML leaks
  observationDedup: 5,   // Some observations present
} as const;
const JSON_FLOOR_MIN_DIMENSIONS = 4;  // At least 4/6 must pass
const JSON_FLOOR_DAMPING = 0.85;      // Per DR-004
const JSON_FLOOR_CAP = 0.70;          // Hard maximum

export function scoreMemoryQuality(
  content: string,
  triggerPhrases: string[],
  keyTopics: string[],
  files: FileWithDescription[],
  observations: ObservationWithNarrative[],
  sufficiencyResult?: MemorySufficiencyResult,
  hadContamination = false,
  contaminationSeverity: ContaminationSeverity | null = null,
): QualityScoreResult {
  const warnings: string[] = [];
  const qualityFlags = new Set<QualityFlag>();
  const breakdown: QualityBreakdown = {
    triggerPhrases: 0,
    keyTopics: 0,
    fileDescriptions: 0,
    contentLength: 0,
    noLeakedTags: 0,
    observationDedup: 0,
  };

  // 1. Trigger phrases (0-20 points)
  if (triggerPhrases.length >= 8) {
    breakdown.triggerPhrases = 20;
  } else if (triggerPhrases.length >= 4) {
    breakdown.triggerPhrases = 15;
  } else if (triggerPhrases.length > 0) {
    breakdown.triggerPhrases = 10;
  } else {
    qualityFlags.add('missing_trigger_phrases');
    warnings.push('No trigger phrases extracted — memory will not surface via trigger matching');
  }

  // 2. Key topics (0-15 points)
  if (keyTopics.length >= 5) {
    breakdown.keyTopics = 15;
  } else if (keyTopics.length >= 2) {
    breakdown.keyTopics = 10;
  } else if (keyTopics.length > 0) {
    breakdown.keyTopics = 5;
  } else {
    qualityFlags.add('missing_key_topics');
    warnings.push('No key topics extracted — memory searchability reduced');
  }

  // 3. File descriptions populated (0-20 points)
  // This rewards memory files that remain self-explanatory in future sessions.
  const filesWithDesc = files.filter((file) => getDescriptionTierRank(validateDescription(file.DESCRIPTION || '').tier) >= getDescriptionTierRank('semantic'));
  if (files.length === 0) {
    qualityFlags.add('missing_file_context');
    breakdown.fileDescriptions = 10;
    warnings.push('No file context captured — semantic density reduced');
  } else {
    const descriptionQualityAverage = files.reduce((sum, file) => sum + getDescriptionQualityScore(file), 0) / files.length;
    breakdown.fileDescriptions = Math.round(descriptionQualityAverage * 20);
    if (descriptionQualityAverage < 0.5) {
      qualityFlags.add('missing_file_context');
      warnings.push(`${files.length - filesWithDesc.length}/${files.length} files missing descriptions`);
    }
  }

  // 4. Content length (0-15 points)
  const contentLines = content.split('\n').length;
  const hasSpecificTitle = hasSpecificPrimaryTitle(content);
  if (contentLines >= 100 && hasSpecificTitle) {
    breakdown.contentLength = 15;
  } else if (contentLines >= 50 && hasSpecificTitle) {
    breakdown.contentLength = 12;
  } else if (contentLines >= 20 && hasSpecificTitle) {
    breakdown.contentLength = 8;
  } else if (contentLines >= 100) {
    qualityFlags.add('generic_title');
    breakdown.contentLength = 10;
    warnings.push('Primary memory title is generic — long output still lacks specificity');
  } else if (contentLines >= 50) {
    qualityFlags.add('generic_title');
    breakdown.contentLength = 5;
    warnings.push('Primary memory title is generic — medium-length output lacks specificity');
  } else if (contentLines >= 20) {
    qualityFlags.add('generic_title');
    breakdown.contentLength = 3;
    warnings.push('Primary memory title is generic — short output lacks specificity');
  } else {
    qualityFlags.add('short_content');
    warnings.push(`Very short content (${contentLines} lines) — may lack useful context`);
  }

  // 5. No leaked HTML tags (0-15 points)
  const leakedTags = content.match(/<(?:summary|details|div|span|p|br|hr)\b[^>]*>/gi) || [];
  // Exclude tags inside fenced code blocks to avoid false positives.
  const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
  const codeContent = codeBlocks.join(' ');
  const tagsInCode = codeContent.match(/<(?:summary|details|div|span|p|br|hr)\b[^>]*>/gi) || [];
  const realLeakedTags = leakedTags.length - tagsInCode.length;
  if (realLeakedTags <= 0) {
    breakdown.noLeakedTags = 15;
  } else if (realLeakedTags <= 2) {
    qualityFlags.add('leaked_html');
    breakdown.noLeakedTags = 10;
    warnings.push(`${realLeakedTags} HTML tag(s) leaked into content`);
  } else {
    qualityFlags.add('leaked_html');
    breakdown.noLeakedTags = 5;
    warnings.push(`${realLeakedTags} HTML tags leaked into content — content may have raw HTML`);
  }

  // 6. Observation deduplication quality (0-15 points)
  // Repeated titles usually indicate low-information duplication.
  if (observations.length === 0) {
    qualityFlags.add('duplicate_observations');
    breakdown.observationDedup = 5;
    warnings.push('No observations captured — memory lacks concrete session evidence');
  } else {
    const titles = observations
      .map((observation) => normalizeMemoryNameCandidate(observation.TITLE || ''))
      .filter((title) => title.length > 0);
    const uniqueTitles = new Set(titles);
    const dedupRatio = titles.length > 0 ? uniqueTitles.size / titles.length : 1;
    const meaningfulTitles = titles.filter((title) => hasMeaningfulObservationTitle(title));
    const meaningfulRatio = titles.length > 0 ? meaningfulTitles.length / titles.length : 0;
    breakdown.observationDedup = Math.round(dedupRatio * meaningfulRatio * 15);
    if (dedupRatio < 0.6) {
      qualityFlags.add('duplicate_observations');
      warnings.push(`High observation duplication: ${titles.length - uniqueTitles.size} duplicate titles`);
    }
    if (meaningfulRatio < 0.7) {
      qualityFlags.add('duplicate_observations');
      warnings.push('Observation titles remain too generic — semantic diversity reduced');
    }
  }

  let score01 = clamp01(Object.values(breakdown).reduce((sum, v) => sum + v, 0) / 100);

  // Rec 6: JSON-mode quality floor — when all scoring dimensions contribute something,
  // the input likely has substantive content. Apply a floor to prevent thin-but-valid
  // JSON saves from scoring artificially low due to transcript-optimized heuristics.
  const allDimensionsContribute = Object.values(breakdown).every((v) => v > 0);
  const jsonFloorDimensions = {
    hasTriggers: breakdown.triggerPhrases >= JSON_FLOOR_THRESHOLDS.triggerPhrases,
    hasTopics: breakdown.keyTopics >= JSON_FLOOR_THRESHOLDS.keyTopics,
    hasFiles: breakdown.fileDescriptions >= JSON_FLOOR_THRESHOLDS.fileDescriptions,
    hasContent: breakdown.contentLength >= JSON_FLOOR_THRESHOLDS.contentLength,
    htmlClean: breakdown.noLeakedTags >= JSON_FLOOR_THRESHOLDS.noLeakedTags,
    hasObservations: breakdown.observationDedup >= JSON_FLOOR_THRESHOLDS.observationDedup,
  };
  const jsonFloorScore = Object.values(jsonFloorDimensions).filter(Boolean).length;
  if (allDimensionsContribute && jsonFloorScore >= JSON_FLOOR_MIN_DIMENSIONS) {
    const rawFloor = (jsonFloorScore / 6) * JSON_FLOOR_DAMPING;
    const cappedFloor = Math.min(rawFloor, JSON_FLOOR_CAP);
    if (score01 < cappedFloor) {
      score01 = cappedFloor;
      warnings.push(`JSON quality floor applied: ${Math.round(cappedFloor * 100)}/100 (${jsonFloorScore}/6 dimensions passed)`);
    }
  }

  let scoreCap: number | null = null;
  const effectiveSeverity: ContaminationSeverity = contaminationSeverity || 'medium';

  // O2-4: Contamination penalties aligned with extractors scorer
  if (hadContamination) {
    qualityFlags.add('has_contamination');
    const severity = effectiveSeverity;
    if (severity === 'low') {
      score01 -= 0.10;
      warnings.push('Low-severity contamination detected (preamble only) — penalty applied');
    } else if (severity === 'medium') {
      score01 -= 0.15;
      scoreCap = Math.min(scoreCap ?? 1, 0.85);
      warnings.push('Medium-severity contamination detected (orchestration chatter) — capped at 0.85');
    } else {
      score01 -= 0.30;
      scoreCap = Math.min(scoreCap ?? 1, 0.60);
      warnings.push('High-severity contamination detected (AI self-reference/tool leaks) — capped at 0.60');
    }
  }

  if (sufficiencyResult && !sufficiencyResult.pass) {
    qualityFlags.add('has_insufficient_context');
    scoreCap = Math.min(scoreCap ?? 1, clamp01(sufficiencyResult.score * 0.4));
    warnings.push(
      `Insufficient context for a durable memory: ${sufficiencyResult.reasons.join(' ')}`
    );
  }

  if (scoreCap !== null) {
    score01 = Math.min(score01, scoreCap);
  }

  score01 = clamp01(score01);
  const score100 = Math.round(score01 * 100);
  const dimensions: QualityDimensionScore[] = [
    { id: 'trigger_phrases', score01: breakdown.triggerPhrases / 20, score100: breakdown.triggerPhrases, maxScore100: 20, passed: triggerPhrases.length > 0 },
    { id: 'key_topics', score01: breakdown.keyTopics / 15, score100: breakdown.keyTopics, maxScore100: 15, passed: keyTopics.length > 0 },
    { id: 'file_descriptions', score01: breakdown.fileDescriptions / 20, score100: breakdown.fileDescriptions, maxScore100: 20, passed: files.length === 0 || breakdown.fileDescriptions / 20 >= 0.5 },
    { id: 'content_length', score01: breakdown.contentLength / 15, score100: breakdown.contentLength, maxScore100: 15, passed: contentLines >= 20 },
    { id: 'html_safety', score01: breakdown.noLeakedTags / 15, score100: breakdown.noLeakedTags, maxScore100: 15, passed: realLeakedTags <= 0 },
    { id: 'observation_dedup', score01: breakdown.observationDedup / 15, score100: breakdown.observationDedup, maxScore100: 15, passed: observations.length > 0 },
    { id: 'contamination', score01: hadContamination ? (effectiveSeverity === 'low' ? 0.95 : effectiveSeverity === 'medium' ? 0.85 : 0.60) : 1, score100: hadContamination ? (effectiveSeverity === 'low' ? 95 : effectiveSeverity === 'medium' ? 85 : 60) : 100, maxScore100: 100, passed: !hadContamination },
  ];

  return {
    score: score100,
    score01,
    score100,
    qualityScore: score01,
    warnings,
    qualityFlags: [...qualityFlags],
    hadContamination,
    dimensions,
    breakdown,
    insufficiency: sufficiencyResult ? {
      pass: sufficiencyResult.pass,
      score01: clamp01(sufficiencyResult.score),
      reasons: [...sufficiencyResult.reasons],
    } : null,
  };
}
