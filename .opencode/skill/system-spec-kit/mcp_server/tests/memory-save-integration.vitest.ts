// TEST: MEMORY SAVE INTEGRATION
import { describe, it, expect } from 'vitest';

import * as memorySaveHandler from '../handlers/memory-save';
import * as peGating from '../handlers/pe-gating';
import * as predictionErrorGate from '../lib/cognitive/prediction-error-gate';

function makeCandidate(
  overrides: Partial<{
    id: number;
    similarity: number;
    content: string;
    file_path: string;
  }> = {}
): {
  id: number;
  similarity: number;
  content: string;
  file_path: string;
} {
  return {
    id: 101,
    similarity: 0.9,
    content: 'Deploy feature flags gradually and verify behavior after each rollout step.',
    file_path: '/specs/101-memory.md',
    ...overrides,
  };
}

describe('Memory Save Integration (T501-T550)', () => {
  describe('PE arbitration outcomes', () => {
    it('T501: returns CREATE when no candidates exist', () => {
      const result = predictionErrorGate.evaluateMemory(
        'hash-create',
        'Document the new rollout plan for this spec folder.',
        [],
        { specFolder: 'specs/001-example' }
      );

      expect(result.action).toBe(predictionErrorGate.ACTION.CREATE);
      expect(result.existingMemoryId).toBeNull();
      expect(result.similarity).toBe(0);
      expect(result.reason).toContain('No existing candidates');
    });

    it('T502: near-duplicate candidates route to REINFORCE', () => {
      const result = predictionErrorGate.evaluateMemory(
        'hash-reinforce',
        'Deploy feature flags gradually and verify behavior after each rollout step.',
        [makeCandidate({ similarity: 0.97 })],
        { specFolder: 'specs/001-example' }
      );

      expect(result.action).toBe(predictionErrorGate.ACTION.REINFORCE);
      expect(result.existingMemoryId).toBe(101);
      expect(result.similarity).toBe(0.97);
    });

    it('T503: compatible high-similarity candidates route to UPDATE', () => {
      const result = predictionErrorGate.evaluateMemory(
        'hash-update',
        'Deploy feature flags gradually and verify behavior after every rollout checkpoint.',
        [makeCandidate({ similarity: 0.9 })],
        { specFolder: 'specs/001-example' }
      );

      expect(result.action).toBe(predictionErrorGate.ACTION.UPDATE);
      expect(result.existingMemoryId).toBe(101);
      expect(result.contradiction?.detected ?? false).toBe(false);
    });

    it('T504: contradiction markers in new content route to SUPERSEDE', () => {
      const result = predictionErrorGate.evaluateMemory(
        'hash-supersede',
        'We no longer deploy feature flags gradually; use an immediate cutover instead.',
        [makeCandidate({ similarity: 0.9 })],
        { specFolder: 'specs/001-example' }
      );

      expect(result.action).toBe(predictionErrorGate.ACTION.SUPERSEDE);
      expect(result.existingMemoryId).toBe(101);
      expect(result.contradiction?.detected).toBe(true);
      expect(result.contradiction?.type).toBe('deprecation');
    });

    it('T505: medium-similarity matches route to CREATE_LINKED', () => {
      const result = predictionErrorGate.evaluateMemory(
        'hash-linked',
        'Summarize rollout monitoring dashboards for post-deployment review.',
        [makeCandidate({ similarity: 0.8 })],
        { specFolder: 'specs/001-example' }
      );

      expect(result.action).toBe(predictionErrorGate.ACTION.CREATE_LINKED);
      expect(result.existingMemoryId).toBe(101);
      expect(result.similarity).toBe(0.8);
    });

    it('T506: candidates below LOW_MATCH are filtered out to CREATE', () => {
      const result = predictionErrorGate.evaluateMemory(
        'hash-filtered',
        'Write an unrelated architecture note about database vacuuming.',
        [makeCandidate({ similarity: 0.49 })],
        { specFolder: 'specs/001-example' }
      );

      expect(result.action).toBe(predictionErrorGate.ACTION.CREATE);
      expect(result.existingMemoryId).toBeNull();
      expect(result.reason).toContain('No relevant candidates');
    });

    it('T507: highest relevant candidate wins when multiple are present', () => {
      const result = predictionErrorGate.evaluateMemory(
        'hash-best-match',
        'Deploy feature flags gradually and verify behavior after every rollout checkpoint.',
        [
          makeCandidate({ id: 11, similarity: 0.8 }),
          makeCandidate({ id: 22, similarity: 0.91 }),
          makeCandidate({ id: 33, similarity: 0.72 }),
        ],
        { specFolder: 'specs/001-example' }
      );

      expect(result.action).toBe(predictionErrorGate.ACTION.UPDATE);
      expect(result.existingMemoryId).toBe(22);
      expect(result.similarity).toBe(0.91);
    });
  });

  describe('Save-handler wiring', () => {
    it('T508: PE helpers exported from canonical pe-gating module', () => {
      expect(typeof peGating.findSimilarMemories).toBe('function');
      expect(typeof peGating.reinforceExistingMemory).toBe('function');
      expect(typeof peGating.markMemorySuperseded).toBe('function');
      expect(typeof peGating.updateExistingMemory).toBe('function');
      expect(typeof peGating.logPeDecision).toBe('function');
    });

    it('T509: exported thresholds remain ordered to preserve PE routing', () => {
      expect(predictionErrorGate.THRESHOLD.DUPLICATE).toBeGreaterThan(predictionErrorGate.THRESHOLD.HIGH_MATCH);
      expect(predictionErrorGate.THRESHOLD.HIGH_MATCH).toBeGreaterThan(predictionErrorGate.THRESHOLD.MEDIUM_MATCH);
      expect(predictionErrorGate.THRESHOLD.MEDIUM_MATCH).toBeGreaterThan(predictionErrorGate.THRESHOLD.LOW_MATCH);
    });

    it('T510: conflict records preserve metadata and previews', () => {
      const record = predictionErrorGate.formatConflictRecord(
        predictionErrorGate.ACTION.SUPERSEDE,
        'hash-record',
        88,
        0.91,
        'Contradiction detected',
        { detected: true, type: 'deprecation', description: 'Previous guidance replaced', confidence: 0.75 },
        predictionErrorGate.truncateContent('x'.repeat(250)),
        predictionErrorGate.truncateContent('y'.repeat(40)),
        'specs/001-example'
      );

      expect(record.action).toBe(predictionErrorGate.ACTION.SUPERSEDE);
      expect(record.existing_memory_id).toBe(88);
      expect(record.contradiction_detected).toBe(1);
      expect(record.contradiction_type).toBe('deprecation');
      expect(record.new_content_preview).toHaveLength(203);
      expect(record.spec_folder).toBe('specs/001-example');
    });
  });
});
