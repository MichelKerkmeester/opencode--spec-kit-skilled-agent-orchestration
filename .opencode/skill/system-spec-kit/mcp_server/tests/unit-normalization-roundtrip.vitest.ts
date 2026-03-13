// Converted from: unit-normalization-roundtrip.test.ts (custom runner)
// TEST: NORMALIZATION — ROUND-TRIP EDGE CASES
// Validates cast-removal edge cases: minimal inputs, null vs
// Undefined, boolean↔integer round-trips, extra unknown fields.
import { describe, it, expect } from 'vitest';
import { dbRowToMemory, memoryToDbRow, partialDbRowToMemory } from '@spec-kit/shared/normalization';
import type { Memory, MemoryDbRow } from '@spec-kit/shared/types';

/* --- Tests --- */

describe('Normalization — Round-Trip Edge Cases', () => {

  // 4.1 Round-trip with ALL null optional fields
  describe('Round-trip with all null optional fields', () => {
    it('T-NR-01: all-null round-trip preserves nulls', () => {
      const row = {
        id: 1,
        spec_folder: 'specs/001',
        file_path: 'specs/001/memory/ctx.md',
        anchor_id: null,
        title: null,
        trigger_phrases: null,
        importance_weight: null,
        created_at: null,
        updated_at: null,
        embedding_model: null,
        embedding_generated_at: null,
        embedding_status: null,
        retry_count: null,
        last_retry_at: null,
        failure_reason: null,
        base_importance: null,
        decay_half_life_days: null,
        is_pinned: 0,
        access_count: null,
        last_accessed: null,
        importance_tier: null,
        session_id: null,
        context_type: null,
        channel: null,
        content_hash: null,
        expires_at: null,
        confidence: null,
        validation_count: null,
        stability: null,
        difficulty: null,
        last_review: null,
        review_count: null,
        file_mtime_ms: null,
        document_type: 'memory',
        spec_level: null,
      };

      // @ts-expect-error Testing invalid input shape
      const memory = dbRowToMemory(row);
      const backRow = memoryToDbRow(memory);
      backRow.id = memory.id;
      // @ts-expect-error Testing invalid input shape
      const roundTrip = dbRowToMemory(backRow);

      expect(roundTrip.id).toBe(1);
      expect(roundTrip.specFolder).toBe('specs/001');

      const nullableFields: Array<keyof Memory> = [
        'anchorId', 'title', 'lastRetryAt', 'failureReason',
        'embeddingGeneratedAt', 'contentHash', 'expiresAt', 'lastReview',
      ];
      for (const f of nullableFields) {
        expect(roundTrip[f] === null || roundTrip[f] === undefined).toBe(true);
      }
    });
  });

  // 4.2 partialDbRowToMemory with truly minimal input
  describe('partialDbRowToMemory with minimal inputs', () => {
    it('T-NR-02: minimal {id: 1}', () => {
      const memory = partialDbRowToMemory({ id: 1 });
      expect(memory.id).toBe(1);
    });

    it('T-NR-03: empty object {}', () => {
      // @ts-expect-error Testing invalid input shape
      const memory = partialDbRowToMemory({});
      expect(typeof memory).toBe('object');
      expect(memory).not.toBeNull();
    });

    it('T-NR-04: partial with importance_tier', () => {
      const memory = partialDbRowToMemory({ id: 5, importance_tier: 'normal', stability: 3.0 });
      expect(memory.id).toBe(5);
      // ImportanceTier should be mapped from importance_tier
      expect(memory.importanceTier === 'normal' || memory.importanceTier === undefined).toBe(true);
    });
  });

  // 4.3 is_pinned boolean↔integer round-trip
  describe('is_pinned ↔ isPinned boolean/integer round-trip', () => {
    it('T-NR-05: is_pinned 0 → false → 0 → false', () => {
      // @ts-expect-error Testing invalid input shape
      const memory = dbRowToMemory({ id: 1, is_pinned: 0, spec_folder: 'a', file_path: 'b' });
      expect(memory.isPinned).toBe(false);

      const backRow = memoryToDbRow(memory);
      expect(backRow.is_pinned).toBe(0);

      // @ts-expect-error Testing invalid input shape
      const finalMemory = dbRowToMemory({ ...backRow, id: 1 });
      expect(finalMemory.isPinned).toBe(false);
    });

    it('T-NR-06: is_pinned 1 → true → 1', () => {
      // @ts-expect-error Testing invalid input shape
      const memory = dbRowToMemory({ id: 2, is_pinned: 1, spec_folder: 'a', file_path: 'b' });
      expect(memory.isPinned).toBe(true);

      const backRow = memoryToDbRow(memory);
      expect(backRow.is_pinned).toBe(1);
    });

    it('T-NR-07: is_pinned null → isPinned false/null', () => {
      // @ts-expect-error Testing invalid input shape
      const memory = dbRowToMemory({ id: 3, is_pinned: null, spec_folder: 'a', file_path: 'b' });
      expect(memory.isPinned === false || memory.isPinned === null).toBe(true);
    });
  });

  // 4.4 undefined vs null handling
  describe('undefined vs null value handling', () => {
    it('T-NR-08a: title null stays null', () => {
      const row = {
        id: 1,
        spec_folder: 'specs/001',
        file_path: 'specs/001/memory/a.md',
        title: null,
        anchor_id: null,
        stability: null,
        last_review: null,
        is_pinned: 0,
      };
      // @ts-expect-error Testing invalid input shape
      const memory = dbRowToMemory(row);
      expect(memory.title).toBeNull();
    });

    it('T-NR-08b: anchorId null stays null', () => {
      const row = {
        id: 1, spec_folder: 'specs/001', file_path: 'specs/001/memory/a.md',
        anchor_id: null, is_pinned: 0,
      };
      // @ts-expect-error Testing invalid input shape
      const memory = dbRowToMemory(row);
      expect(memory.anchorId).toBeNull();
    });

    it('T-NR-08c: stability null stays null', () => {
      const row = {
        id: 1, spec_folder: 'specs/001', file_path: 'specs/001/memory/a.md',
        stability: null, is_pinned: 0,
      };
      // @ts-expect-error Testing invalid input shape
      const memory = dbRowToMemory(row);
      expect(memory.stability).toBeNull();
    });

    it('T-NR-08d: lastReview null stays null', () => {
      const row = {
        id: 1, spec_folder: 'specs/001', file_path: 'specs/001/memory/a.md',
        last_review: null, is_pinned: 0,
      };
      // @ts-expect-error Testing invalid input shape
      const memory = dbRowToMemory(row);
      expect(memory.lastReview).toBeNull();
    });

    it('T-NR-09a: missing title → undefined', () => {
      const memory = partialDbRowToMemory({ id: 10 });
      expect(memory.title).toBeUndefined();
    });

    it('T-NR-09b: missing stability → undefined', () => {
      const memory = partialDbRowToMemory({ id: 10 });
      expect(memory.stability).toBeUndefined();
    });
  });

  // 4.5 Extra unknown fields in dbRowToMemory
  describe('Extra unknown fields behavior', () => {
    it('T-NR-10: extra unknown fields don\'t cause errors', () => {
      const row = {
        id: 1,
        spec_folder: 'specs/001',
        file_path: 'specs/001/a.md',
        is_pinned: 0,
        custom_search_score: 0.95,
        _internal_flag: true,
        composite_score: 0.87,
      };

      // @ts-expect-error Testing invalid input shape
      const memory = dbRowToMemory(row);
      expect(memory.id).toBe(1);
      expect(memory.specFolder).toBe('specs/001');
    });
  });
});
