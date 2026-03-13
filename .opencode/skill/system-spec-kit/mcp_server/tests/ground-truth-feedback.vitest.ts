// TEST: Ground Truth Feedback
// R13-S2: Phase B (implicit feedback) + Phase C (LLM-judge)
// For ground truth expansion.
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

import {
  recordUserSelection,
  getSelectionHistory,
  generateLlmJudgeLabels,
  saveLlmJudgeLabels,
  computeJudgeAgreement,
  getGroundTruthCorpusSize,
  resetFeedbackSchemaFlag,
  type SelectionContext,
  type LlmJudgeLabel,
  type ManualLabel,
} from '../lib/eval/ground-truth-feedback';

import { initEvalDb, closeEvalDb } from '../lib/eval/eval-db';

/* --- Test Setup --- */

let tmpDir: string;
const originalDbDir = process.env.SPEC_KIT_DB_DIR;

describe('Ground Truth Feedback (R13-S2)', () => {
  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gt-feedback-test-'));
    process.env.SPEC_KIT_DB_DIR = tmpDir;
    closeEvalDb();
    resetFeedbackSchemaFlag();
    initEvalDb(tmpDir);
  });

  afterEach(() => {
    closeEvalDb();
    resetFeedbackSchemaFlag();
    if (originalDbDir === undefined) {
      delete process.env.SPEC_KIT_DB_DIR;
    } else {
      process.env.SPEC_KIT_DB_DIR = originalDbDir;
    }
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  /* --- Phase B: User Selection Tracking --- */

  describe('Phase B: recordUserSelection', () => {
    it('records a user selection and returns a positive ID', () => {
      const id = recordUserSelection('q1', 42, {
        searchMode: 'search',
        intent: 'understand',
        selectedRank: 3,
        totalResultsShown: 10,
      });

      expect(id).toBeGreaterThan(0);
    });

    it('records multiple selections for the same query', () => {
      const id1 = recordUserSelection('q1', 42);
      const id2 = recordUserSelection('q1', 43);
      const id3 = recordUserSelection('q1', 44);

      expect(id1).toBeGreaterThan(0);
      expect(id2).toBeGreaterThan(id1);
      expect(id3).toBeGreaterThan(id2);
    });

    it('records selections with minimal context', () => {
      const id = recordUserSelection('q1', 42);
      expect(id).toBeGreaterThan(0);
    });

    it('records selections with full context', () => {
      const ctx: SelectionContext = {
        searchMode: 'context',
        intent: 'fix_bug',
        selectedRank: 1,
        totalResultsShown: 5,
        sessionId: 'sess-123',
        notes: 'This was very relevant',
      };

      const id = recordUserSelection('q2', 99, ctx);
      expect(id).toBeGreaterThan(0);
    });
  });

  describe('Phase B: getSelectionHistory', () => {
    it('retrieves all selections when no queryId filter', () => {
      recordUserSelection('q1', 42);
      recordUserSelection('q2', 43);
      recordUserSelection('q3', 44);

      const history = getSelectionHistory();
      expect(history).toHaveLength(3);
    });

    it('filters selections by queryId', () => {
      recordUserSelection('q1', 42);
      recordUserSelection('q1', 43);
      recordUserSelection('q2', 44);

      const history = getSelectionHistory('q1');
      expect(history).toHaveLength(2);
      expect(history.every(s => s.queryId === 'q1')).toBe(true);
    });

    it('returns selections in newest-first order', () => {
      recordUserSelection('q1', 42);
      recordUserSelection('q1', 43);

      const history = getSelectionHistory('q1');
      // Most recent should have higher ID
      expect(history[0].id).toBeGreaterThan(history[1].id);
    });

    it('respects the limit parameter', () => {
      for (let i = 0; i < 10; i++) {
        recordUserSelection('q1', i + 1);
      }

      const history = getSelectionHistory(undefined, 5);
      expect(history).toHaveLength(5);
    });

    it('returns context fields correctly', () => {
      recordUserSelection('q1', 42, {
        searchMode: 'trigger',
        intent: 'add_feature',
        selectedRank: 2,
        totalResultsShown: 8,
        sessionId: 'sess-456',
        notes: 'test note',
      });

      const history = getSelectionHistory('q1');
      expect(history).toHaveLength(1);

      const sel = history[0];
      expect(sel.queryId).toBe('q1');
      expect(sel.memoryId).toBe(42);
      expect(sel.context.searchMode).toBe('trigger');
      expect(sel.context.intent).toBe('add_feature');
      expect(sel.context.selectedRank).toBe(2);
      expect(sel.context.totalResultsShown).toBe(8);
      expect(sel.context.sessionId).toBe('sess-456');
      expect(sel.context.notes).toBe('test note');
    });

    it('returns empty array when no selections exist', () => {
      const history = getSelectionHistory('nonexistent');
      expect(history).toHaveLength(0);
    });
  });

  /* --- Phase C: LLM-Judge --- */

  describe('Phase C: generateLlmJudgeLabels (deterministic heuristic)', () => {
    it('returns operational labels with bounded relevance and confidence', () => {
      const pairs = [
        { queryId: 'q1', memoryId: 42, queryText: 'test query', memoryContent: 'test content' },
        { queryId: 'q2', memoryId: 43, queryText: 'another query', memoryContent: 'another content' },
      ];

      const labels = generateLlmJudgeLabels(pairs);

      expect(labels).toHaveLength(2);
      expect(labels[0].queryId).toBe('q1');
      expect(labels[0].memoryId).toBe(42);
      expect(labels[0].relevance).toBeGreaterThanOrEqual(0);
      expect(labels[0].relevance).toBeLessThanOrEqual(3);
      expect(labels[0].confidence).toBeGreaterThanOrEqual(0);
      expect(labels[0].confidence).toBeLessThanOrEqual(1);
      expect(labels[0].reasoning).toBeDefined();
    });

    it('returns empty array for empty input', () => {
      const labels = generateLlmJudgeLabels([]);
      expect(labels).toHaveLength(0);
    });
  });

  describe('Phase C: saveLlmJudgeLabels', () => {
    it('persists LLM-judge labels to the DB', () => {
      const labels: LlmJudgeLabel[] = [
        { queryId: 'q1', memoryId: 42, relevance: 3, confidence: 0.95, reasoning: 'Highly relevant' },
        { queryId: 'q2', memoryId: 43, relevance: 1, confidence: 0.6 },
      ];

      const count = saveLlmJudgeLabels(labels);
      expect(count).toBe(2);
    });

    it('updates existing labels on re-insert (REPLACE)', () => {
      const labels1: LlmJudgeLabel[] = [
        { queryId: 'q1', memoryId: 42, relevance: 1, confidence: 0.5 },
      ];
      const labels2: LlmJudgeLabel[] = [
        { queryId: 'q1', memoryId: 42, relevance: 3, confidence: 0.9 },
      ];

      saveLlmJudgeLabels(labels1);
      const count = saveLlmJudgeLabels(labels2);
      expect(count).toBe(1);
    });
  });

  /* --- Agreement Computation --- */

  describe('computeJudgeAgreement', () => {
    it('computes 100% agreement for identical labels', () => {
      const llmLabels: LlmJudgeLabel[] = [
        { queryId: 'q1', memoryId: 42, relevance: 3, confidence: 0.9 },
        { queryId: 'q2', memoryId: 43, relevance: 2, confidence: 0.85 },
        { queryId: 'q3', memoryId: 44, relevance: 1, confidence: 0.7 },
      ];
      const manualLabels: ManualLabel[] = [
        { queryId: 'q1', memoryId: 42, relevance: 3 },
        { queryId: 'q2', memoryId: 43, relevance: 2 },
        { queryId: 'q3', memoryId: 44, relevance: 1 },
      ];

      const result = computeJudgeAgreement(llmLabels, manualLabels);

      expect(result.totalPairs).toBe(3);
      expect(result.exactAgreement).toBe(3);
      expect(result.exactAgreementRate).toBe(1.0);
      expect(result.meetsTarget).toBe(true);
      expect(result.meanGradeDifference).toBe(0);
    });

    it('computes 0% agreement for completely different labels', () => {
      const llmLabels: LlmJudgeLabel[] = [
        { queryId: 'q1', memoryId: 42, relevance: 0, confidence: 0.9 },
        { queryId: 'q2', memoryId: 43, relevance: 0, confidence: 0.9 },
      ];
      const manualLabels: ManualLabel[] = [
        { queryId: 'q1', memoryId: 42, relevance: 3 },
        { queryId: 'q2', memoryId: 43, relevance: 3 },
      ];

      const result = computeJudgeAgreement(llmLabels, manualLabels);

      expect(result.exactAgreement).toBe(0);
      expect(result.exactAgreementRate).toBe(0);
      expect(result.meetsTarget).toBe(false);
      expect(result.meanGradeDifference).toBe(3);
    });

    it('meets the 80% target threshold', () => {
      // 4 out of 5 agree exactly = 80%
      const llmLabels: LlmJudgeLabel[] = [
        { queryId: 'q1', memoryId: 1, relevance: 3, confidence: 0.9 },
        { queryId: 'q2', memoryId: 2, relevance: 2, confidence: 0.9 },
        { queryId: 'q3', memoryId: 3, relevance: 1, confidence: 0.9 },
        { queryId: 'q4', memoryId: 4, relevance: 0, confidence: 0.9 },
        { queryId: 'q5', memoryId: 5, relevance: 2, confidence: 0.9 }, // disagrees
      ];
      const manualLabels: ManualLabel[] = [
        { queryId: 'q1', memoryId: 1, relevance: 3 },
        { queryId: 'q2', memoryId: 2, relevance: 2 },
        { queryId: 'q3', memoryId: 3, relevance: 1 },
        { queryId: 'q4', memoryId: 4, relevance: 0 },
        { queryId: 'q5', memoryId: 5, relevance: 0 }, // disagrees
      ];

      const result = computeJudgeAgreement(llmLabels, manualLabels);

      expect(result.exactAgreementRate).toBe(0.8);
      expect(result.meetsTarget).toBe(true);
    });

    it('fails the 80% target when agreement is below threshold', () => {
      // 3 out of 5 agree = 60%
      const llmLabels: LlmJudgeLabel[] = [
        { queryId: 'q1', memoryId: 1, relevance: 3, confidence: 0.9 },
        { queryId: 'q2', memoryId: 2, relevance: 2, confidence: 0.9 },
        { queryId: 'q3', memoryId: 3, relevance: 1, confidence: 0.9 },
        { queryId: 'q4', memoryId: 4, relevance: 3, confidence: 0.9 }, // disagrees
        { queryId: 'q5', memoryId: 5, relevance: 3, confidence: 0.9 }, // disagrees
      ];
      const manualLabels: ManualLabel[] = [
        { queryId: 'q1', memoryId: 1, relevance: 3 },
        { queryId: 'q2', memoryId: 2, relevance: 2 },
        { queryId: 'q3', memoryId: 3, relevance: 1 },
        { queryId: 'q4', memoryId: 4, relevance: 0 },
        { queryId: 'q5', memoryId: 5, relevance: 0 },
      ];

      const result = computeJudgeAgreement(llmLabels, manualLabels);

      expect(result.exactAgreementRate).toBe(0.6);
      expect(result.meetsTarget).toBe(false);
    });

    it('computes tolerant agreement (+-1 grade)', () => {
      const llmLabels: LlmJudgeLabel[] = [
        { queryId: 'q1', memoryId: 1, relevance: 3, confidence: 0.9 }, // exact match
        { queryId: 'q2', memoryId: 2, relevance: 2, confidence: 0.9 }, // +1 from manual
        { queryId: 'q3', memoryId: 3, relevance: 0, confidence: 0.9 }, // -2 from manual
      ];
      const manualLabels: ManualLabel[] = [
        { queryId: 'q1', memoryId: 1, relevance: 3 },
        { queryId: 'q2', memoryId: 2, relevance: 1 },
        { queryId: 'q3', memoryId: 3, relevance: 2 },
      ];

      const result = computeJudgeAgreement(llmLabels, manualLabels);

      expect(result.exactAgreement).toBe(1);        // only q1
      expect(result.tolerantAgreement).toBe(2);       // q1 + q2
      expect(result.tolerantAgreementRate).toBeCloseTo(2 / 3, 5);
    });

    it('only compares overlapping query-memory pairs', () => {
      const llmLabels: LlmJudgeLabel[] = [
        { queryId: 'q1', memoryId: 1, relevance: 3, confidence: 0.9 },
        { queryId: 'q99', memoryId: 99, relevance: 0, confidence: 0.9 }, // no manual match
      ];
      const manualLabels: ManualLabel[] = [
        { queryId: 'q1', memoryId: 1, relevance: 3 },
        { queryId: 'q50', memoryId: 50, relevance: 2 }, // no LLM match
      ];

      const result = computeJudgeAgreement(llmLabels, manualLabels);

      expect(result.totalPairs).toBe(1); // only q1:1 overlaps
      expect(result.exactAgreement).toBe(1);
      expect(result.exactAgreementRate).toBe(1.0);
    });

    it('returns zeroes for no overlapping pairs', () => {
      const llmLabels: LlmJudgeLabel[] = [
        { queryId: 'q1', memoryId: 1, relevance: 3, confidence: 0.9 },
      ];
      const manualLabels: ManualLabel[] = [
        { queryId: 'q2', memoryId: 2, relevance: 2 },
      ];

      const result = computeJudgeAgreement(llmLabels, manualLabels);

      expect(result.totalPairs).toBe(0);
      expect(result.exactAgreementRate).toBe(0);
      expect(result.meetsTarget).toBe(false);
    });

    it('supports custom target rate', () => {
      const llmLabels: LlmJudgeLabel[] = [
        { queryId: 'q1', memoryId: 1, relevance: 3, confidence: 0.9 },
        { queryId: 'q2', memoryId: 2, relevance: 0, confidence: 0.9 },
      ];
      const manualLabels: ManualLabel[] = [
        { queryId: 'q1', memoryId: 1, relevance: 3 },
        { queryId: 'q2', memoryId: 2, relevance: 2 },
      ];

      // 50% exact agreement — meets 0.5 target but not 0.8
      const result50 = computeJudgeAgreement(llmLabels, manualLabels, 0.5);
      expect(result50.meetsTarget).toBe(true);
      expect(result50.targetRate).toBe(0.5);

      const result80 = computeJudgeAgreement(llmLabels, manualLabels, 0.8);
      expect(result80.meetsTarget).toBe(false);
    });
  });

  /* --- Ground Truth Corpus Size --- */

  describe('getGroundTruthCorpusSize', () => {
    it('returns zeroes when DB is empty', () => {
      const summary = getGroundTruthCorpusSize();

      // Eval_ground_truth may have 0 rows in a fresh test DB
      expect(summary.selectionPairs).toBe(0);
      expect(summary.llmJudgePairs).toBe(0);
      expect(summary.totalPairs).toBeGreaterThanOrEqual(0);
    });

    it('counts user selections correctly', () => {
      recordUserSelection('q1', 42);
      recordUserSelection('q1', 43);
      recordUserSelection('q2', 42);

      const summary = getGroundTruthCorpusSize();

      // 3 distinct query_id:memory_id combinations
      expect(summary.selectionPairs).toBe(3);
    });

    it('counts LLM-judge labels correctly', () => {
      const labels: LlmJudgeLabel[] = [
        { queryId: 'q1', memoryId: 42, relevance: 3, confidence: 0.9 },
        { queryId: 'q2', memoryId: 43, relevance: 2, confidence: 0.8 },
      ];
      saveLlmJudgeLabels(labels);

      const summary = getGroundTruthCorpusSize();

      expect(summary.llmJudgePairs).toBe(2);
    });

    it('reports total as sum of all sources', () => {
      // Add some user selections
      recordUserSelection('q1', 42);
      recordUserSelection('q2', 43);

      // Add some LLM-judge labels
      saveLlmJudgeLabels([
        { queryId: 'q3', memoryId: 44, relevance: 2, confidence: 0.8 },
      ]);

      const summary = getGroundTruthCorpusSize();

      // Total = manual (from eval_ground_truth, probably 0 in test) + 2 selections + 1 llm
      expect(summary.totalPairs).toBe(
        summary.manualPairs + summary.selectionPairs + summary.llmJudgePairs,
      );
      expect(summary.selectionPairs).toBe(2);
      expect(summary.llmJudgePairs).toBe(1);
    });

    it('deduplicates user selections by query_id:memory_id', () => {
      // Record the same memory twice for the same query
      recordUserSelection('q1', 42);
      recordUserSelection('q1', 42);

      const summary = getGroundTruthCorpusSize();

      // Should count as 1 distinct pair despite 2 selection events
      expect(summary.selectionPairs).toBe(1);
    });
  });
});
