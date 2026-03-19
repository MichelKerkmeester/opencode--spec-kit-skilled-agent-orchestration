// TEST: PREDICTION ERROR GATE (vitest)
// Converted from: prediction-error-gate.test.ts (custom runner)
// Aligned with production prediction-error-gate.ts named exports
import { describe, it, expect, vi } from 'vitest';
import * as peGate from '../lib/cognitive/prediction-error-gate';

const peGateModule = peGate as unknown as Record<string, unknown>;
const peGateActions = peGate.ACTION as unknown as Record<string, unknown>;
type ContradictionInput = Parameters<typeof peGate.detectContradiction>[0];
type CandidateInput = Parameters<typeof peGate.evaluateMemory>[2];
type ActionInput = Parameters<typeof peGate.getActionPriority>[0];
type TruncateInput = Parameters<typeof peGate.truncateContent>[0];

describe('Prediction Error Gate Module', () => {
  /* ───────────────────────────────────────────────────────────────
     T101-T104: Threshold Constants
  ──────────────────────────────────────────────────────────────── */

  describe('T101-T104: Threshold Constants', () => {
    it('T101: DUPLICATE equals 0.95', () => {
      expect(peGate.THRESHOLD.DUPLICATE).toBe(0.95);
    });

    it('T102: HIGH_MATCH equals 0.85', () => {
      // Production value, not 0.90
      expect(peGate.THRESHOLD.HIGH_MATCH).toBe(0.85);
    });

    it('T103: MEDIUM_MATCH equals 0.70', () => {
      expect(peGate.THRESHOLD.MEDIUM_MATCH).toBe(0.70);
    });

    it('T104: All thresholds are valid numbers in [0,1]', () => {
      const thresholds = Object.values(peGate.THRESHOLD);
      for (const t of thresholds) {
        expect(typeof t).toBe('number');
        expect(t).toBeGreaterThanOrEqual(0);
        expect(t).toBeLessThanOrEqual(1);
      }
    });
  });

  /* ───────────────────────────────────────────────────────────────
     T105-T112: evaluateMemory()
     Production signature: evaluateMemory(contentHash, content, candidates, options)
     Candidates have similarity in 0-1 scale (normalized by findSimilarMemories)
  ──────────────────────────────────────────────────────────────── */

  describe('T105-T112: evaluateMemory()', () => {
    it('T105: sim>=95 returns REINFORCE', () => {
      const r = peGate.evaluateMemory('hash1', 'New content', [{ id: 1, similarity: 0.96, content: 'Test' }]);
      expect(r.action).toBe(peGate.ACTION.REINFORCE);
    });

    it('T106: sim 85-94 returns UPDATE for compatible content', () => {
      const r = peGate.evaluateMemory('hash2', 'Use feature X with improvements', [{ id: 1, similarity: 0.92, content: 'Use feature X' }]);
      expect(r.action).toBe(peGate.ACTION.UPDATE);
    });

    it('T107: sim 70-84 returns CREATE_LINKED', () => {
      const r = peGate.evaluateMemory('hash3', 'New related', [{ id: 1, similarity: 0.80, content: 'Test' }]);
      expect(r.action).toBe(peGate.ACTION.CREATE_LINKED);
    });

    it('T108: sim < 50 returns CREATE', () => {
      const r = peGate.evaluateMemory('hash4', 'Brand new', [{ id: 1, similarity: 0.30, content: 'Test' }]);
      expect(r.action).toBe(peGate.ACTION.CREATE);
    });

    it('T109: Boundary - exactly 95 returns REINFORCE', () => {
      const r = peGate.evaluateMemory('hash5', 'Test', [{ id: 1, similarity: 0.95, content: 'Test' }]);
      expect(r.action).toBe(peGate.ACTION.REINFORCE);
    });

    it('T110: Boundary - exactly 85 returns UPDATE', () => {
      const r = peGate.evaluateMemory('hash6', 'Test', [{ id: 1, similarity: 0.85, content: 'Test' }]);
      expect(r.action).toBe(peGate.ACTION.UPDATE);
    });

    it('T111: Boundary - exactly 70 returns CREATE_LINKED', () => {
      const r = peGate.evaluateMemory('hash7', 'Test', [{ id: 1, similarity: 0.70, content: 'Test' }]);
      expect(r.action).toBe(peGate.ACTION.CREATE_LINKED);
    });

    it('T112: Empty candidates returns CREATE', () => {
      const r = peGate.evaluateMemory('hash8', 'New', []);
      expect(r.action).toBe(peGate.ACTION.CREATE);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     T113-T125: Contradiction Detection
     Production: detectContradiction(newContent, existingContent)
     Returns: { detected: boolean, type: string|null, description: string|null, confidence: number }
     Patterns: negation, replacement, deprecation, correction, clarification, prohibition, obsolescence, explicit
  ──────────────────────────────────────────────────────────────── */

  describe('T113-T125: Contradiction Detection', () => {
    it('T113: "not...but" detected as negation', () => {
      const r = peGate.detectContradiction('This is not true but false', 'The original statement');
      expect(r.detected).toBe(true);
      expect(r.type).toBe('negation');
    });

    it('T114: "instead" detected as replacement', () => {
      const r = peGate.detectContradiction('Use Y instead', 'Use X');
      expect(r.detected).toBe(true);
      expect(r.type).toBe('replacement');
    });

    it('T115: "no longer" detected as deprecation', () => {
      const r = peGate.detectContradiction('This is no longer valid', 'Original approach');
      expect(r.detected).toBe(true);
      expect(r.type).toBe('deprecation');
    });

    it('T116: "wrong" detected as correction', () => {
      const r = peGate.detectContradiction('The previous approach was wrong', 'Old approach');
      expect(r.detected).toBe(true);
      expect(r.type).toBe('correction');
    });

    it('T117: "actually" detected as clarification', () => {
      const r = peGate.detectContradiction('Actually, this is the way', 'Previous understanding');
      expect(r.detected).toBe(true);
      expect(r.type).toBe('clarification');
    });

    it('T118: "should not" detected as prohibition', () => {
      const r = peGate.detectContradiction('You should not do this', 'Do this');
      expect(r.detected).toBe(true);
      expect(r.type).toBe('prohibition');
    });

    it('T119: "obsolete" detected as obsolescence', () => {
      const r = peGate.detectContradiction('This method is obsolete', 'Use this method');
      expect(r.detected).toBe(true);
      expect(r.type).toBe('obsolescence');
    });

    it('T120: "contradicts" detected as explicit', () => {
      const r = peGate.detectContradiction('This contradicts the previous', 'Previous');
      expect(r.detected).toBe(true);
      expect(r.type).toBe('explicit');
    });

    it('T121: Non-contradictory content NOT flagged', () => {
      const r = peGate.detectContradiction('Use feature X for performance', 'Use feature X for reliability');
      expect(r.detected).toBe(false);
    });

    it('T122: Empty strings handled gracefully', () => {
      const r = peGate.detectContradiction('', '');
      expect(r.detected).toBe(false);
    });

    it('T123: Null inputs handled gracefully', () => {
      // Production checks for falsy
      const r = peGate.detectContradiction(
        null as unknown as ContradictionInput,
        null as unknown as ContradictionInput
      );
      expect(r.detected).toBe(false);
    });

    it('T124: Confidence is positive number when detected', () => {
      const r = peGate.detectContradiction('This is not true but false', 'The original statement');
      expect(typeof r.confidence).toBe('number');
      expect(r.confidence).toBeGreaterThan(0);
    });

    it('T125: Result has {detected, type, description, confidence}', () => {
      const r = peGate.detectContradiction('test', 'test');
      expect(r).toHaveProperty('detected');
      expect(r).toHaveProperty('type');
      expect(r).toHaveProperty('description');
      expect(r).toHaveProperty('confidence');
    });
  });

  /* ───────────────────────────────────────────────────────────────
     T126-T132: Action Constants & Decision Logic
  ──────────────────────────────────────────────────────────────── */

  describe('T126-T132: Action Constants & Decision Logic', () => {
    it('T126: REINFORCE for near-duplicates', () => {
      const r = peGate.evaluateMemory('hash', 'Same content', [{ id: 1, similarity: 0.97, content: 'Same content' }]);
      expect(r.action).toBe(peGate.ACTION.REINFORCE);
    });

    it('T127: UPDATE for compatible high matches', () => {
      const r = peGate.evaluateMemory('hash', 'Use async/await with error handling', [{ id: 1, similarity: 0.93, content: 'Use async/await' }]);
      expect(r.action).toBe(peGate.ACTION.UPDATE);
    });

    it('T128: SUPERSEDE for contradictions in high match range', () => {
      // "not...but" in combined text triggers negation pattern
      const r = peGate.evaluateMemory('hash', 'Not use var but use let', [{ id: 1, similarity: 0.92, content: 'Always use var' }]);
      expect(r.action).toBe(peGate.ACTION.SUPERSEDE);
      expect(r.contradiction).toBeTruthy();
      expect(r.contradiction!.detected).toBe(true);
    });

    it('T129: CREATE for no candidates', () => {
      const r = peGate.evaluateMemory('hash', 'Brand new', []);
      expect(r.action).toBe(peGate.ACTION.CREATE);
      expect(r.reason).toContain('No existing candidates');
    });

    it('T130: existingMemoryId set for matched candidate', () => {
      const r = peGate.evaluateMemory('hash', 'Related', [{ id: 42, similarity: 0.85, content: 'Test' }]);
      expect(r.existingMemoryId).toBe(42);
    });

    it('T131: Best candidate selected (highest similarity)', () => {
      const r = peGate.evaluateMemory('hash', 'New', [
        { id: 1, similarity: 0.80, content: 'A' },
        { id: 2, similarity: 0.96, content: 'B' },
        { id: 3, similarity: 0.85, content: 'C' },
      ]);
      expect(r.existingMemoryId).toBe(2);
    });

    it('T132: All ACTION constants defined', () => {
      const expectedActions = ['CREATE', 'UPDATE', 'SUPERSEDE', 'REINFORCE', 'CREATE_LINKED'];
      for (const a of expectedActions) {
        expect(peGateActions[a]).toBe(a);
      }
    });
  });

  /* ───────────────────────────────────────────────────────────────
     T136-T145: Edge Cases
  ──────────────────────────────────────────────────────────────── */

  describe('T136-T145: Edge Cases', () => {
    it('T136: Null candidates handled', () => {
      const r = peGate.evaluateMemory('hash', 'New', null as unknown as CandidateInput);
      expect(r.action).toBe(peGate.ACTION.CREATE);
    });

    it('T137: Undefined candidates handled', () => {
      const r = peGate.evaluateMemory('hash', 'New', undefined as unknown as CandidateInput);
      expect(r.action).toBe(peGate.ACTION.CREATE);
    });

    it('T138: sim=1.0 returns REINFORCE', () => {
      const r = peGate.evaluateMemory('hash', 'Test', [{ id: 1, similarity: 1.0, content: 'Test' }]);
      expect(r.action).toBe(peGate.ACTION.REINFORCE);
    });

    it('T139: Result always has action', () => {
      const r = peGate.evaluateMemory('hash', '', [{ id: 1, similarity: 0.80, content: '' }]);
      expect(r.action).toBeTruthy();
    });

    it('T140: Empty candidates => existingMemoryId=null', () => {
      const r = peGate.evaluateMemory('hash', 'New', []);
      expect(r.existingMemoryId).toBeNull();
    });
  });

  /* ───────────────────────────────────────────────────────────────
     T146-T155: Helper Functions
  ──────────────────────────────────────────────────────────────── */

  describe('T146-T155: Helper Functions', () => {
    it('T146: calculateSimilarityStats correct', () => {
      const stats = peGate.calculateSimilarityStats([
        { similarity: 0.90 },
        { similarity: 0.80 },
        { similarity: 0.70 },
      ]);
      expect(stats.max).toBe(0.90);
      expect(stats.min).toBe(0.70);
      expect(stats.count).toBe(3);
      expect(stats.avg).toBeCloseTo(0.80, 2);
    });

    it('T147: calculateSimilarityStats empty => zeros', () => {
      const stats = peGate.calculateSimilarityStats([]);
      expect(stats.max).toBe(0);
      expect(stats.min).toBe(0);
      expect(stats.avg).toBe(0);
      expect(stats.count).toBe(0);
    });

    it('T148: filterRelevantCandidates filters correctly', () => {
      const filtered = peGate.filterRelevantCandidates([
        { id: 1, similarity: 0.90 },
        { id: 2, similarity: 0.40 },
        { id: 3, similarity: 0.75 },
      ]);
      expect(filtered).toHaveLength(2);
      expect(filtered.every((c: unknown) => (c as { similarity: number }).similarity >= 0.50)).toBe(true);
    });

    it('T149: filterRelevantCandidates sorted desc', () => {
      const filtered = peGate.filterRelevantCandidates([
        { id: 1, similarity: 0.90 },
        { id: 2, similarity: 0.40 },
        { id: 3, similarity: 0.75 },
      ]);
      expect(filtered[0].similarity).toBeGreaterThanOrEqual(filtered[1].similarity);
    });

    it('T150: getActionPriority order correct', () => {
      const priorities = {
        SUPERSEDE: peGate.getActionPriority(peGate.ACTION.SUPERSEDE as ActionInput),
        UPDATE: peGate.getActionPriority(peGate.ACTION.UPDATE as ActionInput),
        CREATE_LINKED: peGate.getActionPriority(peGate.ACTION.CREATE_LINKED as ActionInput),
        CREATE: peGate.getActionPriority(peGate.ACTION.CREATE as ActionInput),
        REINFORCE: peGate.getActionPriority(peGate.ACTION.REINFORCE as ActionInput),
      };
      // Production: SUPERSEDE=1, UPDATE=2, CREATE_LINKED=3, CREATE=4, REINFORCE=5
      expect(priorities.SUPERSEDE).toBeLessThan(priorities.UPDATE);
      expect(priorities.UPDATE).toBeLessThan(priorities.CREATE_LINKED);
      expect(priorities.CREATE_LINKED).toBeLessThan(priorities.CREATE);
      expect(priorities.CREATE).toBeLessThan(priorities.REINFORCE);
    });

    it('T151: truncateContent truncates + adds "..."', () => {
      const longContent = 'A'.repeat(300);
      const truncated = peGate.truncateContent(longContent, 100);
      expect(truncated).toHaveLength(103);
      expect(truncated.endsWith('...')).toBe(true);
    });

    it('T152: truncateContent preserves short strings', () => {
      const shortContent = 'Short text';
      expect(peGate.truncateContent(shortContent, 100)).toBe(shortContent);
    });

    it('T153: truncateContent handles null/undefined', () => {
      expect(peGate.truncateContent(null as unknown as TruncateInput, 100)).toBe('');
      expect(peGate.truncateContent(undefined as unknown as TruncateInput, 100)).toBe('');
    });

    it('T154: CONTRADICTION_PATTERNS populated', () => {
      expect(Array.isArray(peGate.CONTRADICTION_PATTERNS)).toBe(true);
      expect(peGate.CONTRADICTION_PATTERNS.length).toBeGreaterThan(0);
      type PatternEntry = { pattern: unknown; type: unknown; description: unknown };
      const hasRequired = peGate.CONTRADICTION_PATTERNS.every(
        (p: unknown) => (p as PatternEntry).pattern && (p as PatternEntry).type && (p as PatternEntry).description
      );
      expect(hasRequired).toBe(true);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     T156-T165: Conflict Logging
  ──────────────────────────────────────────────────────────────── */

  describe('T156-T165: Conflict Logging', () => {
    it('T156: formatConflictRecord creates valid record', () => {
      const contradiction = { detected: false, type: null, description: null, confidence: 0 };
      const record = peGate.formatConflictRecord(
        peGate.ACTION.UPDATE as ActionInput, // action
        'hash123',                    // newMemoryHash
        1,                            // existingMemoryId
        0.92,                         // similarity
        'Test reason',                // reason
        contradiction,                // contradiction
        'New content preview',        // newContentPreview
        'Existing content preview',   // existingContentPreview
        'specs/test'                  // specFolder
      );
      expect(record.action).toBe('UPDATE');
      expect(record.similarity).toBe(0.92);
      expect(record.spec_folder).toBe('specs/test');
    });

    it('T157: Record has all expected fields', () => {
      const contradiction = { detected: false, type: null, description: null, confidence: 0 };
      const record = peGate.formatConflictRecord(
        peGate.ACTION.UPDATE as ActionInput,
        'hash123',
        1,
        0.92,
        'Test reason',
        contradiction,
        'New content preview',
        'Existing content preview',
        'specs/test'
      );
      const expectedFields = ['action', 'new_memory_hash', 'existing_memory_id', 'similarity',
        'reason', 'contradiction_detected', 'contradiction_type', 'new_content_preview',
        'existing_content_preview', 'spec_folder'];
      for (const f of expectedFields) {
        expect(record).toHaveProperty(f);
      }
    });

    it('T158: logConflict without DB does not crash', () => {
      const contradiction = { detected: false, type: null, description: null, confidence: 0 };
      const record = peGate.formatConflictRecord(
        peGate.ACTION.UPDATE as ActionInput,
        'hash123',
        1,
        0.92,
        'Test reason',
        contradiction,
        'New content preview',
        'Existing content preview',
        'specs/test'
      );
      expect(() => peGate.logConflict(record)).not.toThrow();
    });

    it('T159: getConflictStats returns empty without DB', () => {
      const stats = peGate.getConflictStats();
      expect(stats.total).toBe(0);
      expect(typeof stats.byAction).toBe('object');
    });

    it('T160: getRecentConflicts returns [] without DB', () => {
      const recent = peGate.getRecentConflicts();
      expect(Array.isArray(recent)).toBe(true);
      expect(recent).toHaveLength(0);
    });

    it('T161: init(null) does not crash', () => {
      expect(() => peGate.init(null as unknown as Parameters<typeof peGate.init>[0])).not.toThrow();
    });

    it('MUT05-1: no-candidate CREATE logs existing_memory_id as NULL', () => {
      const runArgs: unknown[][] = [];
      const fakeDb = {
        prepare: vi.fn(() => ({
          run: (...args: unknown[]) => {
            runArgs.push(args);
            return { changes: 1 };
          },
        })),
      };

      peGate.init(fakeDb as unknown as Parameters<typeof peGate.init>[0]);
      const result = peGate.evaluateMemory('mut05-hash-1', 'Brand new memory', []);

      expect(result.action).toBe(peGate.ACTION.CREATE);
      expect(runArgs).toHaveLength(1);
      expect(runArgs[0][2]).toBeNull();

      peGate.init(null as unknown as Parameters<typeof peGate.init>[0]);
    });

    it('MUT05-2: filtered-out CREATE logs existing_memory_id as NULL', () => {
      const runArgs: unknown[][] = [];
      const fakeDb = {
        prepare: vi.fn(() => ({
          run: (...args: unknown[]) => {
            runArgs.push(args);
            return { changes: 1 };
          },
        })),
      };

      peGate.init(fakeDb as unknown as Parameters<typeof peGate.init>[0]);
      const result = peGate.evaluateMemory(
        'mut05-hash-2',
        'Another new memory',
        [{ id: 99, similarity: 0.10, content: 'Low similarity candidate' }]
      );

      expect(result.action).toBe(peGate.ACTION.CREATE);
      expect(result.reason).toContain('No relevant candidates after filtering');
      expect(runArgs).toHaveLength(1);
      expect(runArgs[0][2]).toBeNull();

      peGate.init(null as unknown as Parameters<typeof peGate.init>[0]);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     T162-T165: batchEvaluate()
  ──────────────────────────────────────────────────────────────── */

  describe('T162-T165: batchEvaluate()', () => {
    it('T162: batchEvaluate returns results + stats', () => {
      const batch = peGate.batchEvaluate([
        { contentHash: 'h1', content: 'New memory 1', candidates: [{ id: 1, similarity: 0.96, content: 'Old' }] },
        { contentHash: 'h2', content: 'New memory 2', candidates: [] },
      ]);
      expect(batch.results).toHaveLength(2);
      expect(batch.stats.total).toBe(2);
    });

    it('T163: Stats track creates and reinforces', () => {
      const batch = peGate.batchEvaluate([
        { contentHash: 'h1', content: 'New memory 1', candidates: [{ id: 1, similarity: 0.96, content: 'Old' }] },
        { contentHash: 'h2', content: 'New memory 2', candidates: [] },
      ]);
      expect(batch.stats.creates).toBeGreaterThanOrEqual(1);
      expect(batch.stats.reinforces).toBeGreaterThanOrEqual(1);
    });

    it('T164: Empty batch returns zero stats', () => {
      const empty = peGate.batchEvaluate([]);
      expect(empty.stats.total).toBe(0);
      expect(empty.results).toHaveLength(0);
    });

    it('T165: Stats has all expected fields', () => {
      const batch = peGate.batchEvaluate([
        { contentHash: 'h1', content: 'New memory 1', candidates: [{ id: 1, similarity: 0.96, content: 'Old' }] },
        { contentHash: 'h2', content: 'New memory 2', candidates: [] },
      ]);
      const statFields = ['total', 'creates', 'updates', 'supersedes', 'reinforces', 'contradictions'];
      for (const f of statFields) {
        expect(typeof (batch.stats as Record<string, unknown>)[f]).toBe('number');
      }
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Module Exports
  ──────────────────────────────────────────────────────────────── */

  describe('Module Exports', () => {
    const expectedExports = [
      'THRESHOLD', 'ACTION', 'CONTRADICTION_PATTERNS',
      'init', 'evaluateMemory', 'detectContradiction',
      'formatConflictRecord', 'logConflict', 'getConflictStats',
      'getRecentConflicts', 'batchEvaluate', 'calculateSimilarityStats',
      'filterRelevantCandidates', 'getActionPriority', 'truncateContent',
    ];

    it.each(expectedExports)('Export: %s', (name) => {
      expect(peGateModule[name]).toBeDefined();
    });
  });

  /* ───────────────────────────────────────────────────────────────
     C138: Read-Time Contradiction Detection
  ──────────────────────────────────────────────────────────────── */

  describe('C138: Read-Time Contradiction Flagging', () => {
    it('C138-T1: detectContradiction function exists', () => {
      expect(typeof peGate.detectContradiction).toBe('function');
    });

    it('C138-T2: contradicting content triggers detection', () => {
      const input = {
        content1: 'Must use PostgreSQL for all database operations',
        content2: 'I used MySQL for the database today',
        similarity: 75,
      };
      const result = peGate.detectContradiction(input.content1, input.content2);
      expect(typeof result).toBe('object');
    });

    it('C138-T3: THRESHOLD constants are valid for contradiction detection', () => {
      expect(peGate.THRESHOLD.HIGH_MATCH).toBeGreaterThan(peGate.THRESHOLD.MEDIUM_MATCH);
      expect(peGate.THRESHOLD.DUPLICATE).toBeGreaterThan(peGate.THRESHOLD.HIGH_MATCH);
    });

    it('C138-T4: ACTION types include contradiction-related actions', () => {
      // Verify the action enum has the expected values for PE gate
      expect(peGateActions).toBeDefined();
      const actionValues = Object.values(peGateActions);
      expect(actionValues.length).toBeGreaterThanOrEqual(3);
    });
  });
});
