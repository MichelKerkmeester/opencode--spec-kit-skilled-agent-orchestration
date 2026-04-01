// ───────────────────────────────────────────────────────────────
// MODULE: Session Boost
// ───────────────────────────────────────────────────────────────
// Feature catalog: Tool-result extraction to working memory
import type Database from 'better-sqlite3';
import { isSessionBoostEnabled } from './search-flags.js';

const SESSION_BOOST_MULTIPLIER = 0.15;
const MAX_COMBINED_BOOST = 0.20;

let db: Database.Database | null = null;

interface RankedSearchResult extends Record<string, unknown> {
  id: number;
  score?: number;
  rrfScore?: number;
  similarity?: number;
}

interface SessionBoostMetadata {
  enabled: boolean;
  applied: boolean;
  sessionId: string | null;
  boostedCount: number;
  maxBoostApplied: number;
}

/**
 * Check whether session boost is enabled.
 * Default: ON (graduated). Set SPECKIT_SESSION_BOOST=false to disable.
 * When enabled, session attention scores from working_memory are used
 * to boost results that the user recently interacted with.
 *
 * Delegates to the canonical flag check in search-flags.ts.
 */
function isEnabled(_sessionId?: string | null): boolean {
  return isSessionBoostEnabled();
}

function init(database: Database.Database): void {
  db = database;
}

function normalizeSessionId(sessionId: string | null | undefined): string | null {
  if (typeof sessionId !== 'string') return null;
  const trimmed = sessionId.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeMemoryIds(memoryIds: number[]): number[] {
  if (!Array.isArray(memoryIds) || memoryIds.length === 0) {
    return [];
  }

  const unique = new Set<number>();
  for (const memoryId of memoryIds) {
    if (typeof memoryId === 'number' && Number.isFinite(memoryId)) {
      unique.add(Math.trunc(memoryId));
    }
  }

  return Array.from(unique);
}

function capCombinedBoost(sessionBoost: number, causalBoost: number = 0): number {
  const boundedSession = Math.max(0, sessionBoost);
  const boundedCausal = Math.max(0, causalBoost);
  const available = Math.max(0, MAX_COMBINED_BOOST - boundedCausal);
  return Math.min(available, boundedSession);
}

function calculateSessionBoost(attentionScore: number, causalBoost: number = 0): number {
  if (!Number.isFinite(attentionScore) || attentionScore <= 0) {
    return 0;
  }

  const rawBoost = attentionScore * SESSION_BOOST_MULTIPLIER;
  return capCombinedBoost(rawBoost, causalBoost);
}

function getAttentionBoost(sessionId: string | null | undefined, memoryIds: number[]): Map<number, number> {
  const boosts = new Map<number, number>();
  if (!isEnabled(sessionId) || !db) {
    return boosts;
  }

  const normalizedSessionId = normalizeSessionId(sessionId);
  const normalizedMemoryIds = normalizeMemoryIds(memoryIds);
  if (!normalizedSessionId || normalizedMemoryIds.length === 0) {
    return boosts;
  }

  try {
    const placeholders = normalizedMemoryIds.map(() => '?').join(', ');
    const rows = (db.prepare(`
      SELECT memory_id, attention_score
      FROM working_memory
      WHERE session_id = ?
        AND memory_id IN (${placeholders})
    `) as Database.Statement).all(normalizedSessionId, ...normalizedMemoryIds) as Array<{
      memory_id: number;
      attention_score: number;
    }>;

    for (const row of rows) {
      const boost = calculateSessionBoost(row.attention_score);
      if (boost > 0) {
        boosts.set(row.memory_id, boost);
      }
    }

    return boosts;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[session-boost] getAttentionBoost failed: ${message}`);
    return boosts;
  }
}

function resolveBaseScore(result: RankedSearchResult): number {
  if (typeof result.score === 'number' && Number.isFinite(result.score)) {
    return result.score;
  }
  if (typeof result.rrfScore === 'number' && Number.isFinite(result.rrfScore)) {
    return result.rrfScore;
  }
  if (typeof result.similarity === 'number' && Number.isFinite(result.similarity)) {
    return result.similarity / 100;
  }
  return 0;
}

function clampScore(score: number): number {
  return Math.min(1, Math.max(0, score));
}

function applySessionBoost(
  results: RankedSearchResult[],
  sessionId: string | null | undefined
): { results: RankedSearchResult[]; metadata: SessionBoostMetadata } {
  const normalizedSessionId = normalizeSessionId(sessionId);
  const metadata: SessionBoostMetadata = {
    enabled: isEnabled(normalizedSessionId),
    applied: false,
    sessionId: normalizedSessionId,
    boostedCount: 0,
    maxBoostApplied: 0,
  };

  if (!metadata.enabled || !normalizedSessionId || !Array.isArray(results) || results.length === 0) {
    return { results, metadata };
  }

  const memoryIds = results.map(result => result.id);
  const boosts = getAttentionBoost(normalizedSessionId, memoryIds);
  if (boosts.size === 0) {
    return { results, metadata };
  }

  const boostedResults = results
    .map((result, index) => {
      const boost = boosts.get(result.id) ?? 0;
      if (boost <= 0) {
        return { result, index, finalScore: resolveBaseScore(result), appliedBoost: 0 };
      }

      const baseScore = resolveBaseScore(result);
      const finalScore = clampScore(baseScore * (1 + boost));
      return {
        index,
        result: {
          ...result,
          score: finalScore,
          rrfScore: finalScore,
          intentAdjustedScore: finalScore,
          // M11 FIX: Preserve original attentionScore (working-memory signal),
          // store boosted ranking score separately
          attentionScore: result.attentionScore ?? finalScore,
          sessionBoostScore: finalScore,
          sessionBoost: boost,
          baseScore,
        },
        finalScore,
        appliedBoost: boost,
      };
    })
    .sort((left, right) => {
      if (right.finalScore === left.finalScore) {
        return left.index - right.index;
      }
      return right.finalScore - left.finalScore;
    })
    .map(item => item.result);

  let boostedCount = 0;
  let maxBoostApplied = 0;
  for (const boost of boosts.values()) {
    if (boost > 0) {
      boostedCount += 1;
      if (boost > maxBoostApplied) {
        maxBoostApplied = boost;
      }
    }
  }

  metadata.applied = boostedCount > 0;
  metadata.boostedCount = boostedCount;
  metadata.maxBoostApplied = maxBoostApplied;

  return { results: boostedResults, metadata };
}

export {
  SESSION_BOOST_MULTIPLIER,
  MAX_COMBINED_BOOST,
  init,
  isEnabled,
  capCombinedBoost,
  calculateSessionBoost,
  getAttentionBoost,
  applySessionBoost,
};

/**
 * Session boost types exposed for search pipeline consumers.
 */
export type {
  RankedSearchResult,
  SessionBoostMetadata,
};
