// ───────────────────────────────────────────────────────────────
// 1. TEST — INTERFERENCE SCORING
// ───────────────────────────────────────────────────────────────
// Tests for interference score computation and penalty application.
// Covers: zero interference, penalty reduces score, score floor at 0,
// Env var gating, batch computation, text similarity heuristic,
// And integration with composite scoring.

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Database from 'better-sqlite3';
import {
  computeInterferenceScore,
  computeInterferenceScoresBatch,
  computeTextSimilarity,
  applyInterferencePenalty,
  INTERFERENCE_SIMILARITY_THRESHOLD,
  INTERFERENCE_PENALTY_COEFFICIENT,
} from '../lib/scoring/interference-scoring';
import {
  calculateFiveFactorScore,
  calculateCompositeScore,
} from '../lib/scoring/composite-scoring';
import type { ScoringInput } from '../lib/scoring/composite-scoring';

// Helpers
function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      trigger_phrases TEXT,
      file_path TEXT,
      spec_folder TEXT,
      importance_tier TEXT DEFAULT 'normal',
      importance_weight REAL DEFAULT 0.5,
      embedding_status TEXT DEFAULT 'complete',
      is_archived INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      parent_id INTEGER,
      interference_score REAL DEFAULT 0,
      access_count INTEGER DEFAULT 0,
      stability REAL DEFAULT 1.0,
      last_accessed TEXT,
      document_type TEXT DEFAULT 'memory'
    );
    CREATE TABLE active_memory_projection (
      logical_key TEXT PRIMARY KEY,
      root_memory_id INTEGER NOT NULL,
      active_memory_id INTEGER NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
  return db;
}

function insertMemory(
  db: Database.Database,
  opts: {
    title: string;
    triggerPhrases?: string;
    specFolder?: string;
    parentId?: number | null;
    importanceTier?: string;
    isArchived?: boolean;
    includeInProjection?: boolean;
  }
): number {
  const stmt = db.prepare(`
    INSERT INTO memory_index (title, trigger_phrases, spec_folder, parent_id, importance_tier, is_archived)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    opts.title,
    opts.triggerPhrases || '',
    opts.specFolder || 'specs/test-folder',
    opts.parentId ?? null,
    opts.importanceTier ?? 'normal',
    opts.isArchived ? 1 : 0,
  );
  const id = Number(result.lastInsertRowid);

  if ((opts.parentId ?? null) == null && opts.includeInProjection !== false) {
    db.prepare(`
      INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
      VALUES (?, ?, ?, datetime('now'))
    `).run(`logical-${id}`, id, id);
  }

  return id;
}

// 1. Text Similarity Heuristic
describe('Text Similarity Heuristic', () => {
  it('returns 0 for empty inputs', () => {
    expect(computeTextSimilarity('', '')).toBe(0);
    expect(computeTextSimilarity('hello world', '')).toBe(0);
    expect(computeTextSimilarity('', 'hello world')).toBe(0);
  });

  it('returns 1.0 for identical texts', () => {
    const text = 'authentication flow implementation';
    expect(computeTextSimilarity(text, text)).toBe(1.0);
  });

  it('returns high similarity for very similar texts', () => {
    const a = 'authentication flow login implementation';
    const b = 'authentication flow login setup';
    const sim = computeTextSimilarity(a, b);
    expect(sim).toBeGreaterThan(0.5);
  });

  it('returns low similarity for dissimilar texts', () => {
    const a = 'authentication flow login implementation';
    const b = 'database migration schema upgrade';
    const sim = computeTextSimilarity(a, b);
    expect(sim).toBeLessThan(0.3);
  });

  it('is case-insensitive', () => {
    const a = 'Authentication Flow';
    const b = 'authentication flow';
    expect(computeTextSimilarity(a, b)).toBe(1.0);
  });

  it('filters out short words (<=2 chars)', () => {
    // "a" and "to" are <=2 chars and should be filtered
    const a = 'a to the big implementation';
    const b = 'a to the big setup';
    // Only "the", "big", "implementation" vs "the", "big", "setup"
    const sim = computeTextSimilarity(a, b);
    expect(sim).toBeGreaterThan(0);
    expect(sim).toBeLessThan(1.0);
  });
});

// 2. Single Memory Interference Scoring
describe('computeInterferenceScore', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  afterEach(() => {
    db.close();
  });

  it('returns 0 for isolated memory (no siblings)', () => {
    const id = insertMemory(db, {
      title: 'unique authentication implementation',
      specFolder: 'specs/auth',
    });

    const score = computeInterferenceScore(db, id, 'specs/auth');
    expect(score).toBe(0);
  });

  it('returns 0 for memories with different content in same folder', () => {
    const id1 = insertMemory(db, {
      title: 'authentication flow login implementation',
      specFolder: 'specs/mixed',
    });
    insertMemory(db, {
      title: 'database migration schema upgrade version',
      specFolder: 'specs/mixed',
    });
    insertMemory(db, {
      title: 'frontend styling responsive design layout',
      specFolder: 'specs/mixed',
    });

    const score = computeInterferenceScore(db, id1, 'specs/mixed');
    expect(score).toBe(0);
  });

  it('counts similar memories in same folder', () => {
    // Use highly overlapping text to exceed 0.75 Jaccard threshold
    // With 10 shared words and 1 different word each:
    // Jaccard = 10/12 = 0.833 > 0.75
    const sharedTriggers = 'authentication, login, session, token, validation, handler, middleware, security, user, access';
    const id1 = insertMemory(db, {
      title: 'authentication login session token validation handler middleware security user access primary',
      triggerPhrases: sharedTriggers,
      specFolder: 'specs/auth',
    });
    insertMemory(db, {
      title: 'authentication login session token validation handler middleware security user access secondary',
      triggerPhrases: sharedTriggers,
      specFolder: 'specs/auth',
    });
    insertMemory(db, {
      title: 'authentication login session token validation handler middleware security user access tertiary',
      triggerPhrases: sharedTriggers,
      specFolder: 'specs/auth',
    });

    const score = computeInterferenceScore(db, id1, 'specs/auth');
    expect(score).toBeGreaterThanOrEqual(1);
  });

  it('does not count memories from different folders', () => {
    const id1 = insertMemory(db, {
      title: 'authentication flow login implementation details',
      triggerPhrases: 'auth, login, authentication',
      specFolder: 'specs/auth',
    });
    // Same content but different folder — should not count
    insertMemory(db, {
      title: 'authentication flow login implementation details',
      triggerPhrases: 'auth, login, authentication',
      specFolder: 'specs/other-folder',
    });

    const score = computeInterferenceScore(db, id1, 'specs/auth');
    expect(score).toBe(0);
  });

  it('does not count chunk children (parent_id IS NOT NULL)', () => {
    const parentId = insertMemory(db, {
      title: 'authentication flow login implementation details',
      triggerPhrases: 'auth, login, authentication',
      specFolder: 'specs/auth',
    });
    // This is a chunk child — should be excluded
    insertMemory(db, {
      title: 'authentication flow login implementation details chunk',
      triggerPhrases: 'auth, login, authentication',
      specFolder: 'specs/auth',
      parentId: parentId,
    });

    const score = computeInterferenceScore(db, parentId, 'specs/auth');
    expect(score).toBe(0);
  });

  it('ignores archived and deprecated siblings that are no longer retrievable', () => {
    const sharedTriggers = 'authentication, login, session, token, validation, handler, middleware, security, user, access';
    const id = insertMemory(db, {
      title: 'authentication login session token validation handler middleware security user access primary',
      triggerPhrases: sharedTriggers,
      specFolder: 'specs/auth',
    });
    insertMemory(db, {
      title: 'authentication login session token validation handler middleware security user access archived',
      triggerPhrases: sharedTriggers,
      specFolder: 'specs/auth',
      isArchived: true,
      includeInProjection: false,
    });
    insertMemory(db, {
      title: 'authentication login session token validation handler middleware security user access deprecated',
      triggerPhrases: sharedTriggers,
      specFolder: 'specs/auth',
      importanceTier: 'deprecated',
      includeInProjection: false,
    });

    const score = computeInterferenceScore(db, id, 'specs/auth');
    expect(score).toBe(0);
  });

  it('returns 0 for empty spec_folder', () => {
    const id = insertMemory(db, {
      title: 'test memory',
      specFolder: '',
    });

    const score = computeInterferenceScore(db, id, '');
    expect(score).toBe(0);
  });

  it('returns 0 for non-existent memory', () => {
    const score = computeInterferenceScore(db, 9999, 'specs/auth');
    expect(score).toBe(0);
  });

  it('respects custom threshold', () => {
    const id1 = insertMemory(db, {
      title: 'authentication flow login implementation details',
      triggerPhrases: 'auth, login',
      specFolder: 'specs/auth',
    });
    insertMemory(db, {
      title: 'authentication flow login setup configuration',
      triggerPhrases: 'auth, login',
      specFolder: 'specs/auth',
    });

    // Very high threshold should find no interference
    const strictScore = computeInterferenceScore(db, id1, 'specs/auth', 0.99);
    expect(strictScore).toBe(0);

    // Very low threshold should find interference
    const lenientScore = computeInterferenceScore(db, id1, 'specs/auth', 0.1);
    expect(lenientScore).toBeGreaterThanOrEqual(1);
  });
});

// 3. Batch Interference Scoring
describe('computeInterferenceScoresBatch', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  afterEach(() => {
    db.close();
  });

  it('returns empty map for empty input', () => {
    const result = computeInterferenceScoresBatch(db, []);
    expect(result.size).toBe(0);
  });

  it('returns 0 for isolated memories', () => {
    const id1 = insertMemory(db, {
      title: 'unique authentication implementation',
      specFolder: 'specs/auth',
    });
    const id2 = insertMemory(db, {
      title: 'database migration upgrade',
      specFolder: 'specs/db',
    });

    const result = computeInterferenceScoresBatch(db, [id1, id2]);
    expect(result.get(id1)).toBe(0);
    expect(result.get(id2)).toBe(0);
  });

  it('returns 0 for non-existent memory IDs', () => {
    const result = computeInterferenceScoresBatch(db, [9999, 8888]);
    expect(result.get(9999)).toBe(0);
    expect(result.get(8888)).toBe(0);
  });

  it('correctly computes interference for batch with similar memories', () => {
    const sharedTriggers = 'authentication, login, session, token, validation, handler, middleware, security, user, access';
    const id1 = insertMemory(db, {
      title: 'authentication login session token validation handler middleware security user access primary',
      triggerPhrases: sharedTriggers,
      specFolder: 'specs/auth',
    });
    const id2 = insertMemory(db, {
      title: 'authentication login session token validation handler middleware security user access secondary',
      triggerPhrases: sharedTriggers,
      specFolder: 'specs/auth',
    });
    const id3 = insertMemory(db, {
      title: 'database migration schema upgrade version',
      specFolder: 'specs/db',
    });

    const result = computeInterferenceScoresBatch(db, [id1, id2, id3]);
    // Id1 and id2 should have interference with each other
    expect(result.get(id1)).toBeGreaterThanOrEqual(1);
    expect(result.get(id2)).toBeGreaterThanOrEqual(1);
    // Id3 is alone in its folder
    expect(result.get(id3)).toBe(0);
  });

  it('skips archived and deprecated rows during batch scoring', () => {
    const sharedTriggers = 'authentication, login, session, token, validation, handler, middleware, security, user, access';
    const id1 = insertMemory(db, {
      title: 'authentication login session token validation handler middleware security user access primary',
      triggerPhrases: sharedTriggers,
      specFolder: 'specs/auth',
    });
    const id2 = insertMemory(db, {
      title: 'authentication login session token validation handler middleware security user access secondary',
      triggerPhrases: sharedTriggers,
      specFolder: 'specs/auth',
    });
    insertMemory(db, {
      title: 'authentication login session token validation handler middleware security user access archived',
      triggerPhrases: sharedTriggers,
      specFolder: 'specs/auth',
      isArchived: true,
      includeInProjection: false,
    });
    insertMemory(db, {
      title: 'authentication login session token validation handler middleware security user access deprecated',
      triggerPhrases: sharedTriggers,
      specFolder: 'specs/auth',
      importanceTier: 'deprecated',
      includeInProjection: false,
    });

    const result = computeInterferenceScoresBatch(db, [id1, id2]);
    expect(result.get(id1)).toBe(1);
    expect(result.get(id2)).toBe(1);
  });
});

// 4. Interference Penalty Application
describe('applyInterferencePenalty', () => {
  const originalEnv = process.env.SPECKIT_INTERFERENCE_SCORE;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.SPECKIT_INTERFERENCE_SCORE;
    } else {
      process.env.SPECKIT_INTERFERENCE_SCORE = originalEnv;
    }
  });

  it('applies penalty when env var is not set (graduated: default ON)', () => {
    delete process.env.SPECKIT_INTERFERENCE_SCORE;
    // Graduated flag: unset means enabled. 0.8 + (-0.08 * 5) = 0.4
    expect(applyInterferencePenalty(0.8, 5)).toBeCloseTo(0.4, 4);
  });

  it('returns score unchanged when env var is "false"', () => {
    process.env.SPECKIT_INTERFERENCE_SCORE = 'false';
    expect(applyInterferencePenalty(0.8, 5)).toBe(0.8);
  });

  it('applies penalty when env var is "true"', () => {
    process.env.SPECKIT_INTERFERENCE_SCORE = 'true';
    const result = applyInterferencePenalty(0.8, 1);
    // 0.8 + (-0.08 * 1) = 0.72
    expect(result).toBeCloseTo(0.72, 4);
  });

  it('applies larger penalty for higher interference', () => {
    process.env.SPECKIT_INTERFERENCE_SCORE = 'true';
    const result = applyInterferencePenalty(0.8, 5);
    // 0.8 + (-0.08 * 5) = 0.8 - 0.4 = 0.4
    expect(result).toBeCloseTo(0.4, 4);
  });

  it('never returns below 0', () => {
    process.env.SPECKIT_INTERFERENCE_SCORE = 'true';
    const result = applyInterferencePenalty(0.3, 10);
    // 0.3 + (-0.08 * 10) = 0.3 - 0.8 = -0.5 => clamped to 0
    expect(result).toBe(0);
  });

  it('returns score unchanged for zero interference', () => {
    process.env.SPECKIT_INTERFERENCE_SCORE = 'true';
    expect(applyInterferencePenalty(0.8, 0)).toBe(0.8);
  });

  it('returns score unchanged for negative interference (edge case)', () => {
    process.env.SPECKIT_INTERFERENCE_SCORE = 'true';
    expect(applyInterferencePenalty(0.8, -1)).toBe(0.8);
  });

  it('uses correct penalty coefficient of -0.08', () => {
    expect(INTERFERENCE_PENALTY_COEFFICIENT).toBe(-0.08);
  });

  it('uses correct similarity threshold of 0.75', () => {
    expect(INTERFERENCE_SIMILARITY_THRESHOLD).toBe(0.75);
  });
});

// 5. Composite Scoring Integration
describe('Composite Scoring Integration with Interference', () => {
  const originalEnv = process.env.SPECKIT_INTERFERENCE_SCORE;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.SPECKIT_INTERFERENCE_SCORE;
    } else {
      process.env.SPECKIT_INTERFERENCE_SCORE = originalEnv;
    }
  });

  it('5-factor score is unaffected when env var is off', () => {
    process.env.SPECKIT_INTERFERENCE_SCORE = 'false';
    const now = Date.now();
    const row: ScoringInput = {
      stability: 5.0,
      lastReview: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
      access_count: 10,
      importance_tier: 'normal',
      importance_weight: 0.5,
      similarity: 80,
      title: 'test',
      interference_score: 5, // high interference, but flag is off
    };

    const score = calculateFiveFactorScore(row, { query: 'test' });
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(1);

    // Score should be same as without interference_score
    const rowNoInterference = { ...row, interference_score: 0 };
    const scoreNoInterference = calculateFiveFactorScore(rowNoInterference, { query: 'test' });
    expect(score).toBeCloseTo(scoreNoInterference, 4);
  });

  it('5-factor score is reduced when env var is on and interference > 0', () => {
    process.env.SPECKIT_INTERFERENCE_SCORE = 'true';
    const now = Date.now();
    const baseRow: ScoringInput = {
      stability: 5.0,
      lastReview: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
      access_count: 10,
      importance_tier: 'normal',
      importance_weight: 0.5,
      similarity: 80,
      title: 'test',
    };

    const scoreNoInterference = calculateFiveFactorScore(
      { ...baseRow, interference_score: 0 },
      { query: 'test' }
    );
    const scoreWithInterference = calculateFiveFactorScore(
      { ...baseRow, interference_score: 3 },
      { query: 'test' }
    );

    expect(scoreWithInterference).toBeLessThan(scoreNoInterference);
  });

  it('legacy composite score is reduced when env var is on', () => {
    process.env.SPECKIT_INTERFERENCE_SCORE = 'true';
    const now = Date.now();
    const baseRow: ScoringInput = {
      similarity: 80,
      importance_weight: 0.5,
      importance_tier: 'normal',
      updated_at: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
      access_count: 10,
      stability: 5.0,
      lastReview: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
    };

    const scoreNoInterference = calculateCompositeScore(
      { ...baseRow, interference_score: 0 }
    );
    const scoreWithInterference = calculateCompositeScore(
      { ...baseRow, interference_score: 3 }
    );

    expect(scoreWithInterference).toBeLessThan(scoreNoInterference);
  });

  it('composite score never goes below 0 with high interference', () => {
    process.env.SPECKIT_INTERFERENCE_SCORE = 'true';
    const now = Date.now();
    const row: ScoringInput = {
      similarity: 20,
      importance_weight: 0.1,
      importance_tier: 'temporary',
      updated_at: new Date(now - 1000 * 60 * 60 * 24 * 60).toISOString(),
      access_count: 0,
      stability: 0.5,
      lastReview: new Date(now - 1000 * 60 * 60 * 24 * 60).toISOString(),
      interference_score: 20, // extreme interference
    };

    const score = calculateCompositeScore(row);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });
});
