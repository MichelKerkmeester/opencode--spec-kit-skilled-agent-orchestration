// ───────────────────────────────────────────────────────────────
// MODULE: Attention Decay
// ───────────────────────────────────────────────────────────────
// Feature catalog: Classification-based decay
// DECAY STRATEGY (ADR-004): This module is the FACADE for all long-term
// Memory decay. It exposes FSRS-based decay as the canonical path
// (via composite-scoring.ts and fsrs-scheduler.ts).
// Legacy exponential functions (calculateDecayedScore, applyDecay) were
// Removed from the runtime API after callers migrated to applyFsrsDecay.
// Or calculateCompositeAttention.
//
// Decay ownership map:
// Long-term memory scoring → FSRS v4 (fsrs-scheduler.ts)
// Composite attention      → 5-factor model (composite-scoring.ts) using FSRS temporal
// Session/working memory   → Linear decay (working-memory.ts) — separate domain
// Search-time ranking      → FSRS-preferred SQL (vector-index-impl.js)
// External packages
import type Database from 'better-sqlite3';

/* --- 1. DEPENDENCIES --- */

// Internal modules
import * as fsrsScheduler from './fsrs-scheduler.js';
import type { ReviewResult } from './fsrs-scheduler.js';
import {
  calculateFiveFactorScore,
  calculateTemporalScore,
  calculateUsageScore,
  calculateImportanceScore,
  calculatePatternScore,
  calculateCitationScore,
  FIVE_FACTOR_WEIGHTS,
} from '../scoring/composite-scoring.js';
import type { FiveFactorWeights } from '../scoring/composite-scoring.js';

/* --- 2. CONFIGURATION --- */

interface DecayRateByTier {
  constitutional: number;
  critical: number;
  important: number;
  normal: number;
  temporary: number;
  deprecated: number;
  [key: string]: number;
}

interface DecayConfigType {
  defaultDecayRate: number;
  decayRateByTier: DecayRateByTier;
  minScoreThreshold: number;
}

// ADR-061: Decay rates aligned with importance-tiers.js (1.0 = no decay)
const DECAY_CONFIG: DecayConfigType = {
  defaultDecayRate: 0.80,
  decayRateByTier: {
    constitutional: 1.0,
    critical: 1.0,
    important: 1.0,
    normal: 0.80,
    temporary: 0.60,
    deprecated: 1.0,
  },
  minScoreThreshold: 0.001,
};

/* --- 3. STATE --- */

let db: Database.Database | null = null;

/* --- 4. INITIALIZATION --- */

function init(database: Database.Database): void {
  if (!database) {
    throw new Error('[attention-decay] Database reference is required');
  }
  db = database;
}

function getDb(): Database.Database | null {
  return db;
}

/* --- 5. DECAY RATE FUNCTIONS --- */

function getDecayRate(importanceTier: string | null | undefined): number {
  if (!importanceTier || typeof importanceTier !== 'string') {
    return DECAY_CONFIG.defaultDecayRate;
  }

  const rate = DECAY_CONFIG.decayRateByTier[importanceTier];
  return rate !== undefined ? rate : DECAY_CONFIG.defaultDecayRate;
}

// calculateDecayedScore was removed; use calculateRetrievabilityDecay or applyFsrsDecay.

/**
 * Calculate retrievability-based decay using FSRS formula.
 */
function calculateRetrievabilityDecay(stability: number, elapsedDays: number): number {
  if (typeof fsrsScheduler.calculateRetrievability === 'function') {
    return fsrsScheduler.calculateRetrievability(stability, elapsedDays);
  }
  // Inline fallback uses canonical constants from fsrs-scheduler.ts
  if (stability <= 0 || elapsedDays < 0) return 0;
  return Math.pow(1 + fsrsScheduler.FSRS_FACTOR * (elapsedDays / stability), fsrsScheduler.FSRS_DECAY);
}

// applyDecay was removed; use applyFsrsDecay.

/**
 * Apply FSRS-based decay to a memory.
 */
function applyFsrsDecay(
  memory: Record<string, unknown>,
  baseScore: number = 1.0
): number {
  const stability = (memory.stability as number) || 1.0;
  const lastReview = (memory.last_review || memory.created_at) as string | undefined;

  if (!lastReview) return baseScore;

  const parsedTime = new Date(lastReview).getTime();
  if (!Number.isFinite(parsedTime)) return baseScore;

  const elapsedMs = Date.now() - parsedTime;
  const elapsedDays = Math.max(0, elapsedMs / (1000 * 60 * 60 * 24));

  const retrievability = calculateRetrievabilityDecay(stability, elapsedDays);
  return baseScore * retrievability;
}

/**
 * Activate a memory (boost its decay score via access recording).
 */
function activateMemory(memoryId: number): boolean {
  if (!db) {
    console.warn('[attention-decay] Database not initialized. Server may still be starting up.');
    return false;
  }

  try {
    const result = (db.prepare(`
      UPDATE memory_index
      SET access_count = access_count + 1,
          last_accessed = ?,
          updated_at = datetime('now')
      WHERE id = ?
    `) as Database.Statement).run(Date.now(), memoryId);
    return (result as { changes: number }).changes > 0;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[attention-decay] activateMemory error: ${msg}`);
    return false;
  }
}

/**
 * Activate memory with FSRS review update.
 */
function activateMemoryWithFsrs(memoryId: number, grade: number = 3): boolean {
  if (!db) return false;

  try {
    const memory = (db.prepare('SELECT stability, difficulty, last_review, review_count FROM memory_index WHERE id = ?') as Database.Statement).get(memoryId) as Record<string, unknown> | undefined;
    if (!memory) return false;

    const params = {
      stability: (memory.stability as number) || 1.0,
      difficulty: (memory.difficulty as number) || 5.0,
      lastReview: (memory.last_review as string) || null,
      reviewCount: (memory.review_count as number) || 0,
    };

    let result: ReviewResult;
    if (typeof fsrsScheduler.processReview === 'function') {
      result = fsrsScheduler.processReview(params, grade);
    } else {
      // Basic update if FSRS not available
      result = {
        stability: params.stability * 1.1,
        difficulty: params.difficulty,
        lastReview: new Date().toISOString(),
        reviewCount: params.reviewCount + 1,
        nextReviewDate: new Date().toISOString(),
        retrievability: 1.0,
      };
    }

    (db.prepare(`
      UPDATE memory_index
      SET stability = ?,
          difficulty = ?,
          last_review = ?,
          review_count = ?,
          access_count = access_count + 1,
          last_accessed = ?
      WHERE id = ?
    `) as Database.Statement).run(
      result.stability,
      result.difficulty,
      result.lastReview,
      result.reviewCount,
      Date.now(),
      memoryId
    );

    return true;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[attention-decay] activateMemoryWithFsrs error: ${msg}`);
    return false;
  }
}

/* --- 6. COMPOSITE ATTENTION SCORING --- */

interface AttentionBreakdown {
  temporal: number;
  usage: number;
  importance: number;
  pattern: number;
  citation: number;
  composite: number;
  weights: FiveFactorWeights;
}

/**
 * Calculate composite attention score using 5-factor model.
 */
function calculateCompositeAttention(
  memory: Record<string, unknown>,
  options: { weights?: Record<string, number> } = {}
): number {
  return calculateFiveFactorScore(memory, options) as number;
}

/**
 * Get detailed attention breakdown for a memory.
 */
function getAttentionBreakdown(memory: Record<string, unknown>): AttentionBreakdown {
  const temporal = calculateTemporalScore(memory) as number;
  const usage = calculateUsageScore((memory.access_count as number) || 0) as number;
  const importance = calculateImportanceScore(
    String(memory.importance_tier || memory.importanceTier || 'normal'),
    memory.importance_weight as number | undefined
  ) as number;
  const pattern = calculatePatternScore(memory) as number;
  const citation = calculateCitationScore(memory) as number;

  const weights = FIVE_FACTOR_WEIGHTS || {
    temporal: 0.25,
    usage: 0.20,
    importance: 0.25,
    pattern: 0.15,
    citation: 0.15,
  };

  const composite = (
    temporal * (weights.temporal || 0.25) +
    usage * (weights.usage || 0.20) +
    importance * (weights.importance || 0.25) +
    pattern * (weights.pattern || 0.15) +
    citation * (weights.citation || 0.15)
  );

  return {
    temporal,
    usage,
    importance,
    pattern,
    citation,
    composite: Math.round(composite * 1000) / 1000,
    weights: weights,
  };
}

/**
 * Apply composite decay to a list of memories and return sorted by score.
 */
function applyCompositeDecay(
  memories: Array<Record<string, unknown>>
): Array<Record<string, unknown> & { attentionScore: number }> {
  return memories
    .map(m => ({
      ...m,
      attentionScore: calculateCompositeAttention(m),
    }))
    .sort((a, b) => b.attentionScore - a.attentionScore);
}

/**
 * Get active memories sorted by attention score.
 */
function getActiveMemories(
  limit: number = 20
): Array<Record<string, unknown>> {
  if (!db) {
    console.warn('[attention-decay] Database not initialized. Server may still be starting up.');
    return [];
  }

  try {
    const rows = (db.prepare(`
      SELECT * FROM memory_index
      WHERE embedding_status = 'success'
        AND (importance_tier IS NULL OR importance_tier NOT IN ('deprecated'))
      ORDER BY last_accessed DESC, importance_weight DESC
      LIMIT ?
    `) as Database.Statement).all(limit) as Array<Record<string, unknown>>;

    return applyCompositeDecay(rows);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[attention-decay] getActiveMemories error: ${msg}`);
    return [];
  }
}

/**
 * Clear session state.
 */
function clearSession(): void {
  db = null;
}

/* --- 7. EXPORTS --- */

export {
  // Configuration
  DECAY_CONFIG,

  // Initialization
  init,
  getDb,

  // Decay rate functions
  getDecayRate,
  calculateRetrievabilityDecay,
  applyFsrsDecay,

  // Activation
  activateMemory,
  activateMemoryWithFsrs,

  // Composite attention
  calculateCompositeAttention,
  getAttentionBreakdown,
  applyCompositeDecay,
  getActiveMemories,

  // Session
  clearSession,
};

export type {
  DecayConfigType,
  DecayRateByTier,
  AttentionBreakdown,
};
