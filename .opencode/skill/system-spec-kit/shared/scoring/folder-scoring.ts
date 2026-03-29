// ---------------------------------------------------------------
// MODULE: Folder Scoring
// ---------------------------------------------------------------
// Canonical location (moved from mcp_server/lib/scoring/folder-scoring.js)

import type {
  ArchivePattern,
  FolderScore,
  FolderScoreOptions,
  Memory,
  ScoreWeights,
  TierWeights,
} from '../types.js';

// Feature catalog: Folder-level relevance scoring


/**
 * Loose input type for folder-scoring functions.
 * Accepts any partial Memory (camelCase) plus arbitrary extra fields
 * (snake_case DB columns, search-enriched properties, etc.).
 */
export type FolderMemoryInput = Partial<Memory> & Record<string, unknown>;

// ---------------------------------------------------------------
// 1. CONSTANTS
// ---------------------------------------------------------------

/**
 * Archive detection patterns (Decision D2)
 * Folders matching these are deprioritized in rankings
 */
export const ARCHIVE_PATTERNS: readonly RegExp[] = [
  /z_archive\//i,
  /\/scratch\//i,
  /\/research\/iterations\//i,
  /\/review\/iterations\//i,
  /\/test-/i,
  /-test\//i,
  /\/prototype\//i,
];

/**
 * Importance tier weights (Decision D7)
 * Aligned with importance-tiers.js authoritative values
 */
export const TIER_WEIGHTS: TierWeights = {
  constitutional: 1.0,
  critical: 1.0,
  important: 0.8,
  normal: 0.5,
  temporary: 0.3,
  deprecated: 0.1,
};

/**
 * Composite score weights for folders (Decision D1)
 * Recency is highest because primary use case is "resume recent work"
 */
export const SCORE_WEIGHTS: ScoreWeights = {
  recency: 0.40,
  importance: 0.30,
  activity: 0.20,
  validation: 0.10,
};

/**
 * Decay rate for recency scoring (Decision D4)
 * 0.10 = 50% score at 10 days, 59% at 7 days
 */
export const DECAY_RATE: number = 0.10;

/**
 * Maximum memories counted for activity score
 * Activity score = min(1, memory_count / MAX_ACTIVITY_MEMORIES)
 */
const MAX_ACTIVITY_MEMORIES: number = 5;

/**
 * Default validation score (placeholder until real user feedback tracking)
 */
const DEFAULT_VALIDATION_SCORE: number = 0.5;

/**
 * Tier priority order (highest to lowest)
 */
export const TIER_ORDER: readonly string[] = ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'];

/**
 * Archive pattern to multiplier mapping (Decision D2)
 * Consolidates pattern matching to eliminate duplication
 */
const ARCHIVE_MULTIPLIERS: readonly ArchivePattern[] = [
  { pattern: /z_archive\//i, multiplier: 0.1, type: 'archive' },
  { pattern: /\/scratch\//i, multiplier: 0.2, type: 'scratch' },
  { pattern: /\/research\/iterations\//i, multiplier: 0.2, type: 'scratch' },
  { pattern: /\/review\/iterations\//i, multiplier: 0.2, type: 'scratch' },
  { pattern: /\/test-/i, multiplier: 0.2, type: 'test' },
  { pattern: /-test\//i, multiplier: 0.2, type: 'test' },
  { pattern: /\/prototype\//i, multiplier: 0.2, type: 'prototype' },
];

// ---------------------------------------------------------------
// 2. ARCHIVE DETECTION
// ---------------------------------------------------------------

/**
 * Check if a folder path matches archive patterns
 * Uses ARCHIVE_MULTIPLIERS for centralized pattern management
 */
export function isArchived(folderPath: string): boolean {
  if (!folderPath) return false;
  return ARCHIVE_MULTIPLIERS.some(({ pattern }) => pattern.test(folderPath));
}

/**
 * Get the score multiplier for archived folders (Decision D2)
 * Uses ARCHIVE_MULTIPLIERS for centralized pattern-to-multiplier mapping
 */
export function getArchiveMultiplier(folderPath: string): number {
  if (!folderPath) return 1.0;
  const match = ARCHIVE_MULTIPLIERS.find(({ pattern }) => pattern.test(folderPath));
  return match ? match.multiplier : 1.0;
}

// ---------------------------------------------------------------
// 3. RECENCY SCORING
// ---------------------------------------------------------------

/**
 * Compute recency score with inverse decay (Decision D4, D8)
 * Constitutional tier is exempt from decay (always returns 1.0)
 *
 * Formula: score = 1 / (1 + days * decayRate)
 * At rate 0.10: 7 days = 0.59, 10 days = 0.50, 30 days = 0.25
 */
export function computeRecencyScore(timestamp: string, tier: string = 'normal', decayRate: number = DECAY_RATE): number {
  // Decision D8: Constitutional tier exempt from decay
  if (tier === 'constitutional') {
    return 1.0;
  }

  const now = Date.now();
  const updated = new Date(timestamp).getTime();

  // Handle invalid timestamps gracefully
  if (isNaN(updated)) {
    return 0.5;
  }

  const daysSince = (now - updated) / (1000 * 60 * 60 * 24);

  // Prevent negative days (future timestamps)
  if (daysSince < 0) {
    return 1.0;
  }

  return 1 / (1 + daysSince * decayRate);
}

// ---------------------------------------------------------------
// 4. PATH UTILITIES
// ---------------------------------------------------------------

/**
 * Simplify folder path for display
 * Extracts leaf folder name and marks archived folders
 */
export function simplifyFolderPath(fullPath: string): string {
  if (!fullPath) return 'unknown';

  const parts = fullPath.split('/');
  const leaf = parts[parts.length - 1] || parts[parts.length - 2] || 'unknown';

  return isArchived(fullPath) ? `${leaf} (archived)` : leaf;
}

// ---------------------------------------------------------------
// 5. FOLDER SCORING
// ---------------------------------------------------------------

interface SingleFolderScore {
  score: number;
  recencyScore: number;
  importanceScore: number;
  activityScore: number;
  validationScore: number;
}

/**
 * Compute composite score for a single folder (Decision D1)
 *
 * Formula: score = (recency*0.4 + importance*0.3 + activity*0.2 + validation*0.1) * archiveMultiplier
 */
export function computeSingleFolderScore(folderPath: string, folderMemories: FolderMemoryInput[]): SingleFolderScore {
  if (!folderMemories || folderMemories.length === 0) {
    return {
      score: 0,
      recencyScore: 0,
      importanceScore: 0,
      activityScore: 0,
      validationScore: DEFAULT_VALIDATION_SCORE,
    };
  }

  // Recency: best score from any memory in folder
  // AI-WHY: Math.max(...spread) causes RangeError on arrays >100K elements; reduce() is stack-safe.
  const recencyScore = folderMemories.reduce((max, m) => {
    const score = computeRecencyScore(
      (m.updatedAt || m.updated_at as string | undefined || m.createdAt || m.created_at as string | undefined || '') as string,
      (m.importanceTier || m.importance_tier as string | undefined || 'normal') as string
    );
    return score > max ? score : max;
  }, -Infinity);

  // Activity: capped at MAX_ACTIVITY_MEMORIES for max score
  const activityScore = Math.min(1, folderMemories.length / MAX_ACTIVITY_MEMORIES);

  // Importance: weighted average of tiers
  const importanceSum = folderMemories.reduce((sum: number, m: FolderMemoryInput) => {
    const tier = (m.importanceTier || m.importance_tier as string | undefined || 'normal') as string;
    return sum + (TIER_WEIGHTS[tier] ?? TIER_WEIGHTS.normal);
  }, 0);
  const importanceScore = importanceSum / folderMemories.length;

  // Validation: placeholder until real user feedback tracking (Step 3)
  const validationScore = DEFAULT_VALIDATION_SCORE;

  // Composite score
  const rawScore = (
    SCORE_WEIGHTS.recency * recencyScore +
    SCORE_WEIGHTS.importance * importanceScore +
    SCORE_WEIGHTS.activity * activityScore +
    SCORE_WEIGHTS.validation * validationScore
  );

  // Apply archive multiplier (Decision D2)
  const finalScore = rawScore * getArchiveMultiplier(folderPath);

  return {
    score: Math.round(finalScore * 1000) / 1000,
    recencyScore: Math.round(recencyScore * 1000) / 1000,
    importanceScore: Math.round(importanceScore * 1000) / 1000,
    activityScore: Math.round(activityScore * 1000) / 1000,
    validationScore: validationScore,
  };
}

/**
 * Find the highest importance tier among memories
 */
export function findTopTier(memories: FolderMemoryInput[]): string {
  if (!memories || memories.length === 0) return 'normal';

  const tiers = memories.map(m => (m.importanceTier || m.importance_tier as string | undefined || 'normal') as string);
  return TIER_ORDER.find(t => tiers.includes(t)) || 'normal';
}

/**
 * Find the most recent activity timestamp among memories
 */
export function findLastActivity(memories: FolderMemoryInput[]): string {
  if (!memories || memories.length === 0) {
    return new Date().toISOString();
  }

  const timestamps = memories.map(m => {
    const ts = m.updatedAt || m.updated_at as string | undefined || m.createdAt || m.created_at as string | undefined;
    return new Date(ts || '').getTime();
  }).filter(t => !isNaN(t));

  if (timestamps.length === 0) {
    return new Date().toISOString();
  }

  // AI-WHY: Math.max(...spread) causes RangeError on arrays >100K elements; reduce() is stack-safe.
  const maxTimestamp = timestamps.reduce((a, b) => a > b ? a : b, -Infinity);
  return new Date(maxTimestamp).toISOString();
}

// ---------------------------------------------------------------
// 6. MAIN COMPUTATION
// ---------------------------------------------------------------

/**
 * Compute scores for all folders from a set of memories
 */
export function computeFolderScores(memories: FolderMemoryInput[], options: FolderScoreOptions = {}): FolderScore[] {
  const {
    excludePatterns = [],
    includeArchived = false,
    limit,
  } = options;

  if (!memories || !Array.isArray(memories) || memories.length === 0) {
    return [];
  }

  // Build additional exclude patterns with error logging
  const extraPatterns: RegExp[] = excludePatterns
    .filter((p): p is string => typeof p === 'string')
    .map(p => {
      try {
        return new RegExp(p, 'i');
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`[folder-scoring] Invalid exclude pattern '${p}': ${message}`);
        return null;
      }
    })
    .filter((p): p is RegExp => p !== null);

  // Group memories by folder
  const folderMap = new Map<string, FolderMemoryInput[]>();
  for (const memory of memories) {
    const folder = (memory.specFolder || memory.spec_folder as string | undefined || 'unknown') as string;
    if (!folderMap.has(folder)) {
      folderMap.set(folder, []);
    }
    folderMap.get(folder)!.push(memory);
  }

  // Compute scores for each folder
  const folderScores: FolderScore[] = [];
  for (const [folder, folderMemories] of folderMap) {
    const isArchivedFolder = isArchived(folder);

    // Skip archived unless includeArchived is true
    if (isArchivedFolder && !includeArchived) continue;

    // Skip if matches extra exclude patterns
    const excludedByExtra = extraPatterns.some(p => p.test(folder));
    if (excludedByExtra) continue;

    const scores = computeSingleFolderScore(folder, folderMemories);
    const topTier = findTopTier(folderMemories);
    const lastActivity = findLastActivity(folderMemories);

    folderScores.push({
      folder,
      simplified: simplifyFolderPath(folder),
      count: folderMemories.length,
      score: scores.score,
      recencyScore: scores.recencyScore,
      importanceScore: scores.importanceScore,
      activityScore: scores.activityScore,
      validationScore: scores.validationScore,
      lastActivity: lastActivity,
      isArchived: isArchivedFolder,
      topTier: topTier,
    });
  }

  // Sort by score descending
  folderScores.sort((a, b) => b.score - a.score);

  // Apply limit if specified
  if (typeof limit === 'number' && limit > 0) {
    return folderScores.slice(0, limit);
  }

  return folderScores;
}
