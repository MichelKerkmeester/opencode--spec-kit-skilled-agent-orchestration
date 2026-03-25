// TEST: Save Quality Gate (TM-04)
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  isQualityGateEnabled,
  isWarnOnlyMode,
  setActivationTimestamp,
  resetActivationTimestamp,
  validateStructural,
  scoreTitleQuality,
  scoreTriggerQuality,
  scoreLengthQuality,
  scoreAnchorQuality,
  scoreMetadataQuality,
  scoreContentQuality,
  cosineSimilarity,
  checkSemanticDedup,
  runQualityGate,
  SIGNAL_DENSITY_THRESHOLD,
  SEMANTIC_DEDUP_THRESHOLD,
  MIN_CONTENT_LENGTH,
  WARN_ONLY_PERIOD_MS,
} from '../lib/validation/save-quality-gate';
import type { FindSimilarFn } from '../lib/validation/save-quality-gate';
import * as vectorIndex from '../lib/search/vector-index';

type VectorDb = NonNullable<ReturnType<typeof vectorIndex.getDb>>;

interface MockConfigDb {
  exec: ReturnType<typeof vi.fn>;
  prepare: ReturnType<typeof vi.fn>;
}

// ───────────────────────────────────────────────────────────────
// 1. TEST HELPERS
// ───────────────────────────────────────────────────────────────
/** Generate content of a specific length */
function makeContent(length: number): string {
  return 'x'.repeat(length);
}

/** Build well-formed YAML frontmatter content */
function makeContentWithFrontmatter(fields: Record<string, string>, body: string = ''): string {
  const yaml = Object.entries(fields)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
  return `---\n${yaml}\n---\n${body}`;
}

/** Create a simple embedding vector of given dimension */
function makeEmbedding(dim: number, fill: number = 1.0): number[] {
  return Array(dim).fill(fill);
}

/** Create a mock config-table DB with minimal SQL behavior needed by quality-gate persistence. */
function makeMockConfigDb(initial: Record<string, string> = {}): { db: MockConfigDb; store: Map<string, string> } {
  const store = new Map(Object.entries(initial));
  const db: MockConfigDb = {
    exec: vi.fn(),
    prepare: vi.fn((sql: string) => {
      if (sql === 'SELECT value FROM config WHERE key = ?') {
        return {
          get: (key: string) => {
            const value = store.get(key);
            return value === undefined ? undefined : { value };
          },
        };
      }

      if (sql === 'INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)') {
        return {
          run: (key: string, value: string) => {
            store.set(key, value);
            return { changes: 1 };
          },
        };
      }

      if (sql === 'DELETE FROM config WHERE key = ?') {
        return {
          run: (key: string) => {
            store.delete(key);
            return { changes: 1 };
          },
        };
      }

      throw new Error(`Unexpected SQL in save-quality-gate test mock: ${sql}`);
    }),
  };

  return { db, store };
}

/** Create a mock findSimilar function that returns preset results */
function asVectorDb(db: MockConfigDb): VectorDb {
  return db as unknown as VectorDb;
}

function mockFindSimilar(results: Array<{ id: number; file_path: string; similarity: number }>): FindSimilarFn {
  return (_embedding, _options) => results;
}

describe('Save Quality Gate (TM-04)', () => {

  /* ─────────────────────────────────────────────────────────────
     Feature Flag
  ──────────────────────────────────────────────────────────────── */

  describe('Feature Flag', () => {
    const originalEnv = process.env.SPECKIT_SAVE_QUALITY_GATE;

    afterEach(() => {
      if (originalEnv !== undefined) {
        process.env.SPECKIT_SAVE_QUALITY_GATE = originalEnv;
      } else {
        delete process.env.SPECKIT_SAVE_QUALITY_GATE;
      }
    });

    it('FF1: Gate is enabled by default (graduated — default ON)', () => {
      delete process.env.SPECKIT_SAVE_QUALITY_GATE;
      expect(isQualityGateEnabled()).toBe(true);
    });

    it('FF2: Gate is enabled when env var is "true"', () => {
      process.env.SPECKIT_SAVE_QUALITY_GATE = 'true';
      expect(isQualityGateEnabled()).toBe(true);
    });

    it('FF3: Gate is enabled case-insensitively', () => {
      process.env.SPECKIT_SAVE_QUALITY_GATE = 'TRUE';
      expect(isQualityGateEnabled()).toBe(true);
    });

    it('FF4: Gate is disabled for "false"', () => {
      process.env.SPECKIT_SAVE_QUALITY_GATE = 'false';
      expect(isQualityGateEnabled()).toBe(false);
    });

    it('FF5: Gate is disabled for "0"', () => {
      process.env.SPECKIT_SAVE_QUALITY_GATE = '0';
      expect(isQualityGateEnabled()).toBe(false);
    });

    it('FF6: Gate OFF means passthrough result', () => {
      process.env.SPECKIT_SAVE_QUALITY_GATE = 'false';
      const result = runQualityGate({
        title: null,
        content: '',
        specFolder: '',
      });
      expect(result.pass).toBe(true);
      expect(result.gateEnabled).toBe(false);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     Warn-Only Mode (MR12)
  ──────────────────────────────────────────────────────────────── */

  describe('Warn-Only Mode (MR12)', () => {
    const originalEnv = process.env.SPECKIT_SAVE_QUALITY_GATE;

    beforeEach(() => {
      resetActivationTimestamp();
      process.env.SPECKIT_SAVE_QUALITY_GATE = 'true';
    });

    afterEach(() => {
      resetActivationTimestamp();
      if (originalEnv !== undefined) {
        process.env.SPECKIT_SAVE_QUALITY_GATE = originalEnv;
      } else {
        delete process.env.SPECKIT_SAVE_QUALITY_GATE;
      }
    });

    it('WO1: No warn-only when timestamp is not set', () => {
      expect(isWarnOnlyMode()).toBe(false);
    });

    it('WO2: Warn-only mode active within 14 days of activation', () => {
      setActivationTimestamp(Date.now() - 1000); // 1 second ago
      expect(isWarnOnlyMode()).toBe(true);
    });

    it('WO3: Warn-only mode inactive after 14 days', () => {
      const fifteenDaysAgo = Date.now() - (15 * 24 * 60 * 60 * 1000);
      setActivationTimestamp(fifteenDaysAgo);
      expect(isWarnOnlyMode()).toBe(false);
    });

    it('WO4: Would-reject logged but save allowed in warn-only mode', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      setActivationTimestamp(Date.now()); // Just activated

      const result = runQualityGate({
        title: null, // Will fail structural
        content: 'x', // Too short
        specFolder: 'test-spec',
      });

      expect(result.pass).toBe(true); // Allowed through
      expect(result.warnOnly).toBe(true);
      expect(result.wouldReject).toBe(true);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[QUALITY-GATE] warn-only')
      );

      warnSpy.mockRestore();
    });

    it('WO5: WARN_ONLY_PERIOD_MS is 14 days', () => {
      expect(WARN_ONLY_PERIOD_MS).toBe(14 * 24 * 60 * 60 * 1000);
    });

    it('WO6: Config-table ensure reruns when DB handle changes', () => {
      const getDbSpy = vi.spyOn(vectorIndex, 'getDb');

      const dbA = makeMockConfigDb();
      const dbB = makeMockConfigDb();

      getDbSpy
        .mockReturnValueOnce(asVectorDb(dbA.db))
        .mockReturnValueOnce(asVectorDb(dbB.db));

      setActivationTimestamp(Date.now() - 2000);
      setActivationTimestamp(Date.now() - 1000);

      expect(dbA.db.exec).toHaveBeenCalledTimes(1);
      expect(dbB.db.exec).toHaveBeenCalledTimes(1);
      expect(dbA.store.get('quality_gate_activated_at')).toBeDefined();
      expect(dbB.store.get('quality_gate_activated_at')).toBeDefined();

      getDbSpy.mockRestore();
    });

    it('WO7: runQualityGate does not reset persisted activation window on restart', () => {
      const fifteenDaysAgo = Date.now() - (15 * 24 * 60 * 60 * 1000);
      const persistedDb = makeMockConfigDb({
        quality_gate_activated_at: String(fifteenDaysAgo),
      });
      const getDbSpy = vi.spyOn(vectorIndex, 'getDb').mockReturnValue(asVectorDb(persistedDb.db));

      const result = runQualityGate({
        title: null,
        content: makeContent(10),
        specFolder: '003-memory',
      });

      // Persisted timestamp is older than 14 days, so gate should enforce (not warn-only).
      expect(result.warnOnly).toBe(false);
      expect(result.pass).toBe(false);

      // No reset write should occur when persisted activation already exists.
      const insertCalls = persistedDb.db.prepare.mock.calls
        .filter((call) => call[0] === 'INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)');
      expect(insertCalls.length).toBe(0);

      getDbSpy.mockRestore();
    });
  });

  /* ─────────────────────────────────────────────────────────────
     Layer 1: Structural Validation
  ──────────────────────────────────────────────────────────────── */

  describe('Layer 1: Structural Validation', () => {
    it('L1-1: Valid memory passes structural validation', () => {
      const result = validateStructural({
        title: 'A descriptive title for the memory',
        content: makeContent(100),
        specFolder: '003-memory',
      });
      expect(result.pass).toBe(true);
      expect(result.reasons).toHaveLength(0);
    });

    it('L1-2: Missing title fails', () => {
      const result = validateStructural({
        title: null,
        content: makeContent(100),
        specFolder: '003-memory',
      });
      expect(result.pass).toBe(false);
      expect(result.reasons).toContain('Title is missing or empty');
    });

    it('L1-3: Empty title fails', () => {
      const result = validateStructural({
        title: '   ',
        content: makeContent(100),
        specFolder: '003-memory',
      });
      expect(result.pass).toBe(false);
      expect(result.reasons.some(r => r.includes('Title'))).toBe(true);
    });

    it('L1-4: Empty content fails', () => {
      const result = validateStructural({
        title: 'A title',
        content: '',
        specFolder: '003-memory',
      });
      expect(result.pass).toBe(false);
      expect(result.reasons.some(r => r.includes('Content'))).toBe(true);
    });

    it('L1-5: Content below minimum length fails', () => {
      const result = validateStructural({
        title: 'A title',
        content: makeContent(30), // Below MIN_CONTENT_LENGTH (50)
        specFolder: '003-memory',
      });
      expect(result.pass).toBe(false);
      expect(result.reasons.some(r => r.includes('too short'))).toBe(true);
    });

    it('L1-6: Content at minimum length passes', () => {
      const result = validateStructural({
        title: 'A title',
        content: makeContent(MIN_CONTENT_LENGTH),
        specFolder: '003-memory',
      });
      expect(result.pass).toBe(true);
    });

    it('L1-7: Missing spec folder fails', () => {
      const result = validateStructural({
        title: 'A title',
        content: makeContent(100),
        specFolder: '',
      });
      expect(result.pass).toBe(false);
      expect(result.reasons.some(r => r.includes('Spec folder'))).toBe(true);
    });

    it('L1-8: Invalid spec folder format fails', () => {
      const result = validateStructural({
        title: 'A title',
        content: makeContent(100),
        specFolder: '../../etc/passwd',
      });
      expect(result.pass).toBe(false);
      expect(result.reasons.some(r => r.includes('Invalid spec folder'))).toBe(true);
    });

    it('L1-9: Multiple failures reported together', () => {
      const result = validateStructural({
        title: null,
        content: '',
        specFolder: '',
      });
      expect(result.pass).toBe(false);
      expect(result.reasons.length).toBeGreaterThanOrEqual(3);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     Layer 2: Content Quality Scoring
  ──────────────────────────────────────────────────────────────── */

  describe('Layer 2: Content Quality Scoring', () => {

    describe('Title Quality', () => {
      it('TQ1: Null title scores 0', () => {
        expect(scoreTitleQuality(null)).toBe(0);
      });

      it('TQ2: Empty title scores 0', () => {
        expect(scoreTitleQuality('')).toBe(0);
      });

      it('TQ3: Generic "memory" title scores 0.2', () => {
        expect(scoreTitleQuality('memory')).toBe(0.2);
      });

      it('TQ4: Generic "Session 123" scores 0.2', () => {
        expect(scoreTitleQuality('Session 123')).toBe(0.2);
      });

      it('TQ5: Short title (<10 chars) scores 0.4', () => {
        expect(scoreTitleQuality('Fix bug')).toBe(0.4);
      });

      it('TQ6: Medium title (10-19 chars) scores 0.6', () => {
        expect(scoreTitleQuality('Fix the login bug')).toBe(0.6);
      });

      it('TQ7: Good title (20-49 chars) scores 0.8', () => {
        expect(scoreTitleQuality('Implement save quality gate for TM-04')).toBe(0.8);
      });

      it('TQ8: Long descriptive title (50+ chars) scores 1.0', () => {
        expect(scoreTitleQuality('Implement the pre-storage quality gate validation for memory saves in Sprint 4')).toBe(1.0);
      });
    });

    describe('Trigger Quality', () => {
      it('TR1: No triggers scores 0', () => {
        expect(scoreTriggerQuality([])).toBe(0);
      });

      it('TR2: One trigger scores 0.5', () => {
        expect(scoreTriggerQuality(['save memory'])).toBe(0.5);
      });

      it('TR3: Two triggers score 0.5', () => {
        expect(scoreTriggerQuality(['save memory', 'quality gate'])).toBe(0.5);
      });

      it('TR4: Three triggers score 1.0', () => {
        expect(scoreTriggerQuality(['save', 'quality', 'gate'])).toBe(1.0);
      });

      it('TR5: Five triggers score 1.0', () => {
        expect(scoreTriggerQuality(['a', 'b', 'c', 'd', 'e'])).toBe(1.0);
      });
    });

    describe('Length Quality', () => {
      it('LQ1: Short content (<200) scores 0.3', () => {
        expect(scoreLengthQuality(makeContent(100))).toBe(0.3);
      });

      it('LQ2: Medium content (200-1000) scores 0.7', () => {
        expect(scoreLengthQuality(makeContent(500))).toBe(0.7);
      });

      it('LQ3: Long content (>1000) scores 1.0', () => {
        expect(scoreLengthQuality(makeContent(1500))).toBe(1.0);
      });

      it('LQ4: Boundary: exactly 200 scores 0.7', () => {
        expect(scoreLengthQuality(makeContent(200))).toBe(0.7);
      });

      it('LQ5: Boundary: exactly 1000 scores 0.7', () => {
        expect(scoreLengthQuality(makeContent(1000))).toBe(0.7);
      });

      it('LQ6: Boundary: 1001 scores 1.0', () => {
        expect(scoreLengthQuality(makeContent(1001))).toBe(1.0);
      });
    });

    describe('Anchor Quality', () => {
      it('AQ1: No anchors scores 0', () => {
        expect(scoreAnchorQuality([])).toBe(0);
      });

      it('AQ2: One anchor scores 0.5', () => {
        expect(scoreAnchorQuality(['summary'])).toBe(0.5);
      });

      it('AQ3: Two anchors score 0.5', () => {
        expect(scoreAnchorQuality(['summary', 'decisions'])).toBe(0.5);
      });

      it('AQ4: Three anchors score 1.0', () => {
        expect(scoreAnchorQuality(['summary', 'decisions', 'next-steps'])).toBe(1.0);
      });
    });

    describe('Metadata Quality', () => {
      it('MQ1: No frontmatter scores 0', () => {
        expect(scoreMetadataQuality('Just plain content here')).toBe(0);
      });

      it('MQ2: Unclosed frontmatter scores 0', () => {
        expect(scoreMetadataQuality('---\ntitle: Test\nNo closing')).toBe(0);
      });

      it('MQ3: Empty frontmatter scores 0', () => {
        expect(scoreMetadataQuality('---\n---\nContent')).toBe(0);
      });

      it('MQ4: Frontmatter with no recognized fields scores 0.3', () => {
        expect(scoreMetadataQuality('---\nfoo: bar\n---\nContent')).toBe(0.3);
      });

      it('MQ5: Frontmatter with title scores 0.5', () => {
        expect(scoreMetadataQuality('---\ntitle: Test Memory\n---\nContent')).toBe(0.5);
      });

      it('MQ6: Complete frontmatter (3+ fields) scores 1.0', () => {
        const content = makeContentWithFrontmatter({
          title: 'Test Memory',
          trigger_phrases: '[save, quality]',
          context_type: 'implementation',
          importance_tier: 'normal',
        }, makeContent(100));
        expect(scoreMetadataQuality(content)).toBe(1.0);
      });
    });

    describe('Signal Density', () => {
      it('SD1: High-quality memory scores above threshold', () => {
        const content = makeContentWithFrontmatter({
          title: 'Comprehensive implementation of save quality gate for Sprint 4',
          trigger_phrases: '[save, quality, gate, TM-04]',
          context_type: 'implementation',
          importance_tier: 'normal',
        }, makeContent(500));

        const result = scoreContentQuality({
          title: 'Comprehensive implementation of save quality gate for Sprint 4',
          content,
          triggerPhrases: ['save', 'quality', 'gate', 'TM-04'],
          anchors: ['summary', 'decisions', 'next-steps'],
        });

        expect(result.pass).toBe(true);
        expect(result.signalDensity).toBeGreaterThanOrEqual(SIGNAL_DENSITY_THRESHOLD);
      });

      it('SD2: Low-quality memory scores below threshold', () => {
        const result = scoreContentQuality({
          title: null,
          content: makeContent(50),
          triggerPhrases: [],
          anchors: [],
        });

        expect(result.pass).toBe(false);
        expect(result.signalDensity).toBeLessThan(SIGNAL_DENSITY_THRESHOLD);
      });

      it('SD3: Threshold is 0.4', () => {
        expect(SIGNAL_DENSITY_THRESHOLD).toBe(0.4);
      });

      it('SD4: Reasons populated when below threshold', () => {
        const result = scoreContentQuality({
          title: null,
          content: makeContent(50),
          triggerPhrases: [],
          anchors: [],
        });

        expect(result.reasons.length).toBeGreaterThan(0);
        expect(result.reasons.some(r => r.includes('Signal density'))).toBe(true);
      });

      it('SD5: No reasons when above threshold', () => {
        const content = makeContentWithFrontmatter({
          title: 'A comprehensive and descriptive memory title for testing',
          trigger_phrases: '[save, quality, gate]',
          context_type: 'implementation',
        }, makeContent(500));

        const result = scoreContentQuality({
          title: 'A comprehensive and descriptive memory title for testing',
          content,
          triggerPhrases: ['save', 'quality', 'gate'],
          anchors: ['summary', 'decisions', 'next-steps'],
        });

        expect(result.reasons).toHaveLength(0);
      });
    });
  });

  /* ─────────────────────────────────────────────────────────────
     Layer 3: Semantic Dedup
  ──────────────────────────────────────────────────────────────── */

  describe('Layer 3: Semantic Dedup', () => {
    it('SD-1: Duplicate (>0.92) rejected', () => {
      const embedding = makeEmbedding(10);
      const findSimilar = mockFindSimilar([
        { id: 42, file_path: '/test/mem.md', similarity: 0.95 },
      ]);

      const result = checkSemanticDedup(embedding, 'test-spec', findSimilar);
      expect(result.pass).toBe(false);
      expect(result.isDuplicate).toBe(true);
      expect(result.mostSimilarId).toBe(42);
      expect(result.mostSimilarScore).toBeGreaterThan(SEMANTIC_DEDUP_THRESHOLD);
    });

    it('SD-2: Distinct (<0.92) passes', () => {
      const embedding = makeEmbedding(10);
      const findSimilar = mockFindSimilar([
        { id: 42, file_path: '/test/mem.md', similarity: 0.80 },
      ]);

      const result = checkSemanticDedup(embedding, 'test-spec', findSimilar);
      expect(result.pass).toBe(true);
      expect(result.isDuplicate).toBe(false);
    });

    it('SD-3: Exactly 0.92 rejected (>= threshold)', () => {
      const embedding = makeEmbedding(10);
      const findSimilar = mockFindSimilar([
        { id: 42, file_path: '/test/mem.md', similarity: 0.92 },
      ]);

      const result = checkSemanticDedup(embedding, 'test-spec', findSimilar);
      expect(result.pass).toBe(false);
      expect(result.isDuplicate).toBe(true);
    });

    it('SD-4: No existing memories passes', () => {
      const embedding = makeEmbedding(10);
      const findSimilar = mockFindSimilar([]);

      const result = checkSemanticDedup(embedding, 'test-spec', findSimilar);
      expect(result.pass).toBe(true);
      expect(result.isDuplicate).toBe(false);
      expect(result.mostSimilarId).toBeNull();
    });

    it('SD-5: findSimilar error is non-fatal (passes through)', () => {
      const embedding = makeEmbedding(10);
      const findSimilar: FindSimilarFn = () => { throw new Error('Search failed'); };

      const result = checkSemanticDedup(embedding, 'test-spec', findSimilar);
      expect(result.pass).toBe(true);
      expect(result.isDuplicate).toBe(false);
    });

    it('SD-6: Threshold constant is 0.92', () => {
      expect(SEMANTIC_DEDUP_THRESHOLD).toBe(0.92);
    });

    it('SD-7: Similarity in [0.88, 0.92) passes TM-04 (reserved for TM-06 merge)', () => {
      const embedding = makeEmbedding(10);
      const findSimilar = mockFindSimilar([
        { id: 42, file_path: '/test/mem.md', similarity: 0.89 },
      ]);

      const result = checkSemanticDedup(embedding, 'test-spec', findSimilar);
      expect(result.pass).toBe(true);
      expect(result.isDuplicate).toBe(false);
      expect(result.mostSimilarScore).toBe(0.89);
    });

    it('SD-8: Similarity 0.919 passes (just below threshold)', () => {
      const embedding = makeEmbedding(10);
      const findSimilar = mockFindSimilar([
        { id: 42, file_path: '/test/mem.md', similarity: 0.919 },
      ]);

      const result = checkSemanticDedup(embedding, 'test-spec', findSimilar);
      expect(result.pass).toBe(true);
      expect(result.isDuplicate).toBe(false);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     Cosine Similarity
  ──────────────────────────────────────────────────────────────── */

  describe('Cosine Similarity', () => {
    it('CS1: Identical vectors have similarity 1.0', () => {
      const a = [1, 0, 0];
      const b = [1, 0, 0];
      expect(cosineSimilarity(a, b)).toBeCloseTo(1.0, 5);
    });

    it('CS2: Orthogonal vectors have similarity 0.0', () => {
      const a = [1, 0, 0];
      const b = [0, 1, 0];
      expect(cosineSimilarity(a, b)).toBeCloseTo(0.0, 5);
    });

    it('CS3: Opposite vectors have similarity -1.0', () => {
      const a = [1, 0, 0];
      const b = [-1, 0, 0];
      expect(cosineSimilarity(a, b)).toBeCloseTo(-1.0, 5);
    });

    it('CS4: Different length vectors return 0', () => {
      const a = [1, 0];
      const b = [1, 0, 0];
      expect(cosineSimilarity(a, b)).toBe(0);
    });

    it('CS5: Zero vectors return 0', () => {
      const a = [0, 0, 0];
      const b = [1, 0, 0];
      expect(cosineSimilarity(a, b)).toBe(0);
    });

    it('CS6: Works with Float32Array', () => {
      const a = new Float32Array([1, 0, 0]);
      const b = new Float32Array([1, 0, 0]);
      expect(cosineSimilarity(a, b)).toBeCloseTo(1.0, 4);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     Unified Quality Gate
  ──────────────────────────────────────────────────────────────── */

  describe('Unified Quality Gate', () => {
    const originalEnv = process.env.SPECKIT_SAVE_QUALITY_GATE;

    beforeEach(() => {
      resetActivationTimestamp();
    });

    afterEach(() => {
      resetActivationTimestamp();
      if (originalEnv !== undefined) {
        process.env.SPECKIT_SAVE_QUALITY_GATE = originalEnv;
      } else {
        delete process.env.SPECKIT_SAVE_QUALITY_GATE;
      }
    });

    it('UG1: Gate OFF returns pass=true with gateEnabled=false', () => {
      process.env.SPECKIT_SAVE_QUALITY_GATE = 'false';
      const result = runQualityGate({
        title: null,
        content: '',
        specFolder: '',
      });
      expect(result.pass).toBe(true);
      expect(result.gateEnabled).toBe(false);
      expect(result.wouldReject).toBe(false);
    });

    it('UG2: Gate ON, valid memory passes all layers', () => {
      process.env.SPECKIT_SAVE_QUALITY_GATE = 'true';
      // Set activation far in the past to exit warn-only mode
      setActivationTimestamp(Date.now() - (15 * 24 * 60 * 60 * 1000));

      const content = makeContentWithFrontmatter({
        title: 'Comprehensive implementation of save quality gate for Sprint 4',
        trigger_phrases: '[save, quality, gate, TM-04]',
        context_type: 'implementation',
        importance_tier: 'normal',
      }, makeContent(500));

      const result = runQualityGate({
        title: 'Comprehensive implementation of save quality gate for Sprint 4',
        content,
        specFolder: '003-memory/140-sprint4',
        triggerPhrases: ['save', 'quality', 'gate', 'TM-04'],
        anchors: ['summary', 'decisions', 'next-steps'],
      });

      expect(result.pass).toBe(true);
      expect(result.gateEnabled).toBe(true);
      expect(result.wouldReject).toBe(false);
    });

    it('UG3: Gate ON, structural failure rejects', () => {
      process.env.SPECKIT_SAVE_QUALITY_GATE = 'true';
      setActivationTimestamp(Date.now() - (15 * 24 * 60 * 60 * 1000));

      const result = runQualityGate({
        title: null,
        content: makeContent(100),
        specFolder: '003-memory',
      });

      expect(result.pass).toBe(false);
      expect(result.wouldReject).toBe(true);
      expect(result.layers.structural.pass).toBe(false);
    });

    it('UG4: Gate ON, low quality content rejects', () => {
      process.env.SPECKIT_SAVE_QUALITY_GATE = 'true';
      setActivationTimestamp(Date.now() - (15 * 24 * 60 * 60 * 1000));

      const result = runQualityGate({
        title: 'x', // Very short, low quality
        content: makeContent(60), // Just above minimum
        specFolder: '003-memory',
        triggerPhrases: [],
        anchors: [],
      });

      expect(result.pass).toBe(false);
      expect(result.layers.contentQuality.pass).toBe(false);
    });

    it('UG5: Gate ON, semantic duplicate rejects', () => {
      process.env.SPECKIT_SAVE_QUALITY_GATE = 'true';
      setActivationTimestamp(Date.now() - (15 * 24 * 60 * 60 * 1000));

      const content = makeContentWithFrontmatter({
        title: 'A well-structured memory about quality gates in Sprint 4',
        trigger_phrases: '[save, quality, gate]',
        context_type: 'implementation',
      }, makeContent(500));

      const result = runQualityGate({
        title: 'A well-structured memory about quality gates in Sprint 4',
        content,
        specFolder: '003-memory/140-sprint4',
        triggerPhrases: ['save', 'quality', 'gate'],
        anchors: ['summary', 'decisions', 'next-steps'],
        embedding: makeEmbedding(10),
        findSimilar: mockFindSimilar([
          { id: 99, file_path: '/test/dup.md', similarity: 0.95 },
        ]),
      });

      expect(result.pass).toBe(false);
      expect(result.wouldReject).toBe(true);
      expect(result.layers.semanticDedup).not.toBeNull();
      expect(result.layers.semanticDedup!.pass).toBe(false);
    });

    it('UG6: Gate ON, no embedding skips semantic dedup', () => {
      process.env.SPECKIT_SAVE_QUALITY_GATE = 'true';
      setActivationTimestamp(Date.now() - (15 * 24 * 60 * 60 * 1000));

      const content = makeContentWithFrontmatter({
        title: 'A well-structured memory about quality gates in Sprint 4',
        trigger_phrases: '[save, quality, gate]',
        context_type: 'implementation',
      }, makeContent(500));

      const result = runQualityGate({
        title: 'A well-structured memory about quality gates in Sprint 4',
        content,
        specFolder: '003-memory',
        triggerPhrases: ['save', 'quality', 'gate'],
        anchors: ['summary', 'decisions', 'next-steps'],
        embedding: null,
        findSimilar: null,
      });

      expect(result.layers.semanticDedup).toBeNull();
    });

    it('UG7: Reasons aggregated from all layers', () => {
      process.env.SPECKIT_SAVE_QUALITY_GATE = 'true';
      setActivationTimestamp(Date.now() - (15 * 24 * 60 * 60 * 1000));

      const result = runQualityGate({
        title: null,
        content: makeContent(30),
        specFolder: '003-memory',
      });

      expect(result.reasons.length).toBeGreaterThan(0);
    });

    it('UG8: TM-04/TM-06 interaction: similarity 0.89 passes TM-04', () => {
      process.env.SPECKIT_SAVE_QUALITY_GATE = 'true';
      setActivationTimestamp(Date.now() - (15 * 24 * 60 * 60 * 1000));

      const content = makeContentWithFrontmatter({
        title: 'A well-structured memory about quality gates in Sprint 4',
        trigger_phrases: '[save, quality, gate]',
        context_type: 'implementation',
      }, makeContent(500));

      const result = runQualityGate({
        title: 'A well-structured memory about quality gates in Sprint 4',
        content,
        specFolder: '003-memory/140-sprint4',
        triggerPhrases: ['save', 'quality', 'gate'],
        anchors: ['summary', 'decisions', 'next-steps'],
        embedding: makeEmbedding(10),
        findSimilar: mockFindSimilar([
          { id: 99, file_path: '/test/sim.md', similarity: 0.89 },
        ]),
      });

      // Similarity 0.89 is below TM-04's 0.92 threshold, so it passes
      // TM-06 would handle this as a merge (>= 0.88)
      expect(result.pass).toBe(true);
      expect(result.layers.semanticDedup!.pass).toBe(true);
      expect(result.layers.semanticDedup!.isDuplicate).toBe(false);
    });
  });
});
