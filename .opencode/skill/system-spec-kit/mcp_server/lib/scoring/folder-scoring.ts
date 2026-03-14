// ───────────────────────────────────────────────────────────────
// MODULE: Folder Scoring
// ───────────────────────────────────────────────────────────────
// Feature catalog: Folder-level relevance scoring
// SCORING: FOLDER SCORING BARREL
export {
  type FolderMemoryInput,
  ARCHIVE_PATTERNS,
  TIER_WEIGHTS,
  SCORE_WEIGHTS,
  DECAY_RATE,
  TIER_ORDER,
  isArchived,
  getArchiveMultiplier,
  computeRecencyScore,
  simplifyFolderPath,
  computeSingleFolderScore,
  findTopTier,
  findLastActivity,
  computeFolderScores,
} from '@spec-kit/shared/scoring/folder-scoring';
